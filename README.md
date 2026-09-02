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

The site refreshes its activity through `/api/github-activity` on page load
and every six hours while a page stays open. Vercel caches successful responses
for six hours and can serve the cached response during background revalidation.
No GitHub token, GitHub Actions workflow, or additional service is required.

The endpoint reads GitHub's public contribution calendar and public profile API.
It publishes only day counts, GitHub's own color levels, and the public
repository count. Anonymous private contributions are included only as already
shared on the public profile.

Contributions, active days, and the longest consecutive-day streak are computed
from the same 52 displayed weeks: 51 past weeks plus the current week, starting
on Sunday. The current public repository count is displayed alongside them.
Future days remain blank; missing days or unexpected calendar markup cause the
refresh to fail instead of fabricating zeroes.

The bundled `src/data/github-activity.json` snapshot renders immediately. A
validated, more recent snapshot is also saved in the visitor's browser. If
GitHub or the endpoint is unavailable, the site keeps the last valid figures
and their real refresh date. No loading screen is needed.

`npm run dev` serves the same API handler locally through Vite middleware.
Use `npm run update:github` to refresh the bundled fallback before deploying,
and `npm test` to check the parser, calendar boundaries, streak calculations,
and failed-refresh handling. Node.js 22 or newer is required.
