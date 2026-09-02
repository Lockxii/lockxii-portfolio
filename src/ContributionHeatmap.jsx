import { useEffect, useMemo, useRef, useState } from "react";

const DAY_MS = 86_400_000;
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

export function ContributionHeatmap({ language = "en", activity }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const copy = HEATMAP_COPY[language === "fr" ? "fr" : "en"];
  const days = useMemo(() => Array.from({ length: 52 * 7 }, (_, index) => ({
    count: activity.days[index]?.count ?? null,
    level: activity.days[index]?.level ?? 0,
    date: new Date(Date.parse(activity.from) + index * DAY_MS),
    week: Math.floor(index / 7),
    weekday: index % 7,
  })), [activity]);
  const formatters = useMemo(
    () => ({
      date: new Intl.DateTimeFormat(copy.locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
      number: new Intl.NumberFormat(copy.locale),
      plural: new Intl.PluralRules(copy.locale),
    }),
    [copy.locale],
  );

  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [activity.from]);

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
    return `${formatters.number.format(count)} contribution${formatters.plural.select(count) === "one" ? "" : "s"}`;
  }

  const hoveredCopy = hoveredDay
    ? `${contributionCopy(hoveredDay.count)} · ${formatters.date.format(hoveredDay.date)}`
    : `${formatters.number.format(activity.totalContributions)} contributions · ${copy.lastWeeks}`;

  return (
    <div className="contribution-heatmap" ref={rootRef}>
      <div className="contribution-scroll" ref={scrollRef}>
        <div
          className="contribution-grid"
          onPointerLeave={() => setHoveredDay(null)}
        >
          {days.map((day) => {
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
                className={`activity-cell level-${day.level}${inView ? " is-visible" : ""}`}
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
          {copy.updated}{" "}
          <time dateTime={activity.updatedAt}>
            {formatters.date.format(new Date(activity.updatedAt))}
          </time>
        </span>
      </p>
    </div>
  );
}
