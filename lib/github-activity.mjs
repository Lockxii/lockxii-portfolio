import { contributionRange, createSnapshot } from "../src/github-activity.js";

function attribute(attributes, name) {
  return attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}

// Read only the public contribution calendar, never authenticated profile data.
export function parseCalendar(html, now) {
  const counts = new Map();
  for (const [, attributes, text] of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attribute(attributes, "for");
    const match = text.trim().match(/^(No|[\d,]+) contributions?\s/);
    if (id && match) counts.set(id, match[1] === "No" ? 0 : Number(match[1].replaceAll(",", "")));
  }

  const { from, to } = contributionRange(now);
  const days = [];
  for (const [, attributes] of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = attribute(attributes, "data-date");
    if (!date || date < from || date > to) continue;
    const level = attribute(attributes, "data-level");
    days.push({
      date,
      count: counts.get(attribute(attributes, "id")),
      level: level === undefined ? NaN : Number(level),
    });
  }
  // GitHub renders rows by weekday; the portfolio needs chronological days.
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchActivity({ now = new Date(), fetcher = fetch } = {}) {
  const headers = { "User-Agent": "lockxii-portfolio", "Accept-Language": "en-US" };
  const [calendarResponse, profileResponse] = await Promise.all([
    fetcher("https://github.com/users/Lockxii/contributions", {
      headers, signal: AbortSignal.timeout(15_000),
    }),
    fetcher("https://api.github.com/users/Lockxii", {
      headers: { ...headers, Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(15_000),
    }),
  ]);
  if (!calendarResponse.ok || !profileResponse.ok) {
    throw new Error(`GitHub returned HTTP ${!calendarResponse.ok ? calendarResponse.status : profileResponse.status}; keeping the previous snapshot.`);
  }
  const [html, profile] = await Promise.all([calendarResponse.text(), profileResponse.json()]);
  if (profile.login !== "Lockxii") throw new Error("Unexpected GitHub profile.");
  return createSnapshot({
    days: parseCalendar(html, now),
    publicRepos: profile.public_repos,
    updatedAt: now.toISOString(),
  });
}
