import assert from "node:assert/strict";
import { mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { contributionRange, createSnapshot } from "../src/github-activity.js";
import { parseCalendar } from "../lib/github-activity.mjs";
import { refreshActivity } from "./update-github-activity.mjs";

const NOW = new Date("2026-09-02T12:00:00.000Z");

function calendarDays() {
  return Array.from({ length: 361 }, (_, index) => ({
    date: new Date(Date.UTC(2025, 8, 7 + index)).toISOString().slice(0, 10),
    count: [0, 1, 2, 100, 358, 359, 360].includes(index) ? 5 : 0,
    level: [0, 1, 2, 100, 358, 359, 360].includes(index) ? 4 : 0,
  }));
}

function calendarHTML() {
  return calendarDays().reverse().map((day, index) =>
    '<td data-date="' + day.date + '" id="day-' + index + '" data-level="' + day.level + '"></td>' +
    '<tool-tip for="day-' + index + '">' + (day.count || "No") + ' contributions on this day.</tool-tip>'
  ).join("\n");
}

function fakeGitHub(url) {
  return Promise.resolve(url.includes("api.github.com")
    ? Response.json({ login: "Lockxii", public_repos: 10 })
    : new Response(calendarHTML()));
}

test("the range stays Sunday-aligned across week, year, and leap-day boundaries", () => {
  assert.deepEqual(contributionRange(NOW), { from: "2025-09-07", to: "2026-09-02" });
  assert.equal(contributionRange(new Date("2026-09-06T00:01:00Z")).from, "2025-09-14");
  assert.equal(contributionRange(new Date("2026-09-05T23:59:59Z")).from, "2025-09-07");
  assert.equal(contributionRange(new Date("2027-01-01T12:00:00Z")).from, "2026-01-04");
  assert.equal(contributionRange(new Date("2024-02-29T12:00:00Z")).from, "2023-03-05");
});

test("public calendar cells are matched to their counts and sorted chronologically", () => {
  assert.deepEqual(parseCalendar(calendarHTML(), NOW), calendarDays());
  const changed = calendarHTML().replace("5 contributions", "1,234 contributions");
  assert.equal(parseCalendar(changed, NOW).at(-1).count, 1234);
});

test("contributions, active days, and streaks come from exactly the visible calendar", () => {
  const snapshot = createSnapshot({ days: calendarDays(), publicRepos: 10, updatedAt: NOW.toISOString() });
  assert.equal(snapshot.totalContributions, 35);
  assert.equal(snapshot.activeDays, 7);
  assert.equal(snapshot.longestStreak, 3);
  assert.equal(snapshot.publicRepos, 10);
  assert.equal(snapshot.days.length, 361);
  assert.equal(snapshot.days.at(-1).date, "2026-09-02");
});

test("missing days, duplicate dates, invalid counts, and changed markup are rejected", () => {
  const input = { days: calendarDays(), publicRepos: 10, updatedAt: NOW.toISOString() };
  assert.throws(() => createSnapshot({ ...input, days: input.days.slice(1) }), /calendar/);
  const duplicate = calendarDays();
  duplicate[1] = duplicate[0];
  assert.throws(() => createSnapshot({ ...input, days: duplicate }), /calendar/);
  const invalid = calendarDays();
  invalid[0].count = -1;
  assert.throws(() => createSnapshot({ ...input, days: invalid }), /calendar/);
  const missingTooltips = calendarHTML().replaceAll("tool-tip", "unknown-element");
  assert.throws(() => createSnapshot({ ...input, days: parseCalendar(missingTooltips, NOW) }), /calendar/);
});

test("upstream failures never overwrite the last valid snapshot", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-activity-"));
  const output = join(directory, "activity.json");
  await writeFile(output, "previous snapshot");
  t.after(async () => { await unlink(output); await rmdir(directory); });
  await assert.rejects(refreshActivity({
    now: NOW, output, fetcher: async () => new Response("unavailable", { status: 503 }),
  }), /HTTP 503/);
  await assert.rejects(refreshActivity({
    now: NOW, output, fetcher: async (url) => url.includes("api.github.com")
      ? Response.json({ login: "Lockxii", public_repos: 10 }) : new Response("<html>Changed markup</html>"),
  }), /calendar/);
  assert.equal(await readFile(output, "utf8"), "previous snapshot");
});

test("a successful refresh needs no token and writes only normalized public data", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-activity-"));
  const output = join(directory, "activity.json");
  t.after(async () => { await unlink(output); await rmdir(directory); });
  const snapshot = await refreshActivity({
    now: NOW, output,
    fetcher: async (url, options) => {
      assert.equal(options.headers.Authorization, undefined);
      return fakeGitHub(url);
    },
  });
  assert.deepEqual(JSON.parse(await readFile(output, "utf8")), snapshot);
});
