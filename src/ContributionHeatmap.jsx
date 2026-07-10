import { useEffect, useMemo, useRef, useState } from "react";

const DAY_MS = 86_400_000;
const START_DATE = Date.UTC(2025, 6, 13);
const UPDATE_DATE = new Date(Date.UTC(2026, 6, 10));
const TOTAL_CONTRIBUTIONS = 3198;
const CONTRIBUTION_COUNTS = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  0, 0, 16, 16, 0, 9, 23, 7, 0, 0, 0, 0, 0, 0,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3,
  2, 3, 3, 3, 38, 13, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 9, 0, 21, 28, 6, 10, 20,
  0, 24, 38, 26, 2, 0, 8, 1, 0, 0, 0, 0, 0, 16,
  29, 3, 21, 0, 14, 7, 6, 15, 21, 19, 3, 0, 0, 4,
  7, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23,
  35, 0, 0, 4, 0, 0, 4, 75, 18, 21, 9, 8, 0, 29,
  38, 4, 38, 10, 8, 4, 5, 8, 2, 0, 1, 0, 1, 0,
  0, 23, 0, 6, 0, 0, 0, 0, 0, 0, 13, 57, 11, 50,
  12, 7, 12, 2, 0, 0, 0, 0, 0, 4, 0, 0, 0, 20,
  7, 2, 1, 11, 3, 8, 34, 60, 4, 5, 5, 16, 66, 33,
  21, 6, 16, 20, 16, 42, 139, 47, 41, 38, 47, 25, 49, 80,
  20, 21, 26, 24, 24, 11, 26, 30, 16, 48, 39, 37, 76, 59,
  0, 16, 40, 19, 41, 41, 78, 42, 16, 22, 7, 39, 47, 40,
  25, 17, 20, 28, 21, 21, 38, 68, 15, 42, 30, 50, 6, null,
];
const DAYS = CONTRIBUTION_COUNTS.map((count, index) => ({
  count,
  date: new Date(START_DATE + index * DAY_MS),
  week: Math.floor(index / 7),
  weekday: index % 7,
}));

const HEATMAP_COPY = {
  en: {
    locale: "en-US",
    lastWeeks: "last 52 weeks",
    on: "on",
    updated: "Updated",
  },
  fr: {
    locale: "fr-FR",
    lastWeeks: "52 dernières semaines",
    on: "le",
    updated: "Mis à jour le",
  },
};

function contributionLevel(count) {
  if (!count) return 0;
  if (count <= 10) return 1;
  if (count <= 30) return 2;
  if (count <= 60) return 3;
  return 4;
}

export function ContributionHeatmap({ language = "en" }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const copy = HEATMAP_COPY[language === "fr" ? "fr" : "en"];
  const formatters = useMemo(
    () => ({
      date: new Intl.DateTimeFormat(copy.locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
      shortDate: new Intl.DateTimeFormat(copy.locale, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      number: new Intl.NumberFormat(copy.locale),
    }),
    [copy.locale],
  );

  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, []);

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

  function contributionCopy(count) {
    return `${formatters.number.format(count)} contribution${count === 1 ? "" : "s"}`;
  }

  const hoveredCopy = hoveredDay
    ? `${contributionCopy(hoveredDay.count)} · ${formatters.date.format(hoveredDay.date)}`
    : `${formatters.number.format(TOTAL_CONTRIBUTIONS)} contributions · ${copy.lastWeeks}`;

  return (
    <div className="contribution-heatmap" ref={rootRef}>
      <div className="contribution-scroll" ref={scrollRef}>
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
                  animationDelay: `${day.week * 14 + day.weekday * 5}ms`,
                }}
                data-tooltip={contributionCopy(day.count)}
                data-week={day.week}
                aria-label={`${contributionCopy(day.count)} ${copy.on} ${formatters.date.format(day.date)}`}
                onFocus={() => setHoveredDay(day)}
                onBlur={() => setHoveredDay(null)}
                onPointerEnter={() => setHoveredDay(day)}
                key={day.date.toISOString()}
              />
            );
          })}
        </div>
      </div>

      <p className="activity-caption" aria-live="polite">
        <span>{hoveredCopy}</span>
        <span>
          {copy.updated} {formatters.shortDate.format(UPDATE_DATE)}
        </span>
      </p>
    </div>
  );
}
