const DAY_MS = 86_400_000;

export function contributionRange(now) {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - (today.getUTCDay() + 51 * 7) * DAY_MS);
  return { from: start.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
}

export function createSnapshot({ days, publicRepos, updatedAt }) {
  const now = new Date(updatedAt);
  if (Number.isNaN(now.getTime())) throw new Error("Invalid GitHub refresh date.");
  const { from, to } = contributionRange(now);
  const expectedDays = Math.floor((Date.parse(to) - Date.parse(from)) / DAY_MS) + 1;
  if (!Array.isArray(days) || days.length !== expectedDays || days.some((day, index) =>
    day.date !== new Date(Date.parse(from) + index * DAY_MS).toISOString().slice(0, 10) ||
    !Number.isSafeInteger(day.count) || day.count < 0 ||
    !Number.isInteger(day.level) || day.level < 0 || day.level > 4)) {
    throw new Error("Incomplete or invalid GitHub calendar; keeping the previous snapshot.");
  }
  if (!Number.isSafeInteger(publicRepos) || publicRepos < 0) {
    throw new Error("Invalid public repository count.");
  }

  let streak = 0;
  let longestStreak = 0;
  for (const day of days) {
    streak = day.count > 0 ? streak + 1 : 0;
    longestStreak = Math.max(longestStreak, streak);
  }

  return {
    username: "Lockxii",
    updatedAt: now.toISOString(),
    from,
    to,
    totalContributions: days.reduce((total, day) => total + day.count, 0),
    activeDays: days.filter((day) => day.count > 0).length,
    longestStreak,
    publicRepos,
    days: days.map(({ date, count, level }) => ({ date, count, level })),
  };
}
