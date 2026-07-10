/**
 * Tile wordmark.
 *
 * A word dissolved into a dense grid of squares: a slow morphing colour
 * wave wanders across and lights tiles up, and the cursor drags a soft
 * blob of light that throws the occasional spark. Self-contained: React only.
 */
import { useEffect, useRef } from 'react'

const TAU = Math.PI * 2

const ROWS = [
  {
    word: 'designee',
    font: (px) => `600 ${px}px ui-sans-serif, system-ui, Arial, sans-serif`,
    letterTrack: -0.02,
    fillFrac: 0.92,
  },
]

const MAXSZ = 0.9
const SPEED = 0.02

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const smoothstep = (x, e0, e1) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}
function hash(x, y) {
  const r = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return r - Math.floor(r)
}

const COLOR_STEPS = 24
const ALPHA_STEPS = 6

function createColorSteps(colors) {
  return Array.from({ length: COLOR_STEPS }, (_, index) => {
    const position = (index / COLOR_STEPS) * colors.length
    const colorIndex = Math.floor(position)
    const mix = position - colorIndex
    const from = colors[colorIndex % colors.length]
    const to = colors[(colorIndex + 1) % colors.length]
    const channels = from.map((channel, channelIndex) =>
      Math.round(channel + (to[channelIndex] - channel) * mix),
    )
    return `rgb(${channels.join(',')})`
  })
}

const THEMES = {
  light: {
    rest: 'oklch(0.64 0.006 263)',
    colors: createColorSteps([
      [17, 0, 255],
      [67, 101, 211],
      [93, 131, 196],
      [142, 103, 196],
    ]),
    glow: '67,101,211',
    spark: '93,131,196',
  },
  dark: {
    rest: 'oklch(0.64 0.012 28)',
    colors: createColorSteps([
      [235, 121, 95],
      [203, 105, 112],
      [157, 91, 139],
      [235, 168, 111],
    ]),
    glow: '203,105,112',
    spark: '235,168,111',
  },
}

class TileField {
  host
  canvas
  ctx
  reduced
  word
  theme

  dpr = Math.min(2, window.devicePixelRatio || 1)
  viewW = 0
  viewH = 0
  cell = 10
  time = 0

  n = 0
  px = new Float32Array(0)
  py = new Float32Array(0)
  hueSeed = new Float32Array(0)
  spark = new Uint8Array(0)
  lit = new Float32Array(0)
  seed = new Float32Array(0)

  hasPointer = false
  rawX = 0
  rawY = 0
  lightX = 0
  lightY = 0
  lightSpeed = 0

  raf = 0

  constructor(host, opts = {}) {
    this.host = host
    this.word = opts.word ?? ROWS[0].word
    this.theme = opts.theme === 'dark' ? 'dark' : 'light'

    this.canvas = document.createElement('canvas')
    this.canvas.className = 'tile-wordmark-canvas'
    this.ctx = this.canvas.getContext('2d')
    this.host.appendChild(this.canvas)

    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.resize()

    window.addEventListener('pointermove', this.onMove, { passive: true })
    window.addEventListener('pointerleave', this.onLeave)
  }

