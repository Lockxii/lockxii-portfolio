import assert from "node:assert/strict";
import { mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { contributionRange, createSnapshot, refreshActivity } from "./update-github-activity.mjs";

const NOW = new Date("2026-09-02T12:00:00.000Z");

function githubResponse() {
  const days = Array.from({ length: 361 }, (_, index) => ({
    date: new Date(Date.UTC(2025, 8, 7 + index)).toISOString().slice(0, 10),
    contributionCount: index === 360 ? 5 : 0,
    contributionLevel: index === 360 ? "FOURTH_QUARTILE" : "NONE",
  }));
  return {
    repositories: { totalCount: 10 },
    contributionsCollection: {
      totalCommitContributions: 2,
      restrictedContributionsCount: 3,
      contributionCalendar: { totalContributions: 5, weeks: [{ contributionDays: days }] },
    },
  };
}

test("the displayed range starts on Sunday and contains 52 week columns", () => {
  assert.deepEqual(contributionRange(NOW), {
    from: "2025-09-07T00:00:00.000Z",
    to: "2026-09-02T12:00:00.000Z",
  });
  assert.equal(contributionRange(new Date("2026-09-06T00:01:00Z")).from, "2025-09-14T00:00:00.000Z");
  assert.equal(contributionRange(new Date("2026-09-05T23:59:59Z")).from, "2025-09-07T00:00:00.000Z");
});

test("calendar boundaries survive New Year and leap day", () => {
  assert.equal(contributionRange(new Date("2027-01-01T12:00:00Z")).from, "2026-01-04T00:00:00.000Z");
  assert.equal(contributionRange(new Date("2024-02-29T12:00:00Z")).from, "2023-03-05T00:00:00.000Z");
});

test("the headline and heatmap share one total and preserve real GitHub levels", () => {
  const snapshot = createSnapshot(githubResponse(), NOW);
  assert.equal(snapshot.totalContributions, 5);
  assert.equal(snapshot.publicCommits, 2);
  assert.equal(snapshot.privateContributions, 3);
  assert.equal(snapshot.publicRepos, 10);
  assert.equal(snapshot.days.length, 361);
  assert.deepEqual(snapshot.days.at(-1), { date: "2026-09-02", count: 5, level: 4 });
});

test("missing, duplicate, or inconsistent calendar data is rejected", () => {
  const missing = githubResponse();
  missing.contributionsCollection.contributionCalendar.weeks[0].contributionDays.pop();
  assert.throws(() => createSnapshot(missing, NOW), /Incomplete/);
  const duplicate = githubResponse();
  const days = duplicate.contributionsCollection.contributionCalendar.weeks[0].contributionDays;
  days[1] = days[0];
  assert.throws(() => createSnapshot(duplicate, NOW), /Incomplete/);
  const inconsistent = githubResponse();
  inconsistent.contributionsCollection.contributionCalendar.totalContributions = 6;
  assert.throws(() => createSnapshot(inconsistent, NOW), /do not match/);
});

test("HTTP and GraphQL failures leave the last valid snapshot untouched", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-activity-"));
  const output = join(directory, "activity.json");
  await writeFile(output, "previous snapshot");
  t.after(async () => { await unlink(output); await rmdir(directory); });
  await assert.rejects(refreshActivity({
    token: "test-token", now: NOW, output,
    fetcher: async () => new Response("unavailable", { status: 503 }),
  }), /HTTP 503/);
  await assert.rejects(refreshActivity({
    token: "test-token", now: NOW, output,
    fetcher: async () => Response.json({ errors: [{ message: "Rate limited" }] }),
  }), /rejected/);
  await assert.rejects(refreshActivity({
    token: "test-token", now: NOW, output,
    fetcher: async () => Response.json({ data: { user: null } }),
  }), /Missing/);
  assert.equal(await readFile(output, "utf8"), "previous snapshot");
});

test("a successful refresh writes only the public snapshot, never the credential", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-activity-"));
  const output = join(directory, "activity.json");
  t.after(async () => { await unlink(output); await rmdir(directory); });
  const snapshot = await refreshActivity({
    token: "test-token", now: NOW, output,
    fetcher: async (url, options) => {
      assert.equal(url, "https://api.github.com/graphql");
      assert.equal(options.headers.Authorization, "Bearer test-token");
      assert.deepEqual(JSON.parse(options.body).variables, { login: "Lockxii", ...contributionRange(NOW) });
      return Response.json({ data: { user: githubResponse() } });
    },
  });
  const saved = await readFile(output, "utf8");
  assert.deepEqual(JSON.parse(saved), snapshot);
  assert.ok(!saved.includes("test-token"));
});
