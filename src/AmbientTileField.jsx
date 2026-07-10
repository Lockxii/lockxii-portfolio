import { useEffect, useRef } from "react";

const DESKTOP_QUERY =
  "(min-width: 1101px) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const TAU = Math.PI * 2;
const MAX_TILES = 1500;

const PALETTES = {
  light: [
    [17, 0, 255],
    [67, 101, 211],
    [93, 131, 196],
    [142, 103, 196],
  ],
  dark: [
    [235, 121, 95],
    [203, 105, 112],
    [157, 91, 139],
    [235, 168, 111],
  ],
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function smoothstep(value, start, end) {
  const t = clamp((value - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function nextTileState(tile, theme, now) {
  const palette = PALETTES[theme];
  const energy = Math.random();
  const accent = Math.random();
  const isPulse = energy > 0.9;
  const baseRange = theme === "dark" ? [0.06, 0.14] : [0.07, 0.16];
  const pulseRange = theme === "dark" ? [0.22, 0.3] : [0.2, 0.27];
  const range = isPulse ? pulseRange : baseRange;
  const amount = isPulse ? (energy - 0.9) / 0.1 : energy / 0.9;

  tile.targetAlpha = range[0] + (range[1] - range[0]) * amount;
  tile.targetColor = palette[Math.floor(accent * palette.length)];
  tile.nextAt = now + 900 + Math.random() * 1700;
}

export function AmbientTileField({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let width = 0;
    let height = 0;
    let tiles = [];
    let animationFrame = 0;
    let resizeFrame = 0;
    let lastFrame = 0;

    function buildTiles() {
      tiles = [];
      if (!desktopQuery.matches) return;

      const pitch = clamp(Math.round(width / 88), 18, 22);
      const center = width / 2;
      const quietHalfWidth = 350;
      const now = performance.now();

      for (let row = 0, y = pitch / 2; y < height; row += 1, y += pitch) {
        for (let column = 0, x = pitch / 2; x < width; column += 1, x += pitch) {
          const distanceFromCenter = Math.abs(x - center);
          const edgeFade = smoothstep(distanceFromCenter, quietHalfWidth, quietHalfWidth + 150);
          const presence = hash(column + 13, row - 7);

          if (edgeFade <= 0 || presence < 0.58) continue;

          const seed = hash(column * 1.7 + 5, row * 0.9 - 3);
          const palette = PALETTES[theme];
          const color = palette[Math.floor(seed * palette.length)];
          const tile = {
            x: x + (hash(column + 31, row + 17) - 0.5) * 3,
            y: y + (hash(column - 19, row + 29) - 0.5) * 3,
            size: 3.5 + hash(column + 71, row - 43) * 3,
            edgeFade,
            phase: seed * TAU,
            alpha: theme === "dark" ? 0.06 + seed * 0.08 : 0.07 + seed * 0.09,
            targetAlpha: 0,
            color: [...color],
            targetColor: color,
            nextAt: now + seed * 1500,
          };

          nextTileState(tile, theme, now);
          tiles.push(tile);
        }
      }

      if (tiles.length > MAX_TILES) {
        const stride = tiles.length / MAX_TILES;
        tiles = Array.from(
          { length: MAX_TILES },
          (_, index) => tiles[Math.floor(index * stride)],
        );
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = 1;

      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = false;
      buildTiles();
      render(performance.now(), true);
    }

    function render(now, staticFrame = false) {
      context.clearRect(0, 0, width, height);
      if (!desktopQuery.matches) return;

      const delta = lastFrame ? Math.min(now - lastFrame, 80) : 16;
      const easing = staticFrame ? 1 : 1 - Math.exp(-delta / 700);

      for (const tile of tiles) {
        if (!staticFrame && now >= tile.nextAt) nextTileState(tile, theme, now);

        tile.alpha += (tile.targetAlpha - tile.alpha) * easing;
        for (let channel = 0; channel < 3; channel += 1) {
          tile.color[channel] +=
            (tile.targetColor[channel] - tile.color[channel]) * easing;
        }

        const diagonalWave = staticFrame
          ? 0.5
          : 0.5 +
            0.5 * Math.sin(tile.x * 0.008 + tile.y * 0.003 - now * 0.00065);
        const crossWave = staticFrame
          ? 0.5
          : 0.5 +
            0.5 *
              Math.sin(tile.x * 0.004 - tile.y * 0.006 + now * 0.00042 + tile.phase * 0.18);
        const wave = 0.72 + 0.28 * (diagonalWave * 0.7 + crossWave * 0.3);
        const waveAccent = staticFrame
          ? 0
          : smoothstep(diagonalWave * 0.72 + crossWave * 0.28, 0.62, 0.94) *
            (theme === "dark" ? 0.085 : 0.065);
        const alpha = (tile.alpha * wave + waveAccent) * tile.edgeFade;

        context.fillStyle = `rgba(${Math.round(tile.color[0])}, ${Math.round(tile.color[1])}, ${Math.round(tile.color[2])}, ${alpha.toFixed(3)})`;
        context.fillRect(
          Math.round(tile.x - tile.size / 2),
          Math.round(tile.y - tile.size / 2),
          tile.size,
          tile.size,
        );
      }

      lastFrame = now;
    }

    function animate(now) {
      animationFrame = 0;
      if (!desktopQuery.matches || document.hidden || reducedQuery.matches) return;

      if (now - lastFrame >= 42) render(now);
      animationFrame = window.requestAnimationFrame(animate);
    }

    function start() {
      if (
        animationFrame ||
        !desktopQuery.matches ||
        document.hidden ||
        reducedQuery.matches
      ) {
        return;
      }
      lastFrame = 0;
      animationFrame = window.requestAnimationFrame(animate);
    }

    function stop() {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    function queueResize() {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
        start();
      });
    }

    function handleVisibility() {
      if (document.hidden) stop();
      else start();
    }

    function handleMotionChange() {
      if (reducedQuery.matches) {
        stop();
        render(performance.now(), true);
      } else {
        start();
      }
    }

    window.addEventListener("resize", queueResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    desktopQuery.addEventListener("change", queueResize);
    reducedQuery.addEventListener("change", handleMotionChange);

    resize();
    start();

    return () => {
      stop();
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", queueResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      desktopQuery.removeEventListener("change", queueResize);
      reducedQuery.removeEventListener("change", handleMotionChange);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="ambient-tile-field" aria-hidden="true" />;
}
