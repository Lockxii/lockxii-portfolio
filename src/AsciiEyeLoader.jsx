import { useCallback, useEffect, useRef, useState } from "react";
import { EYE_COLS, EYE_IRIS, EYE_PUPIL, EYE_SHELL } from "./asciiEyeArt.js";

const SESSION_KEY = "lockxii-ascii-loader-v6";
const EXIT_MS = 420;
const DISPLAY_MS = 2800;

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

  return (
    <div
      className={`ascii-loader${leaving ? " is-leaving" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onPointerDown={dismiss}
    >
      <div
        className="ascii-eye"
        style={{ "--eye-cols": EYE_COLS }}
        aria-hidden="true"
      >
        <pre className="ascii-eye-shell">{EYE_SHELL}</pre>
        <div className="ascii-eye-gaze-track">
          <pre className="ascii-eye-iris">{EYE_IRIS}</pre>
          <div className="ascii-eye-pupil-track">
            <pre className="ascii-eye-pupil">{EYE_PUPIL}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