  resize() {
    const stage = this.host
    const canvas = this.canvas
    const ctx = this.ctx

    const rect = stage.getBoundingClientRect()
    this.viewW = rect.width
    this.viewH = rect.height
    this.dpr = Math.min(2, window.devicePixelRatio || 1)
    this.cell = Math.max(2, Math.round(this.viewW / 460))
    const cell = this.cell
    const viewW = this.viewW
    const viewH = this.viewH

    canvas.style.width = Math.round(viewW) + 'px'
    canvas.style.height = Math.round(viewH) + 'px'
    canvas.width = Math.ceil(viewW * this.dpr)
    canvas.height = Math.ceil(viewH * this.dpr)
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.imageSmoothingEnabled = false

    const splits = ROWS.length === 1 ? [1] : [0.62, 0.38]
    const bandTops = []
    const bandHeights = []
    let acc = 0
    for (const frac of splits) {
      bandTops.push(acc * viewH)
      bandHeights.push(frac * viewH)
      acc += frac
    }

    const xs = []
    const ys = []
    const sp = []
    const sd = []
    const hs = []

    ROWS.forEach((row, ri) => {
      const bandTop = bandTops[ri]
      const bandH = bandHeights[ri]
      const sc = document.createElement('canvas')
      sc.width = Math.max(1, Math.floor(viewW))
      sc.height = Math.max(1, Math.floor(bandH))
      const s = sc.getContext('2d')
      const sls = s
      s.fillStyle = '#000'
      s.textAlign = 'center'
      s.textBaseline = 'middle'

      let fs = bandH * 0.9
      sls.letterSpacing = `${row.letterTrack * fs}px`
      s.font = row.font(fs)
      const measured = s.measureText(this.word).width || 1
      fs *= (viewW * row.fillFrac) / measured
      sls.letterSpacing = `${row.letterTrack * fs}px`
      s.font = row.font(fs)
      s.fillText(this.word, viewW / 2, bandH / 2)

      const data = s.getImageData(0, 0, sc.width, sc.height).data
      const cols = Math.ceil(viewW / cell)
      const rows = Math.ceil(bandH / cell)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lx = Math.floor(c * cell + cell / 2)
          const ly = Math.floor(r * cell + cell / 2)
          if (lx >= sc.width || ly >= sc.height) continue
          const a = (data[(ly * sc.width + lx) * 4 + 3] ?? 0) / 255
          if (a <= 0.5) continue
          const gx = lx
          const gy = ly + bandTop
          xs.push(gx)
          ys.push(gy)
          sp.push(hash(gx + 7, gy - 3) > 0.82 ? 1 : 0)
          sd.push(hash(gx * 1.3, gy * 0.7))
          hs.push(hash(gx * 0.7 + 11, gy * 1.9 - 5))
        }
      }
    })

    this.n = xs.length
    this.px = new Float32Array(xs)
    this.py = new Float32Array(ys)
    this.spark = new Uint8Array(sp)
    this.seed = new Float32Array(sd)
    this.hueSeed = new Float32Array(hs)
    this.lit = new Float32Array(this.n)

    if (this.reduced && !this.raf) this.renderStatic()
  }

  distSegSq(qx, qy, ax, ay, bx, by) {
    const dx = bx - ax
    const dy = by - ay
    if (dx === 0 && dy === 0) {
      const ex = qx - ax
      const ey = qy - ay
      return ex * ex + ey * ey
    }
    const t = clamp(((qx - ax) * dx + (qy - ay) * dy) / (dx * dx + dy * dy), 0, 1)
    const ex = qx - (ax + dx * t)
    const ey = qy - (ay + dy * t)
    return ex * ex + ey * ey
  }

  frame = (t) => {
    const ctx = this.ctx
    const { viewW, viewH, cell, n, px, py, hueSeed, spark, lit, seed } = this

    ctx.clearRect(0, 0, viewW, viewH)
    this.time += SPEED
    const time = this.time

    const prevX = this.lightX
    const prevY = this.lightY
    if (this.hasPointer) {
      this.lightX += (this.rawX - this.lightX) * 0.5
      this.lightY += (this.rawY - this.lightY) * 0.5
    }
    const lightX = this.lightX
    const lightY = this.lightY
    const stepDist = Math.hypot(lightX - prevX, lightY - prevY)
    this.lightSpeed = 0.9 * this.lightSpeed + 0.1 * stepDist
    const lightSpeed = this.lightSpeed
    const moving = this.hasPointer

    const reach = clamp(viewH * 0.22 + lightSpeed * 0.9, viewH * 0.18, viewH * 0.42)
    const influence = 1.5 * reach
    const influenceSq = influence * influence
    const minX = Math.min(prevX, lightX) - influence
    const maxX = Math.max(prevX, lightX) + influence
    const minY = Math.min(prevY, lightY) - influence
    const maxY = Math.max(prevY, lightY) + influence

    const T = time

    const grayP = new Path2D()
    const litList = []
    const buckets = Array.from({ length: COLOR_STEPS }, () =>
      Array.from({ length: ALPHA_STEPS }, () => new Path2D()),
    )
    const theme = THEMES[this.theme]

    for (let i = 0; i < n; i++) {
      const x = px[i]
      const y = py[i]

      let target = 0
      if (moving && x >= minX && x <= maxX && y >= minY && y <= maxY) {
        const dSq = this.distSegSq(x, y, prevX, prevY, lightX, lightY)
        if (dSq <= influenceSq) {
          const ang = Math.atan2(y - lightY, x - lightX)
          const wobble =
            1 +
            0.3 * Math.sin(3 * ang + time * 1.6) +
            0.16 * Math.sin(5 * ang - time * 1.1 + 1.3)
          const f = clamp(1 - Math.sqrt(dSq) / (reach * wobble), 0, 1)
          target = f * f * (3 - 2 * f)
        }
      }

      const rate = target > lit[i] ? 0.24 : 0.02
      lit[i] += (target - lit[i]) * rate

      const u = x / Math.max(viewW, 1)
      const v = y / Math.max(viewH, 1)
      const flow =
        Math.sin((u * 1.6 + 0.4 * Math.sin(T * 0.3)) * TAU + T * 0.8) +
        0.7 * Math.sin((v * 2.1 - u * 0.9) * TAU - T * 0.6 + 1.7) +
        0.5 * Math.sin((u * 3.3 + v * 2.7) * TAU + T * 0.4 + 4.2) +
        0.4 * Math.cos((v * 1.3 - 1.1 * Math.sin(T * 0.2)) * TAU - T * 0.5)
      let colorAmt = smoothstep(flow, 0.1, 1.6)
      colorAmt = Math.max(colorAmt, lit[i])

      const breathe = 0.5 + 0.5 * Math.sin(seed[i] * TAU + time * 1.3)
      const base = 0.34 + 0.12 * breathe
      const sz = cell * (base + (MAXSZ - base) * colorAmt)
      const h = sz / 2
      grayP.rect(x - h, y - h, sz, sz)

      if (colorAmt > 0.04) {
        const palettePosition =
          ((hueSeed[i] + u * 0.28 + v * 0.12 + time * 0.008 + flow * 0.025) % 1 + 1) % 1
        const colorStep = Math.floor(palettePosition * COLOR_STEPS) % COLOR_STEPS
        const as = Math.min(ALPHA_STEPS - 1, Math.floor(colorAmt * ALPHA_STEPS))
        buckets[colorStep][as].rect(x - h, y - h, sz, sz)
      }

      if (lit[i] > 0.02) litList.push(i)
    }

    ctx.fillStyle = theme.rest
    ctx.fill(grayP)

    for (let colorStep = 0; colorStep < COLOR_STEPS; colorStep++) {
      for (let as = 0; as < ALPHA_STEPS; as++) {
        const p = buckets[colorStep][as]
        ctx.globalAlpha = (as + 1) / ALPHA_STEPS
        ctx.fillStyle = theme.colors[colorStep]
        ctx.fill(p)
      }
    }
    ctx.globalAlpha = 1

    for (const i of litList) {
      const L = lit[i]
      const x = px[i]
      const y = py[i]
      const gsz = cell * (0.7 + (MAXSZ - 0.7) * L)
      const gh = gsz / 2
      if (spark[i]) {
        const ph = seed[i]
        const tt = 0.00025 * t
        const amp = (0.45 + ph) * cell * 0.28
        const jx = x + Math.sin(0.05 * x + 1.3 * tt + ph * TAU) * amp
        const jy = y + Math.cos(0.04 * y - 0.9 * tt + ph * TAU) * amp
        ctx.fillStyle = `rgba(${theme.spark},${(0.1 * L).toFixed(3)})`
        ctx.fillRect(jx - gh * 1.5, jy - gh * 1.5, gsz * 1.5, gsz * 1.5)
        ctx.fillStyle = `rgba(${theme.spark},${(0.55 * L).toFixed(3)})`
        ctx.fillRect(jx - gh, jy - gh, gsz, gsz)
      } else {
        ctx.fillStyle = `rgba(${theme.glow},${(0.85 * L).toFixed(3)})`
        ctx.fillRect(x - gh, y - gh, gsz, gsz)
      }
    }

    this.raf = requestAnimationFrame(this.frame)
  }

  renderStatic() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.viewW, this.viewH)
    const grayP = new Path2D()
    for (let i = 0; i < this.n; i++) {
      const sz = this.cell * 0.5
      const h = sz / 2
      grayP.rect(this.px[i] - h, this.py[i] - h, sz, sz)
    }
    ctx.fillStyle = THEMES[this.theme].rest
    ctx.fill(grayP)
  }

  onMove = (e) => {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (x >= -40 && y >= -40 && x <= rect.width + 40 && y <= rect.height + 40) {
      if (!this.hasPointer) {
        this.hasPointer = true
        this.lightX = x
        this.lightY = y
        this.lightSpeed = 0
      }
      this.rawX = x
      this.rawY = y
    } else {
      this.hasPointer = false
    }
  }

  onLeave = () => {
    this.hasPointer = false
  }

  start() {
    if (this.reduced) return
    if (!this.raf) this.raf = requestAnimationFrame(this.frame)
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  destroy() {
    this.stop()
    window.removeEventListener('pointermove', this.onMove)
    window.removeEventListener('pointerleave', this.onLeave)
    this.canvas.remove()
  }
}

export function TileWordmark({ word = 'designee', className = '', theme = 'light' }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const field = new TileField(host, { word, theme })

    const resizeObserver = new ResizeObserver(() => field.resize())
    resizeObserver.observe(host)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting ?? true) field.start()
      else field.stop()
    })
    intersectionObserver.observe(host)

    field.start()

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      field.destroy()
    }
  }, [word, theme])

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={word}
      className={['tile-wordmark', className].filter(Boolean).join(' ')}
    />
  )
}
