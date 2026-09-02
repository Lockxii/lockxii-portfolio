# Lockxii Portfolio

Personal portfolio for [Lockxii](https://github.com/Lockxii), featuring Designee, Prysm, Datyo, and BrandSearch.

## Live site

[lockxi.dev](https://lockxi.dev)

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub activity

The counters and 52-week calendar share `src/data/github-activity.json`. The
`Update GitHub activity` workflow refreshes it daily at 05:23 UTC, on collector
changes, and on manual runs from the Actions tab. The existing Vercel Git
integration deploys the refreshed snapshot after the workflow commits it.

The collector uses GitHub's GraphQL API and the workflow's built-in
`GITHUB_TOKEN`; no personal token or Vercel secret needs to be configured.
Only public counters, daily contribution counts, and anonymized private
activity already shared on the profile are published. The workflow's token
can read public contributions and write the snapshot to this repository.

The reporting range starts on Sunday, 51 weeks before the current week, and
ends on the refresh date. Future days are left blank. Public commits and
private activity use the same period as the calendar; public repositories
is the current profile count. GitHub's own contribution levels set the colors.

If GitHub is unavailable, rate-limited, or returns incomplete data, the
workflow fails without replacing the last valid snapshot. The displayed
refresh date remains the date of the last successful update.

To refresh locally, provide `GH_TOKEN` (or `GITHUB_TOKEN`) through your shell's
environment and run `npm run update:github`. Never commit credentials or use
a `VITE_*` variable for a GitHub token. Run `npm test` to check date boundaries,
calendar consistency, and failed-refresh handling. Node.js 22 or newer is required.

GitHub can delay scheduled runs and may disable schedules on public
repositories after prolonged inactivity. The workflow remains manually
runnable from the Actions tab.
