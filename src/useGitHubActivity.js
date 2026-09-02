import { useEffect, useRef, useState } from "react";
import fallback from "./data/github-activity.json";
import { createSnapshot } from "./github-activity.js";

const STORAGE_KEY = "portfolio-github-activity";
const REFRESH_MS = 6 * 60 * 60 * 1000;

export function useGitHubActivity() {
  const [activity, setActivity] = useState(() => {
    try {
      const saved = createSnapshot(JSON.parse(window.localStorage.getItem(STORAGE_KEY)));
      if (saved.updatedAt > fallback.updatedAt) return saved;
    } catch {
      // A missing or invalid cached snapshot never prevents rendering.
    }
    return fallback;
  });
  const latestRefresh = useRef(activity.updatedAt);

  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch("/api/github-activity", {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const next = createSnapshot(await response.json());
        if (controller.signal.aborted || next.updatedAt < latestRefresh.current) return;
        latestRefresh.current = next.updatedAt;
        setActivity(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Refresh still works when browser storage is unavailable.
        }
      } catch {
        // Keep the last valid figures and their original refresh date.
      }
    }
    refresh();
    const interval = window.setInterval(refresh, REFRESH_MS);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, []);

  return activity;
}
