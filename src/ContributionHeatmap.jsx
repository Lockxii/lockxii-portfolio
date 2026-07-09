import { useEffect, useRef, useState } from "react";

const DAY_MS = 86_400_000;
const START_DATE = Date.UTC(2026, 3, 5);
const CONTRIBUTION_COUNTS = [
  0, 23, 0, 6, 0, 0, 0, 0, 0, 0, 13, 57, 11, 50, 12, 7, 12, 2, 0, 0,
  0, 0, 0, 4, 0, 0, 0, 20, 7, 2, 1, 11, 3, 8, 34, 60, 4, 5, 5, 16,
  66, 33, 21, 6, 16, 20, 16, 42, 139, 47, 41, 38, 47, 25, 49, 80, 20,
  21, 26, 24, 24, 11, 26, 30, 16, 48, 39, 37, 76, 59, 0, 16, 40, 19,
  41, 41, 78, 42, 16, 22, 7, 39, 47, 40, 25, 17, 20, 28, 21, 21, 38,
  68, 15, 42, 30, 50, 2, null,
];
const DAYS = CONTRIBUTION_COUNTS.map((count, index) => ({
  count,
  date: new Date(START_DATE + index * DAY_MS),
  week: Math.floor(index / 7),
  weekday: index % 7,
}));

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function contributionLevel(count) {
  if (!count) return 0;
  if (count <= 10) return 1;
  if (count <= 30) return 2;
  if (count <= 60) return 3;
  return 4;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function ContributionHeatmap() {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const hoveredCopy = hoveredDay
    ? `${formatNumber(hoveredDay.count)} contribution${hoveredDay.count === 1 ? "" : "s"} · ${DATE_FORMATTER.format(hoveredDay.date)}`
    : "2,341 contributions · last 14 weeks";

  return (
    <div className="contribution-heatmap" ref={rootRef}>
      <div
        className="contribution-grid"
        onPointerLeave={() => setHoveredDay(null)}
      >
        {DAYS.map((day) => {
          if (day.count === null) {
            return (
              <span
                className="activity-cell is-future"
                aria-hidden="true"
                key={day.date.toISOString()}
              />
            );
          }

          return (
            <button
              type="button"
              className={`activity-cell level-${contributionLevel(day.count)}${inView ? " is-visible" : ""}`}
              style={{
                animationDelay: `${day.week * 45 + day.weekday * 11}ms`,
              }}
              data-tooltip={`${formatNumber(day.count)} contribution${day.count === 1 ? "" : "s"}`}
              data-week={day.week}
              aria-label={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${DATE_FORMATTER.format(day.date)}`}
              onFocus={() => setHoveredDay(day)}
              onBlur={() => setHoveredDay(null)}
              onPointerEnter={() => setHoveredDay(day)}
              key={day.date.toISOString()}
            />
          );
        })}
      </div>

      <p className="activity-caption" aria-live="polite">
        <span>{hoveredCopy}</span>
        <span>Updated Jul 10</span>
      </p>
    </div>
  );
}
