# Luma

> **Learn. Capture. Grow.**

Luma is a personal knowledge management application. It turns scattered
information — articles, docs, study notes, work experience — into a structured
personal knowledge base through one core loop:
**Capture → Organize → Retrieve → Reflect → Grow.**

Unlike a plain note store, every knowledge item carries a **Definition** (what
it means), **My Understanding** (your own restatement), and **Insights**
(reflection), with a status state machine — Captured → Understood → Complete —
that only advances when you actually reflect on what you've learned.

## Current status

This repository ships the **application foundation**: a Laravel 13 + Inertia 3 +
React 19 starter kit with authentication (register with a unique username, log
in with email _or_ username, password reset, profile, delete account), the
complete MySQL data model (knowledge, categories, insights, version history with
unique constraints and cascades), the system-owned Knowledge status resolver,
and ownership policies with cross-user isolation tests.

Luma's product surfaces — knowledge CRUD, quick capture, categories, insights,
version history, trash, dashboard, and the responsive app shell (E04–E12) — are
fully specified but **not yet implemented**. See
[Documentation](#documentation) for the specs and backlog.

## Tech stack

- **Backend:** Laravel 13 (PHP >= 8.4), Laravel Fortify, Laravel Wayfinder
- **Frontend:** Inertia.js 3 + React 19 + TypeScript, Vite 8
- **UI:** Tailwind CSS 4, Radix UI primitives, shadcn-style components
- **Database:** MySQL 8 locally and in production (SQLite only if `DB_CONNECTION` is overridden)
- **Quality:** PHPUnit 12, Laravel Pint, Larastan (PHPStan level 7), `tsc --noEmit`
- **CI:** GitHub Actions runs `composer ci:check` on `main` and pull requests

## Requirements

- PHP >= 8.4
- Composer 2
- Node.js >= 22 and npm

## Installation

```bash
git clone <your-repo-url> luma
cd luma
composer setup
```

`composer setup` does everything in one step: installs PHP dependencies, creates
`.env` from `.env.example`, generates the `APP_KEY`, runs migrations, installs
npm dependencies, and builds frontend assets.

<details>
<summary>Manual setup</summary>

```bash
composer install
cp .env.example .env          # Windows: copy .env.example .env
php artisan key:generate
# Set DB_CONNECTION=mysql and credentials in .env, then create the database
php artisan migrate
npm install
npm run build
```

</details>

## Development

```bash
composer dev
```

Starts everything together via `php artisan dev`: Laravel server, queue worker,
log viewer (Pail), and the Vite dev server. Open http://localhost:8000.

Or in separate terminals:

```bash
php artisan serve
npm run dev
```

## Local mail

`MAIL_MAILER=log` (set in `.env.example`), so nothing leaves the machine:
password-reset and other auth emails are written to `storage/logs/laravel.log`.
Point `MAIL_MAILER` at `smtp` or another driver once a real mail server is
configured.

## Testing & code quality

| Command                | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `composer ci:check`    | Full CI suite (frontend checks + types + Pint + Larastan + PHPUnit) |
| `composer test`        | Pint check + PHPStan + PHPUnit                                      |
| `composer lint`        | Format PHP code (Pint, write mode)                                  |
| `composer lint:check`  | Verify PHP formatting                                               |
| `composer types:check` | PHPStan analysis (level 7)                                          |
| `npm run check`        | Frontend lint/format via vite-plus                                  |
| `npm run types:check`  | TypeScript type checking                                            |

## Coding standards

**Formatting and linting**

| Layer              | Tool                                         | Config           |
| ------------------ | -------------------------------------------- | ---------------- |
| PHP                | Laravel Pint (preset `laravel`)              | `pint.json`      |
| PHP analysis       | Larastan, level 7                            | `phpstan.neon`   |
| JS / TS / CSS / MD | oxlint (type-aware, warnings denied) + oxfmt | `vite.config.ts` |
| TypeScript         | `tsc --noEmit` (strict)                      | `tsconfig.json`  |

o fmt settings: 4-space indent, 80-column print width, single quotes, semicolons,
and Tailwind class sorting for `clsx` / `cn` / `cva` calls against
`resources/css/app.css`. Files under `resources/js/components/ui/`,
`resources/js/{actions,routes,wayfinder}/` are generated or vendored and are
excluded from linting.

**Naming conventions**

- **PHP:** `PascalCase` for models, controllers, actions, policies, form
  requests, and enums; `snake_case` for tables, columns, and route names.
  Form requests are `Store{Resource}Request` / `Update{Resource}Request`;
  single-purpose actions are `Create{Resource}` / `Update{Resource}`;
  authorization classes are `{Resource}Policy`.
- **React/TypeScript:** component files are `PascalCase.tsx`, all other modules
  `camelCase.ts`; hooks are `use{Thing}` and live in `resources/js/hooks/`;
  shared UI lives in `resources/js/components/`, pages in `resources/js/pages/`
  (page names match their Inertia route).
- **Imports:** React/vendor packages first, then `@/` path aliases, then
  relative imports. Never import across `pages/` — lift shared pieces into
  `components/`.
- **CSS:** Tailwind utility-first. Design tokens come from `DESIGN.md` and the
  `@theme` block in `resources/css/app.css`; do not hard-code hex values in
  components.
- **Validation:** business rules and validation stay in Laravel
  (`FormRequest` + policy). React owns presentation and local UI state only.

## Project structure

```
app/            Controllers, Fortify actions, middleware, models
bootstrap/      Application bootstrapping
config/         Laravel configuration
database/       Migrations, factories, seeders (MySQL)
public/         Web root (Vite output lands in public/build)
resources/
  js/           React app — pages/, components/, layouts/, hooks/, ui/
  views/        Blade shell (app.blade.php)
routes/         web.php, settings.php, console.php
storage/        Logs, cache, sessions (contents git-ignored)
tests/          Feature & unit tests (PHPUnit)
.github/        CI workflow + Dependabot config
```

Generated paths are excluded from git: `vendor/`, `node_modules/`,
`public/build/`, Wayfinder output (`resources/js/{actions,routes,wayfinder}`),
`storage/*`, and the local database file.

## Documentation

| Document                                                                          | Contents                                   |
| --------------------------------------------------------------------------------- | ------------------------------------------ |
| [PRODUCT.md](PRODUCT.md)                                                          | Product vision, positioning, principles    |
| [DESIGN.md](DESIGN.md)                                                            | Design tokens (colors, typography)         |
| [PRD — Luma v1.0](Product%20Requirements%20Document%20%E2%80%94%20Luma%20v1.0.md) | Full MVP scope, flows, acceptance criteria |
| [Technical design](luma_technical_design_v1.0.md)                                 | Architecture, ADRs, data/component flow    |
| [ERD](luma_erd_v1.0.md)                                                           | Database schema                            |
| [API & route spec](luma_api_route_backend_spec_v1.0.md)                           | Routes, controllers, validation, policies  |
| [Development backlog](luma_development_backlog_v1.0.md)                           | Epic/Feature/Task breakdown E01–E12        |

## License

MIT — see [LICENSE](LICENSE).
