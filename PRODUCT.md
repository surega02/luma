# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Laravel 13 + Inertia 3 + React 19 + TypeScript + Tailwind CSS 4 + MySQL + Tiptap, bootstrapped from the official Laravel React starter kit (not legacy Breeze), Vite bundler, Pest 4 for tests. Confirmed: first implementation is the full Laravel application, built against the repo's technical design.

## Users

Individual learners who capture and grow personal knowledge over time — software developers learning new technology, students storing study material, professionals recording concepts, and self-learners saving insight from articles, videos, documentation, and work experience. No single segment takes priority; the product stays broad and neutral across these learner types.

## Product Purpose

Luma is a personal knowledge management application. It turns scattered information into a structured personal knowledge base through one core loop: **Capture → Organize → Retrieve → Reflect → Grow**. Success means a user can complete the full cycle — create an account, capture knowledge, organize it with categories, find it again, understand it, add insight, and see their learning progress — without friction.

## Positioning

Luma is not just a note store: every knowledge item carries a **Definition** (what it means), a **My Understanding** (the learner's own restatement), and **Insights** (reflection), and the system tracks a status state machine — Captured → Understood → Complete — driven by the presence of Understanding and Insights. The differentiating mechanism is that the product enforces a reflection step between storing information and considering it learned, with version history on Definition and My Understanding so the learner's thinking stays inspectable over time.

## Operating Context

- Core learning loop: Capture → Organize → Retrieve → Reflect → Grow.
- Global Quick Capture modal from every authenticated page; capture must require minimal navigation.
- Knowledge List is card-based (never a table); Categories are list-based; Trash is card-based.
- Desktop uses a fixed expandable/collapse sidebar; mobile uses bottom navigation across Dashboard, Knowledge, Categories, Trash, Profile.
- Knowledge Detail hosts Insights and per-field (Definition / My Understanding) read-only version history.
- Search covers Title, Definition, My Understanding, Insight — case-insensitive partial match; category filter uses OR logic and can include Uncategorized.
- Trash is soft-delete with restore and permanent delete.
- Dashboard is a "Learning Overview": progress counts by status, 30-day growth chart (created per day + cumulative), 5 most recent knowledge and insights, top categories by knowledge count.
- Guest surface is a landing page plus login/register only; guests cannot reach any authenticated page.
- Single-tenant-per-user privacy: all data is private by default and scoped to the authenticated user in backend authorization.

## Capabilities and Constraints

- MVP scope is fixed by the PRD: auth (register, login, logout, forgot/reset password, profile, delete account), knowledge CRUD + status + search/filter/sort/pagination (10/20/50, default 20), multi-category with searchable multi-select, insights, version history, trash/restore, dashboard, responsive shell, toasts, skeleton loading, field-level validation.
- Explicitly out of MVP (post-MVP only): AI of any kind, share-by-link, attachments, dark mode, notifications, native apps, public knowledge.
- Light mode only for MVP; dark mode is post-MVP.
- UI copy ships in **English only** (confirmed decision). The PRD's Indonesian empty-state strings are superseded; the English tagline and supporting statement remain as brand copy.
- Rich text is Tiptap limited to bold, italic, bullet list, numbered list, link — for Definition, My Understanding, and Insight.
- No auto-save anywhere: edits persist only on explicit Save; Quick Capture discards input on cancel with no draft.
- Status is system-generated, never user-set.
- Toasts: success actions auto-dismiss bottom-right on desktop, bottom-center on tablet/mobile. Errors: field-level for validation, toast for server/network, never internal detail.
- No global blocking spinner — button states (Saving…, Deleting…) and skeleton loaders instead.
- Soft delete on Knowledge (`deleted_at`); permanent delete is a hard delete.
- Open implementation details left to technical design: exact status icons, category icon/color palette, breakpoints, chart/toast libraries, component architecture, indexing.

## Brand Commitments

- Name: **Luma**
- Tagline: **Learn. Capture. Grow.**
- Supporting statement: **Capture what you learn. Build what you know.**
- Supporting description: "Luma helps you capture what you learn, organize your knowledge, reflect on your understanding, and turn scattered information into knowledge that grows with you."
- Voice implied by the copy: clean, minimal, learning-oriented, content-first.
- Product principles named in the PRD are binding product commitments (see below).
- No logo, imagery, color, or typography asset exists yet — nothing is binding beyond the written copy.

## Evidence on Hand

All at project root:

- `Product Requirements Document - Luma v1.0.md` — full MVP scope, flows, acceptance criteria
- `luma_technical_design_v1.0.md` — architecture, ADRs, component/data flow
- `luma_erd_v1.0.md` — schema (users, knowledges, categories, pivot, insights, definition_versions, understanding_versions)
- `luma_api_route_backend_spec_v1.0.md` — routes, controllers, validation, policies, Inertia props
- `luma_development_backlog_v1.0.md` — Epic/Feature/Task breakdown E01–E12

No code, no assets, no testimonials, no customer names, no pricing, no performance numbers exist. Future work must not fabricate any of these. The technical design explicitly states the UI/UX stage was skipped, so there is **no incumbent visual design** — the interface has never been drawn.

## Product Principles

1. **Capture first** — saving something must be fast; a perfect note is never a precondition.
2. **Understand later** — My Understanding can be filled in after capture, never required at capture.
3. **Reflect through insight** — Insight is the step that turns stored information into personal understanding.
4. **Organize simply** — categories give structure without forcing a complex tagging system.
5. **Retrieve easily and grow visibly** — search, filter, sort, and the dashboard make knowledge findable and progress visible over time.

## Accessibility & Inclusion

Required baseline from the PRD: keyboard navigation, real form labels, accessible buttons, sufficient contrast, and semantic HTML. Core actions (especially Quick Capture) must be reachable with minimal navigation. No stricter standard (WCAG level) has been committed — treat AA contrast as the working assumption and confirm before audit work.
