# Luma end-to-end journeys (E12-F08)

Four browser journeys cover the critical paths from the backlog, driven by
`puppeteer-core` against the system Edge build. Every journey registers its
own throw-away account, so the suite never depends on seeded data.

| Journey                   | Covers                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `01-capture-edit-insight` | Register → category → Quick Capture → Detail → Edit (rejects a `javascript:` link, accepts https) → Add Insight → status `Complete` |
| `02-search-filter-detail` | Three records → toolbar search (partial reload) → clear → category filter → open detail                                             |
| `03-delete-trash-restore` | Delete → confirmation dialog → Trash (deleted date) → Restore → back on the list                                                    |
| `04-profile-delete`       | Profile → Delete account (password confirm) → signed out → old credentials rejected                                                 |

## Prerequisites

1. Fresh assets: `npm run build`
2. A running server: `php artisan serve` (default `http://127.0.0.1:8000`)
3. Microsoft Edge, or point `E2E_EDGE_PATH` at another Chromium binary

## Run

```bash
npm run test:e2e
```

Environment overrides:

- `E2E_BASE_URL` — app URL when the server is not on port 8000
- `E2E_EDGE_PATH` — path to the browser binary

On PowerShell:

```powershell
$env:E2E_BASE_URL = 'http://127.0.0.1:8888'; npm run test:e2e
```

The runner prints one line per journey and exits non-zero when any journey
fails. Screenshots land in `e2e/output/` (ignored by git) — a `failure-*.png`
is written automatically for the failing journey.

## Notes

- `.stamp` labels render uppercase, so every assertion compares case
  insensitively through `contains()` in `support.js`.
- Quick Capture and the toolbar both debounce (400ms), so helpers wait out
  the response instead of assuming an instant render.
- Console and page errors are collected per journey; a browser error fails
  the journey even when every assertion passed.
