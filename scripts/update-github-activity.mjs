import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const USERNAME = "Lockxii";
const DAY_MS = 86_400_000;
const OUTPUT = new URL("../src/data/github-activity.json", import.meta.url);
const LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];

const QUERY = `
  query PortfolioActivity($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }
`;

// Sunday-aligned: 51 past weeks plus the current, possibly incomplete week.
export function contributionRange(now) {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - (today.getUTCDay() + 51 * 7) * DAY_MS);
  return { from: start.toISOString(), to: now.toISOString() };
}

function count(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid GitHub ${label}; keeping the previous snapshot.`);
  }
  return value;
}

export function createSnapshot(user, now) {
  const range = contributionRange(now);
  const from = range.from.slice(0, 10);
  const to = range.to.slice(0, 10);
  const collection = user?.contributionsCollection;
  const calendar = collection?.contributionCalendar;
  if (!Array.isArray(calendar?.weeks)) {
    throw new Error("Missing GitHub calendar; keeping the previous snapshot.");
  }

  const days = calendar.weeks.flatMap((week) => week.contributionDays)
    .filter((day) => day.date >= from && day.date <= to)
    .map((day) => {
      const level = LEVELS.indexOf(day.contributionLevel);
      if (level < 0) throw new Error("Invalid GitHub contribution level.");
      return { date: day.date, count: count(day.contributionCount, "daily count"), level };
    });

  const expectedDays = Math.floor((Date.parse(to) - Date.parse(from)) / DAY_MS) + 1;
  if (days.length !== expectedDays || days.some((day, index) =>
    day.date !== new Date(Date.parse(from) + index * DAY_MS).toISOString().slice(0, 10))) {
    throw new Error("Incomplete GitHub calendar; keeping the previous snapshot.");
  }

  const totalContributions = count(calendar.totalContributions, "total");
  if (days.reduce((total, day) => total + day.count, 0) !== totalContributions) {
    throw new Error("GitHub totals do not match the calendar; keeping the previous snapshot.");
  }

  return {
    username: USERNAME,
    updatedAt: now.toISOString(),
    from,
    to,
    totalContributions,
    publicCommits: count(collection.totalCommitContributions, "public commits"),
    privateContributions: count(collection.restrictedContributionsCount, "private contributions"),
    publicRepos: count(user.repositories?.totalCount, "public repositories"),
    days,
  };
}

export async function refreshActivity({ token, now = new Date(), output = OUTPUT, fetcher = fetch }) {
  if (!token) throw new Error("Set GH_TOKEN or GITHUB_TOKEN to refresh GitHub activity.");
  const response = await fetcher("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "lockxii-portfolio",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME, ...contributionRange(now) } }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}; keeping the previous snapshot.`);
  const result = await response.json();
  if (result.errors?.length) throw new Error("GitHub rejected the activity query; keeping the previous snapshot.");

  // Only aggregate counts and calendar days are ever written to the public site.
  const snapshot = createSnapshot(result.data?.user, now);
  const outputPath = output instanceof URL ? fileURLToPath(output) : output;
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(`${outputPath}.tmp`, `${JSON.stringify(snapshot, null, 2)}\n`);
  await rename(`${outputPath}.tmp`, outputPath);
  return snapshot;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const snapshot = await refreshActivity({ token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN });
    console.log(`Updated @${snapshot.username}: ${snapshot.totalContributions} contributions, ${snapshot.from} to ${snapshot.to}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
