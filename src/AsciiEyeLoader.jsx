import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "lockxii-ascii-loader-v2";
const EXIT_MS = 420;
const DISPLAY_MS = 1900;
const COLS = 79;
const ROWS = 75;

function hash(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function glyph(value) {
  if (value > 0.86) return "*";
  if (value > 0.63) return "+";
  if (value > 0.34) return ":";
  return ".";
}

function createEyeLayers() {
  const shell = [];
  const iris = [];
  const centerX = (COLS - 1) / 2;
  const centerY = (ROWS - 1) / 2;

  for (let row = 0; row < ROWS; row += 1) {
    const shellRow = [];
    const irisRow = [];

    for (let column = 0; column < COLS; column += 1) {
      const x = (column - centerX) / centerX;
      const y = (row - centerY) / centerY;
      const random = hash(column, row);
      const absX = Math.abs(x);
      const eyeHeight =
        absX < 1 ? 0.22 * Math.pow(1 - Math.pow(absX, 1.38), 0.72) : 0;
      const insideEye = absX < 0.98 && Math.abs(y) < eyeHeight;
      const lidDistance = Math.abs(Math.abs(y) - eyeHeight);
      const onLid = absX < 0.98 && lidDistance < 0.058 + random * 0.02;

      const diamond = absX * 0.74 + Math.abs(y) * 0.82;
      const inAura = diamond < 0.92 && diamond > 0.46;
      const verticalRay =
        Math.abs(x) < 0.058 + random * 0.03 &&
        Math.abs(y) > 0.32 &&
        Math.abs(y) < 0.95;
      const sideRay =
        Math.abs(y) < 0.08 + random * 0.025 &&
        absX > 0.62 &&
        absX < 0.98;
      const auraDot = inAura && random > 0.68 + diamond * 0.1;
      const innerDust = insideEye && random > 0.9;

      let shellCharacter = " ";
      if (onLid) shellCharacter = glyph(1 - lidDistance * 9 + random * 0.18);
      else if (verticalRay || sideRay) shellCharacter = random > 0.34 ? ":" : ".";
      else if (auraDot || innerDust) shellCharacter = glyph(random * 0.72);

      const irisX = x / 0.55;
      const irisY = y / 0.65;
      const radius = Math.hypot(irisX, irisY);
      const irisVisible = insideEye && radius < 0.96 && radius > 0.44;
      let irisCharacter = " ";
      if (irisVisible && random > 0.18) {
        const ring = 1 - Math.abs(radius - 0.61);
        irisCharacter = glyph(ring * 0.78 + random * 0.38);
      } else if (insideEye && radius <= 0.44 && random > 0.94) {
        irisCharacter = ".";
      }

      shellRow.push(shellCharacter);
      irisRow.push(irisCharacter);
    }

    shell.push(shellRow.join(""));
    iris.push(irisRow.join(""));
  }

  return {
    shell: shell.join("\n"),
    iris: iris.join("\n"),
  };
}

const EYE = createEyeLayers();

function isForcedLoader() {
  return new URLSearchParams(window.location.search).get("loader") === "1";
}

function shouldShowLoader() {
  if (typeof window === "undefined") return false;

  if (isForcedLoader()) return true;

  try {
    return window.sessionStorage.getItem(SESSION_KEY) !== "seen";
  } catch {
    return true;
  }
}

export function AsciiEyeLoader() {
  const [visible, setVisible] = useState(shouldShowLoader);
  const [leaving, setLeaving] = useState(false);
  const loaderRef = useRef(null);
  const exitTimerRef = useRef(0);
  const leavingRef = useRef(false);

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;

    try {
      window.sessionStorage.setItem(SESSION_KEY, "seen");
    } catch {
      // The intro can still close when storage is unavailable.
    }

    setLeaving(true);
    exitTimerRef.current = window.setTimeout(() => setVisible(false), EXIT_MS);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    const main = document.querySelector("main");
    const mainWasInert = main?.inert ?? false;
    document.body.style.overflow = "hidden";
    if (main) main.inert = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 500 : isForcedLoader() ? 5000 : DISPLAY_MS;
    const timer = window.setTimeout(dismiss, duration);
    const onKeyDown = (event) => {
      if (event.key === "Enter" || event.key === "Escape" || event.key === " ") {
        event.preventDefault();
        dismiss();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(exitTimerRef.current);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = mainWasInert;
    };
  }, [dismiss, visible]);

  if (!visible) return null;

  function trackPointer(event) {
    const loader = loaderRef.current;
    if (!loader) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    loader.style.setProperty("--eye-x", `${Math.max(-1, Math.min(1, x)) * 5}px`);
    loader.style.setProperty("--eye-y", `${Math.max(-1, Math.min(1, y)) * 3}px`);
  }

  return (
    <div
      ref={loaderRef}
      className={`ascii-loader${leaving ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Lockxii portfolio"
      onPointerMove={trackPointer}
    >
      <div className="ascii-eye" aria-hidden="true">
        <div className="ascii-eye-blink">
          <pre className="ascii-eye-shell">{EYE.shell}</pre>
          <div className="ascii-eye-iris-track">
            <pre className="ascii-eye-iris">{EYE.iris}</pre>
            <span className="ascii-eye-pupil">@</span>
          </div>
        </div>
      </div>

      <button className="ascii-loader-prompt" type="button" onClick={dismiss}>
        <span>[ initializing lockxii ]</span>
        <span>enter portfolio</span>
      </button>
    </div>
  );
}
