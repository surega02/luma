# Luma v1.0 — Development Backlog

> **Product:** Luma Personal Knowledge Management  
> **Tagline:** Learn. Capture. Grow.  
> **Scope:** MVP  
> **Stack:** Laravel 13 + Inertia 3 + React 19 + TypeScript + MySQL + Tailwind CSS + Tiptap  
> **Backlog style:** Epic → Feature → Task  
> **Priority:** P0 = required for MVP, P1 = important/supporting, P2 = optional polish  
> **Effort:** S = Small, M = Medium, L = Large

---

# 1. Backlog Principles

1. Build the backend foundation before feature UI integration.
2. Implement authorization together with each resource, not afterward.
3. Keep business rules in Laravel; keep React focused on presentation and local UI state.
4. Every mutation needs validation, authorization, success/error feedback, and tests.
5. Finish vertical slices when practical instead of implementing every backend layer first and every frontend layer later.
6. Do not build Post-MVP capabilities during MVP.

---

# 2. Epic Overview

| Epic | Name                                        | Priority | Status |
| ---- | ------------------------------------------- | -------: | ------ |
| E01  | Project Bootstrap & Engineering Foundation  |       P0 | Done   |
| E02  | Authentication & Account Management         |       P0 | Done   |
| E03  | Database, Models & Authorization Foundation |       P0 | Done   |
| E04  | Knowledge Management                        |       P0 | Done   |
| E05  | Category Management                         |       P0 | Done   |
| E06  | Search, Filter, Sorting & Pagination        |       P0 | Done   |
| E07  | Insight & Version History                   |       P0 | Done   |
| E08  | Trash & Lifecycle Management                |       P0 | Done   |
| E09  | Dashboard & Learning Analytics              |       P0 | Done   |
| E10  | React/Inertia UX Infrastructure             |       P0 | Done   |
| E11  | Responsive Navigation & Application Shell   |       P0 | Done   |
| E12  | Testing, Security & Release Hardening       |       P0 | Done   |

**Status legend:** Done = every task ticked and verified · Partial = some tasks ticked · Pending = not started.

---

# 3. Dependency Map

```text
E01 Bootstrap
   │
   ├──> E02 Authentication
   │
   └──> E03 Database + Models + Policies
             │
             ├──> E04 Knowledge
             │       ├──> E06 Search / Filter
             │       ├──> E07 Insight / History
             │       └──> E08 Trash
             │
             ├──> E05 Categories
             │       └──> E06 Search / Filter
             │
             └──> E09 Dashboard

E10 UX Infrastructure
   └──> supports E04–E09

E11 App Shell
   └──> supports all authenticated pages

E12 Testing / Hardening
   └──> runs continuously across all epics
```

---

# 4. E01 — Project Bootstrap & Engineering Foundation

## E01-F01 — Create Laravel application

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Create Laravel 13 application.
- [x] Configure PHP 8.4+.
- [x] Configure local `.env`.
- [x] Configure application name as `Luma`.
- [x] Configure application URL.
- [x] Verify application boots.

**Acceptance Criteria**

- Laravel application starts without error.
- Environment variables load correctly.

---

## E01-F02 — Install official React starter kit

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Install Laravel official React starter kit.
- [x] Verify React 19.
- [x] Verify Inertia 3.
- [x] Verify TypeScript.
- [x] Verify Tailwind.
- [x] Verify Vite.
- [x] Verify authentication pages compile.

**Acceptance Criteria**

- React/Inertia starter application runs.
- Login/Register pages render.

---

## E01-F03 — Configure MySQL

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Create `db_luma` MySQL database.
- [x] Configure database credentials.
- [x] Run base migrations.
- [x] Verify connection.

**Acceptance Criteria**

- `php artisan migrate` succeeds.
- Application can read/write MySQL.

---

## E01-F04 — Establish coding standards

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Configure PHP formatter/linter.
- [x] Configure TypeScript/ESLint.
- [x] Configure import conventions.
- [x] Define naming conventions.
- [x] Add basic CI checks.

**Acceptance Criteria**

- CI can run formatter/lint/type checks.

---

# 5. E02 — Authentication & Account Management

## E02-F01 — Registration

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Enable registration.
- [x] Name validation.
- [x] Username validation.
- [x] Email validation.
- [x] Password minimum 8 characters.
- [x] Password confirmation.
- [x] Unique username/email.

**Acceptance Criteria**

- User can register successfully.
- Invalid registration shows field-level errors.

---

## E02-F02 — Login / Logout

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Login.
- [x] Logout.
- [x] Redirect authenticated user to Dashboard.
- [x] Protect application routes with auth middleware.

**Acceptance Criteria**

- Unauthenticated user cannot access protected pages.
- Authenticated user can log out.

---

## E02-F03 — Forgot / Reset Password

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Configure password reset.
- [x] Configure mail delivery for local/test environment.
- [x] Validate reset token.
- [x] Enforce 8-character minimum.

**Acceptance Criteria**

- User can request password reset.
- User can set a new password.

---

## E02-F04 — Profile

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Profile page.
- [x] Update name.
- [x] Update username.
- [x] Unique username validation.
- [x] Change password.
- [x] Profile success/error feedback.

**Acceptance Criteria**

- Profile changes persist.
- Email remains non-editable.

---

## E02-F05 — Delete Account

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Delete account UI.
- [x] Confirmation.
- [x] Current password verification.
- [x] Transaction for data deletion.
- [x] Delete owned Knowledge.
- [x] Delete Categories.
- [x] Delete Insights.
- [x] Delete Version History.
- [x] Delete pivot rows.
- [x] Delete User.

**Acceptance Criteria**

- Wrong password blocks deletion.
- Correct password permanently deletes account and owned data.

---

# 6. E03 — Database, Models & Authorization Foundation

## E03-F01 — Create core migrations

**Priority:** P0  
**Effort:** L

Tables:

- [x] knowledges
- [x] categories
- [x] category_knowledge
- [x] insights
- [x] definition_versions
- [x] understanding_versions

**Acceptance Criteria**

- Migrations run on a clean database.
- Foreign keys and timestamps are correct.
- Knowledge has `deleted_at`.

---

## E03-F02 — Add database constraints

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Unique users.email.
- [x] Unique users.username.
- [x] Unique categories(user_id, name).
- [x] Unique category_knowledge(knowledge_id, category_id).
- [x] Unique definition_versions(knowledge_id, version).
- [x] Unique understanding_versions(knowledge_id, version).
- [x] Add required indexes.

**Acceptance Criteria**

- Duplicate records are prevented at DB level.

---

## E03-F03 — Eloquent models & relationships

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Knowledge model.
- [x] Category model.
- [x] Insight model.
- [x] DefinitionVersion model.
- [x] UnderstandingVersion model.
- [x] User relationships.
- [x] Many-to-many category relationship.
- [x] SoftDeletes on Knowledge.

**Acceptance Criteria**

- Required relationships work in feature tests.

---

## E03-F04 — Knowledge status enum

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Create `KnowledgeStatus` enum.
- [x] Add model cast.
- [x] Create status resolver/action.
- [x] Prevent client from setting status.

**Acceptance Criteria**

- Status is always derived by server-side business logic.

---

## E03-F05 — Policies

**Priority:** P0  
**Effort:** M

Tasks:

- [x] KnowledgePolicy.
- [x] CategoryPolicy.
- [x] InsightPolicy.
- [x] View/update/delete/restore/forceDelete authorization.
- [x] Add cross-user authorization tests.

**Acceptance Criteria**

- User cannot access another user's resources by changing IDs.

---

# 7. E04 — Knowledge Management

## E04-F01 — Knowledge List

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Knowledge Index page.
- [x] Card-based list.
- [x] Definition snippet.
- [x] Categories.
- [x] Status.
- [x] Created Date.
- [x] Open/Edit/Delete actions.
- [x] Empty state.

**Acceptance Criteria**

- User sees only their active Knowledge.
- Card contains required MVP fields.

---

## E04-F02 — Quick Capture Modal

**Priority:** P0  
**Effort:** L

Tasks:

- [x] Global Quick Capture button.
- [x] Modal component.
- [x] Title field.
- [x] Definition Tiptap editor.
- [x] My Understanding Tiptap editor.
- [x] Searchable multi-select category selector.
- [x] Create Category from selector.
- [x] Source field.
- [x] URL field.
- [x] Save.
- [x] Validation.
- [x] Close discards input.

**Acceptance Criteria**

- User can create Knowledge without leaving current page.
- Required field errors remain inside modal.
- Successful save returns to Knowledge List.

---

## E04-F03 — Create Knowledge backend

**Priority:** P0  
**Effort:** M

Tasks:

- [x] StoreKnowledgeRequest.
- [x] CreateKnowledge action.
- [x] Create Definition Version 1.
- [x] Create Understanding Version 1 when applicable.
- [x] Sync categories.
- [x] Calculate initial status.
- [x] Wrap in transaction.
- [x] Success flash.

**Acceptance Criteria**

- Valid create persists every related record correctly.
- Failed transaction leaves no partial records.

---

## E04-F04 — Knowledge Detail

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Detail page.
- [x] Title + status.
- [x] Definition.
- [x] My Understanding.
- [x] Insight section.
- [x] Categories.
- [x] Source.
- [x] Open Source link.
- [x] Back/Edit/Delete actions.

**Acceptance Criteria**

- All Knowledge fields display in PRD order.

---

## E04-F05 — Quick Edit

**Priority:** P0  
**Effort:** L

Tasks:

- [x] Edit mode.
- [x] Title editing.
- [x] Definition editor.
- [x] My Understanding editor.
- [x] Category selector.
- [x] Source/URL.
- [x] Save Changes.
- [x] Cancel.
- [x] Unsaved changes confirmation.

**Acceptance Criteria**

- One Save Changes persists all changed fields.
- Cancel discards changes.
- Leaving dirty form shows Leave/Stay confirmation.

---

## E04-F06 — Update Knowledge backend

**Priority:** P0  
**Effort:** L

Tasks:

- [x] UpdateKnowledgeRequest.
- [x] UpdateKnowledge action.
- [x] Create new Definition Version every save.
- [x] Create next Understanding Version when value exists.
- [x] Sync categories.
- [x] Recalculate status.
- [x] Transaction.
- [x] Success flash.

**Acceptance Criteria**

- A successful Save always creates required version records according to rules.

---

## E04-F07 — Delete Knowledge

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Delete confirmation.
- [x] Soft delete.
- [x] Success toast.
- [x] Remove from active list.

**Acceptance Criteria**

- Knowledge appears in Trash after deletion.

---

# 8. E05 — Category Management

## E05-F01 — Category List

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Category list page.
- [x] Icon.
- [x] Color.
- [x] Name.
- [x] Knowledge count.
- [x] Edit.
- [x] Delete.
- [x] Empty state.

**Acceptance Criteria**

- Category count reflects active Knowledge.

---

## E05-F02 — Create Category

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Create modal.
- [x] Name.
- [x] Color.
- [x] Icon.
- [x] Unique name validation.
- [x] Success toast.

**Acceptance Criteria**

- Duplicate name in same account is rejected.

---

## E05-F03 — Edit Category

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Edit modal.
- [x] Unique name validation.
- [x] Update icon/color.
- [x] Success toast.

---

## E05-F04 — Delete Category

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Show affected knowledge count.
- [x] Confirmation.
- [x] Detach pivot rows.
- [x] Delete Category.
- [x] Knowledge remains.
- [x] Uncategorized behavior.

**Acceptance Criteria**

- No Knowledge is deleted when Category is removed.

---

## E05-F05 — Category Selector

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Searchable multi-select.
- [x] Selected category chips.
- [x] Multiple category support.
- [x] Create Category action.
- [x] Return newly created category to selector.

**Acceptance Criteria**

- User can create and select a new Category without leaving Knowledge form.

---

# 9. E06 — Search, Filter, Sorting & Pagination

## E06-F01 — Knowledge search

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Search Title.
- [x] Search Definition.
- [x] Search My Understanding.
- [x] Search Insight.
- [x] Case-insensitive partial match.
- [x] Exclude Source/URL.
- [x] Debounce typing.
- [x] Search button.
- [x] Empty search result state.

**Acceptance Criteria**

- Search `machine` finds `Machine Learning`.
- Search is case-insensitive.

---

## E06-F02 — Category filter

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Multiple category filter.
- [x] OR semantics.
- [x] Uncategorized filter.
- [x] Category + Uncategorized OR logic.
- [x] Preserve filter in query string.

**Acceptance Criteria**

- Programming + AI returns Knowledge matching either category.

---

## E06-F03 — Sorting

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Recently Updated.
- [x] Newest.
- [x] Oldest.
- [x] Allow-list sort values.

**Acceptance Criteria**

- Invalid sort value cannot manipulate SQL.

---

## E06-F04 — Pagination

**Priority:** P0  
**Effort:** S

Tasks:

- [x] 10/page.
- [x] 20/page.
- [x] 50/page.
- [x] Default 20.
- [x] Preserve query/filter state.

**Acceptance Criteria**

- Search/filter/sort persists while navigating pages.

---

## E06-F05 — Knowledge Query Object

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Create KnowledgeIndexQuery.
- [x] User scope.
- [x] Active record scope.
- [x] Eager loading.
- [x] Search.
- [x] Filter.
- [x] Sorting.
- [x] Pagination.

**Acceptance Criteria**

- No N+1 query on Knowledge List.

---

# 10. E07 — Insight & Version History

## E07-F01 — Add Insight

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Add Insight control.
- [x] Tiptap editor.
- [x] Save/Cancel.
- [x] Validation.
- [x] CreateInsight action.
- [x] Status recalculation.
- [x] Updated timestamp.
- [x] Success toast.

**Acceptance Criteria**

- First Insight can transition Understood → Complete.

---

## E07-F02 — Edit Insight

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Inline/modal edit state.
- [x] Save/Cancel.
- [x] UpdateInsight action.
- [x] Status recalculation.
- [x] Updated timestamp.

**Acceptance Criteria**

- Insight changes persist without auto-save.

---

## E07-F03 — Delete Insight

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Direct delete action.
- [x] No confirmation.
- [x] Update status.
- [x] Update Knowledge timestamp.

**Acceptance Criteria**

- Deleting last Insight changes Complete → Understood.

---

## E07-F04 — Definition History

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Definition History button.
- [x] History page/modal.
- [x] Version number.
- [x] Date/time.
- [x] Content.
- [x] Read-only.
- [x] Pagination.

**Acceptance Criteria**

- Version history follows every Save Changes.

---

## E07-F05 — My Understanding History

**Priority:** P0  
**Effort:** M

Tasks:

- [x] History button.
- [x] Empty history state.
- [x] Version number.
- [x] Date/time.
- [x] Content.
- [x] Read-only.
- [x] Pagination.

**Acceptance Criteria**

- First saved My Understanding becomes Version 1.

---

# 11. E08 — Trash & Lifecycle Management

## E08-F01 — Trash List

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Trash page.
- [x] Responsive cards.
- [x] Title.
- [x] Definition snippet.
- [x] Deleted date.
- [x] Restore.
- [x] Permanent delete.
- [x] Newest deleted first.
- [x] Empty state.

**Acceptance Criteria**

- Only current user's trashed Knowledge appears.

---

## E08-F02 — Restore

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Restore endpoint.
- [x] Restore authorization.
- [x] withTrashed route binding/query.
- [x] Restore Knowledge.
- [x] Success toast.
- [x] Missing Category behavior.

**Acceptance Criteria**

- Deleted Category is not recreated on restore.

---

## E08-F03 — Permanent Delete

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Permanent delete confirmation.
- [x] Force delete endpoint.
- [x] Remove dependent data.
- [x] Success toast.

**Acceptance Criteria**

- Knowledge and all dependent MVP data are permanently removed.

---

# 12. E09 — Dashboard & Learning Analytics

## E09-F01 — Learning Progress

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Total Knowledge.
- [x] Captured count.
- [x] Understood count.
- [x] Complete count.
- [x] SQL aggregate query.

**Acceptance Criteria**

- Counts match active Knowledge only.

---

## E09-F02 — 30-Day Growth

**Priority:** P0  
**Effort:** L

Tasks:

- [x] Daily Knowledge created.
- [x] Cumulative Knowledge.
- [x] 30-day date range.
- [x] Fill zero-activity dates.
- [x] Query optimized in SQL.
- [x] Chart data contract.

**Acceptance Criteria**

- Every one of the last 30 days has a data point.

---

## E09-F03 — Recent Knowledge

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Latest 5 active Knowledge.
- [x] Summary data only.

---

## E09-F04 — Recent Insight

**Priority:** P0  
**Effort:** S

Tasks:

- [x] Latest 5 Insight records.
- [x] Include parent Knowledge reference.

---

## E09-F05 — Top Categories

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Count Knowledge by Category.
- [x] Use active Knowledge only.
- [x] Sort descending.
- [x] Define display limit for dashboard.
- [x] Avoid N+1.

**Acceptance Criteria**

- Category ranking reflects Knowledge count, not Insight count.

---

# 13. E10 — React/Inertia UX Infrastructure

## E10-F01 — Application Layout

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Authenticated layout.
- [x] Guest layout.
- [x] Header.
- [x] Global Quick Capture access.
- [x] Flash/toast host.

---

## E10-F02 — Toast System

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Success toast.
- [x] Error toast.
- [x] Bottom-right desktop.
- [x] Bottom-center mobile/tablet.
- [x] Auto dismiss.
- [x] Manual close.
- [x] Safe area above bottom navigation.

**Acceptance Criteria**

- Every successful mutation can display product-defined success feedback.

---

## E10-F03 — Skeleton Loading

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Knowledge list skeleton.
- [x] Dashboard skeleton.
- [x] Category list skeleton where useful.
- [x] Action button loading state.

---

## E10-F04 — Form Validation UI

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Field error component.
- [x] Accessible error messages.
- [x] Invalid state styles.
- [x] Preserve entered values after validation failure.

---

## E10-F05 — Confirmation Dialog

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Generic confirmation component.
- [x] Delete Knowledge.
- [x] Permanent Delete.
- [x] Delete Category.
- [x] Delete Account.
- [x] Unsaved Changes.

---

## E10-F06 — Rich Text Editor

**Priority:** P0  
**Effort:** L

Tasks:

- [x] Tiptap setup.
- [x] Bold.
- [x] Italic.
- [x] Bullet list.
- [x] Ordered list.
- [x] Link.
- [x] Placeholder.
- [x] Sanitized HTML handling.
- [x] Display renderer.

**Acceptance Criteria**

- Same content can be edited and safely rendered.

---

## E10-F07 — Searchable Multi-select

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Search categories.
- [x] Multi-select.
- [x] Selected chips.
- [x] Keyboard support.
- [x] Create Category action.
- [x] Empty category results.

---

# 14. E11 — Responsive Navigation & Application Shell

## E11-F01 — Desktop Sidebar

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Fixed sidebar.
- [x] Expanded state.
- [x] Collapsed state.
- [x] Icon-only collapsed mode.
- [x] Active menu state.

---

## E11-F02 — Mobile Bottom Navigation

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Bottom navigation.
- [x] Dashboard.
- [x] Knowledge.
- [x] Categories.
- [x] Trash.
- [x] Profile.
- [x] Safe spacing for toast/modal.

---

## E11-F03 — Responsive Breakpoints

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Desktop.
- [x] Tablet.
- [x] Mobile.
- [x] Card resizing.
- [x] Modal responsive sizing.
- [x] No horizontal overflow.

**Acceptance Criteria**

- Primary flows work at mobile, tablet, and desktop widths.

---

# 15. E12 — Testing, Security & Release Hardening

## E12-F01 — Feature Test Foundation

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Factories.
- [x] Test database.
- [x] Authentication helpers.
- [x] Seed/demo data where useful.
- [x] Base feature test patterns.

---

## E12-F02 — Authentication Tests

**Priority:** P0  
**Effort:** M

Tests:

- [x] Register.
- [x] Login.
- [x] Logout.
- [x] Password reset.
- [x] Password update.
- [x] Delete account.

---

## E12-F03 — Knowledge Tests

**Priority:** P0  
**Effort:** L

Tests:

- [x] Create.
- [x] Update.
- [x] Delete.
- [x] Restore.
- [x] Force delete.
- [x] Status transitions.
- [x] Version rules.
- [x] Cross-user denial.

---

## E12-F04 — Category Tests

**Priority:** P0  
**Effort:** M

Tests:

- [x] Create.
- [x] Duplicate rejection.
- [x] Update.
- [x] Delete.
- [x] Ownership.
- [x] Pivot behavior.

---

## E12-F05 — Search / Filter Tests

**Priority:** P0  
**Effort:** M

Tests:

- [x] Title match.
- [x] Definition match.
- [x] Understanding match.
- [x] Insight match.
- [x] Case-insensitive.
- [x] Partial match.
- [x] Source excluded.
- [x] URL excluded.
- [x] Category OR.
- [x] Uncategorized.
- [x] Category + Uncategorized.

---

## E12-F06 — Insight / History Tests

**Priority:** P0  
**Effort:** M

Tests:

- [x] Insight create.
- [x] Insight update.
- [x] Insight delete.
- [x] Complete → Understood.
- [x] Definition versions.
- [x] Understanding versions.

---

## E12-F07 — Dashboard Tests

**Priority:** P0  
**Effort:** M

Tests:

- [x] Progress metrics.
- [x] 30-day growth.
- [x] Recent Knowledge.
- [x] Recent Insight.
- [x] Top Categories.

---

## E12-F08 — Browser / E2E Tests

**Priority:** P0  
**Effort:** L

Critical journeys:

```text
Register
  -> Login
  -> Quick Capture
  -> Knowledge Detail
  -> Edit
  -> Add Insight
  -> Complete

Knowledge
  -> Search
  -> Category Filter
  -> Open Detail

Knowledge
  -> Delete
  -> Trash
  -> Restore

Profile
  -> Delete Account
```

**Status:** Complete — the four journeys live in `e2e/` (shared helpers in `support.js`, one script per journey) and run with `npm run test:e2e` against Edge. Each journey registers its own account, collects console/page errors, and writes a failure screenshot to `e2e/output/`.

---

## E12-F09 — Security Hardening

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Audit all policies.
- [x] Audit all user-scoped queries.
- [x] Audit mass assignment.
- [x] Sanitize rich text.
- [x] Safe URL rendering.
- [x] Production APP_DEBUG=false.
- [x] HTTPS.
- [x] Secure cookies/session.
- [x] Verify secrets are excluded from logs.

---

## E12-F10 — Performance Audit

**Priority:** P1  
**Effort:** M

Tasks:

- [x] N+1 query audit.
- [x] Dashboard query audit.
- [x] Knowledge list query audit.
- [x] Index verification.
- [x] Inertia payload review.
- [x] Partial reload review.

---

# 16. Cross-Cutting Acceptance Rules

Every mutation must satisfy:

```text
Route
  +
Authentication
  +
Authorization
  +
Validation
  +
Business Logic
  +
Transaction if multi-write
  +
Success/Error feedback
  +
Feature Test
```

---

# 17. Suggested Vertical Slices

To reduce integration risk, use vertical slices.

## Slice 1 — First Working Knowledge

Includes:

```text
Authentication
+
Knowledge migration/model
+
Policy
+
Quick Capture
+
Knowledge List
+
Knowledge Detail
+
Create test
```

Goal:

> A real user can register, create Knowledge, and see it.

---

## Slice 2 — Knowledge Editing

Includes:

```text
Quick Edit
+
Tiptap
+
Versioning
+
Status
+
Update tests
```

Goal:

> A user can evolve Knowledge safely.

---

## Slice 3 — Categories

Includes:

```text
Category CRUD
+
Multi-select
+
Category sync
+
Category tests
```

Goal:

> A user can organize Knowledge.

---

## Slice 4 — Retrieval

Includes:

```text
Search
+
Filter
+
Sorting
+
Pagination
```

Goal:

> A user can find Knowledge quickly.

---

## Slice 5 — Reflection

Includes:

```text
Insight CRUD
+
Status transition
+
History pages
```

Goal:

> A user can turn Knowledge into reflection.

---

## Slice 6 — Lifecycle

Includes:

```text
Trash
+
Restore
+
Permanent Delete
```

Goal:

> A user can safely manage deleted Knowledge.

---

## Slice 7 — Dashboard

Includes:

```text
Progress
+
Growth
+
Recent items
+
Top Categories
```

Goal:

> A user can observe learning progress.

---

## Slice 8 — Account + Release

Includes:

```text
Profile
+
Delete Account
+
Security
+
Tests
+
Browser flows
+
Performance
```

Goal:

> MVP is release-ready.

---

# 18. Recommended Execution Order

### Wave 1 — Foundation

**Status:** Complete

```text
E01
E02
E03
```

### Wave 2 — Core Knowledge

**Status:** Complete

```text
E04
E10-F06
E10-F05
```

### Wave 3 — Organization & Retrieval

**Status:** Complete

```text
E05
E06
```

### Wave 4 — Reflection & History

**Status:** Complete

```text
E07
```

### Wave 5 — Lifecycle & Dashboard

**Status:** Complete

```text
E08
E09
```

### Wave 6 — Shell & Hardening

**Status:** Complete

```text
E11
E12
```

### Wave 7 — E10 Completion

**Status:** Complete

```text
E10-F03
E10-F04
E10-F07
```

---

# 19. Definition of Done

A task is **Done** when:

- [x] Implementation matches PRD behavior.
- [x] Relevant backend validation exists.
- [x] Authorization exists.
- [x] Database constraints are enforced.
- [x] UI has loading state.
- [x] UI has validation/error state where applicable.
- [x] Success feedback exists.
- [x] Relevant automated tests pass.
- [x] No known N+1 query exists.
- [x] Responsive behavior is checked.
- [x] TypeScript has no type errors.
- [x] Lint/format checks pass.
- [x] No console errors introduced.
- [x] Documentation is updated if behavior changes.

---

# 20. MVP Release Gate

Before calling Luma v1.0 MVP complete:

### Product

- [x] All P0 features implemented.
- [x] No Post-MVP feature accidentally included.

### Backend

- [x] All routes implemented.
- [x] Policies pass.
- [x] Validation pass.
- [x] DB constraints pass.

### Frontend

- [x] All primary pages implemented.
- [x] Quick Capture works globally.
- [x] Mobile navigation works.
- [x] Responsive states verified.

### Testing

- [x] Feature suite passes.
- [x] Browser journeys pass.
- [x] Cross-user isolation verified.
- [x] Search/filter regression tests pass.
- [x] Version history tests pass.

### Security

- [x] Authorization audited.
- [x] Rich text sanitization verified.
- [x] Safe URL rendering verified.
- [x] Production debug disabled.

### Performance

- [x] No N+1 on Knowledge List.
- [x] Dashboard queries reviewed.
- [x] Pagination works.
- [x] Inertia payloads reviewed.

---

# 21. Post-MVP Backlog Placeholder

Do not implement these during MVP.

## P1 — AI

- AI summary
- AI understanding assistance
- AI insight suggestion
- Related Knowledge
- Semantic Search
- AI Knowledge Assistant

## P1 — Sharing

- Unlisted Knowledge
- Share by Link
- Read-only shared page
- Disable Sharing

## P2 — Content

- Image attachment
- File attachment
- Rich media

## P2 — Personalization

- Dark mode
- System theme
- Reminder
- Notification

## P2 — Platform

- PWA
- Native Android
- Native iOS

---

# 22. Backlog Summary by Priority

## P0

Everything required to ship MVP:

```text
Foundation
Authentication
Account
Knowledge
Category
Search
Filter
Sorting
Pagination
Insight
Version History
Trash
Dashboard
Responsive Shell
Testing
Security
Performance baseline
```

## P1

Important follow-up:

```text
Performance enhancements
```

## P2

Future product expansion:

```text
AI
Sharing
Attachments
Dark Mode
Notifications
Native Mobile
```

---

# 23. Final Execution Model

```text
PRD
  ↓
ERD
  ↓
Technical Design
  ↓
API / Route Specification
  ↓
Development Backlog  ← current
  ↓
Implementation
  ↓
Testing
  ↓
Release
```

The backlog intentionally keeps the MVP focused on the core Luma learning loop:

**Capture → Organize → Retrieve → Reflect → Grow**

---

# 24. Progress Log

Running record of wave completion. Newest last.

### Wave 1 - Foundation (complete)

- E01, E02, E03 closed: Laravel + React starter kit, MySQL config, coding standards gate (composer ci:check), full auth flows (register, login with email or username, logout, forgot/reset password, profile update, delete account), core migrations applied to db_luma, models, factories, policies, knowledge status enum.
- Gate: composer ci:check green.

### Wave 2 - Core Knowledge (complete)

- E04 closed: Knowledge list, Quick Capture modal, create/update/delete backend (server-side HtmlSanitizer, definition/understanding versioning, status recalculation), detail page, quick edit with unsaved-changes guard, delete confirmation, global Quick Capture button in the app header.
- E10-F06 (Tiptap rich text editor) and E10-F05 (generic confirmation dialog) closed; E10-F01 (application layout) and the verified parts of E10-F02/F04 ticked.
- Verified: 99 tests / 390 assertions, PHPStan level 7 clean, craft detector 0 findings on knowledge surfaces, browser smoke test of capture -> list -> detail -> edit -> delete with no console errors.

### Wave 3 - Organization & Retrieval (complete)

- E05 Category Management closed: Categories page (list with icon, colour, name, active-knowledge count from SQL aggregation, A–Z/Newest/Most-knowledge sort, kraft empty state), create and edit modal (name + colour swatches + icon grid, per-account unique name enforced in the request and by the DB unique index), delete with PRD confirmation copy, pivot detach so knowledge survives and becomes Uncategorized, plus the searchable multi-select Category Selector with inline Create Category.
- E06 Search, Filter, Sorting & Pagination closed: KnowledgeIndexQuery object (user scope, trashed excluded, eager-loaded categories, allow-listed sort and page sizes, normalized `filters` prop), search across title/definition/my-understanding/insight content excluding source and URL, category filter with OR semantics plus Uncategorized, list toolbar with 400 ms debounced search, category dropdown, sort and per-page selects, contextual match counts, "No knowledge matches." state, and pagination that keeps search/filter/sort state in the query string.
- E10-F05 "Delete Category" ticked (confirmation dialog now covers Knowledge, Category, Account and Unsaved Changes).
- E12 test backlog ticked where coverage now exists: E12-F01 test foundation (demo seeder still open), E12-F02 authentication tests, E12-F04 category tests, E12-F05 search/filter tests; E12-F03 knowledge tests for create, update, delete, status transitions, version rules and cross-user denial (Restore / Force delete stay with E08). Epic Overview shows E12 as Partial.
- Verified: 127 tests / 696 assertions, full `composer ci:check` green (format/lint, `tsc`, Pint, PHPStan level 7, feature suite), craft detector 0 findings on knowledge and category surfaces, browser smoke covering category create/rename/delete, search, single + OR category filters, sort, per-page 10, and page 2 preserving search with no console errors.

### Wave 4 - Reflection & History (complete)

- E07 closed: Insight CRUD on the Knowledge detail page - inline Tiptap composer with Save/Cancel, per-insight Edit and direct Delete (no confirmation), HtmlSanitizer-sanitized content, flat CreateInsight/UpdateInsight/DeleteInsight actions in a DB transaction that run ResolveKnowledgeStatus::apply plus an explicit knowledge touch, and an InsightController behind KnowledgePolicy/InsightPolicy with success toasts.
- Version history moved off the detail payload: new definitionHistory /understandingHistory routes render a read-only knowledge/history page (version stamp, date/time, sanitized content, 20-per-page pagination) reached from Definition and My Understanding History buttons on the detail page.
- E12-F06 ticked: InsightManagementTest (9 tests) and VersionHistoryTest (5 tests) cover add -> Complete, insight without understanding stays Captured, edit, last delete Complete -> Understood, updated_at touch, sanitization, required content, cross-user 403s, newest-first ordering, 20-per-page paging, empty understanding history and owner-only access.
- Verified: 141 tests / 828 assertions, full composer ci:check green (format/lint, tsc, Pint, PHPStan level 7), craft detector 0 findings on knowledge surfaces, browser smoke covering capture -> history pages -> add/edit/delete insight with status transitions and no console errors.

### Wave 5 - Lifecycle & Dashboard (complete)

- E08 closed: Trash page (own trashed records newest deleted first, title, definition snippet, deleted date, Restore and Delete permanently actions, kraft empty state), RestoreKnowledge / ForceDeleteKnowledge actions behind KnowledgePolicy with withTrashed route binding, restore leaves deleted Categories deleted, force delete removes insights, definition and understanding versions and the category pivot, and success toasts on both paths.
- E09 closed: DashboardController with DashboardQuery (progress aggregates over active Knowledge, 30 zero-filled days of created and cumulative growth, latest 5 Knowledge as summary-only rows, latest 5 Insights with their parent Knowledge, top 5 Categories ranked by active Knowledge through one aggregate join), Learning Overview header with Quick Capture, progress stat grid, plain-SVG growth chart with dill bars and an ink cumulative line, recent knowledge and insight lists with empty states, top-category bar rows, and a Trash item in the header nav and sidebar.
- Fixed while verifying: Quick Capture discards the draft with an explicit empty reset on close because Inertia v3 re-defaults a form to its last submitted values after a successful post (reset() was restoring the previous capture), RichTextEditor follows external value changes so the Tiptap surface cannot show stale content, and growth-chart axis labels drop rounded duplicates.
- E12 ticked where coverage now exists: E12-F03 Restore and Force delete tests, E12-F07 dashboard tests.
- Verified: 153 tests / 1171 assertions, format/lint, tsc, Pint, PHPStan level 7 (run as `phpstan -c verify-phpstan.neon --debug` because phpstan.neon stays name-locked until reboot), craft detector 0 findings on dashboard and trash surfaces, and a browser smoke covering empty dashboard, two captures, stats/growth/recent/top categories, delete to trash, restore, permanent delete confirmation and dashboard recount with no console errors.

### Wave 6 - Shell & Hardening (complete)

- E11 closed: shared `nav-items.ts` now drives the sidebar, header and a new `bottom-nav.tsx` (Dashboard, Knowledge, Categories, Trash, Profile; active state through `isCurrentUrl`/`activePrefix`, `env(safe-area-inset-bottom)` padding), the app shell gained `pb-20 md:pb-0` so the fixed bar never covers content, and Sonner switches to bottom-center on mobile with a 76px offset so toasts clear the navigation. Responsive smoke at 390x844 / 834x1112 / 1440x960: no horizontal overflow anywhere, cards measure 358 / 522 / 480, the mobile dialog is 358 wide, toast bottom 768 sits above nav top 787, and the sidebar collapses 256 -> 64 icon-only then re-expands.
- E12-F01 closed: `DemoSeeder` builds demo@luma.test (password `password`) through the real CreateKnowledge / UpdateKnowledge / CreateInsight actions - three categories, six records across Captured / Understood / Complete, a second definition version, two insights and one trashed record - with `DemoSeederTest` covering counts, status mix and idempotent re-runs.
- E12-F09 closed: the knowledge `url` field now accepts only http/https (validation rule plus the existing client-side linkable regex), defensive user scopes were added to the Top Categories join and category knowledge counts with corrupted-pivot tests, mass-assignment tests prove status/owner/id cannot be posted, an HttpOnly + SameSite session cookie test and an APP_DEBUG-off test landed (phpunit now sets `APP_DEBUG=false`), production forces `URL::forceScheme('https')`, `.env.example` documents `SESSION_SECURE_COOKIE` / `SESSION_HTTP_ONLY` / `SESSION_SAME_SITE` plus the production debug and APP_URL notes, and a log-hygiene test proves passwords, reset URLs and the app key never reach the log.
- E12-F10 closed: `QueryBudgetTest` pins query budgets (knowledge list <= 8, filtered list <= 10, dashboard <= 14, trash <= 8) over 25-record seeds, asserts every hot-path index by name, proves the list payload ships only the card fields (select projection drops My Understanding, Source, URL and ownership columns), and asserts partial-reload responses drop shared props; the knowledge toolbar and the categories sort now send `only: [...]`.
- E12-F08 closed: `e2e/` holds four puppeteer-core journeys (capture -> edit -> insight -> complete including the `javascript:` URL rejection, search -> filter -> detail, delete -> trash -> restore, profile delete account) behind `npm run test:e2e`, with `puppeteer-core` added as a devDependency.
- E10 boxes ticked from this wave: toast bottom-center on mobile/tablet, safe area above the bottom navigation, and Permanent Delete in the confirmation dialog.
- Verified: 170 tests / 1286 assertions, format/lint, tsc, Pint, PHPStan level 7 (`verify-phpstan.neon`), `npm run build`, craft detector 0 findings on wave-6 sources (41 pre-existing advisory type-ramp findings remain on the landing files `app.tsx`, `landing/vessel.tsx`, `welcome.tsx`), and E2E 4/4 journeys green with no console or page errors.

### Wave 7 - E10 Completion (complete)

- E10-F03 closed: a `use-page-pending` hook counts same-pathname Inertia visits so the knowledge and category lists swap their grids for `KnowledgeListSkeleton` / `CategoryListSkeleton` while search, filter, sort and pagination requests are in flight (header, toolbar and sort stay put; the Search button shows a spinner and disables), and `views/components/boot-skeleton.blade.php` paints a component-aware cold-load skeleton (dashboard stats/chart/lists, knowledge toolbar/cards, category rows, mobile bottom-nav strip) outside `#app` that `app.tsx` removes after the Inertia app mounts (double rAF plus a 4s timeout fallback). The app-shell progress color moved to dill `#5C7F4A`.
- E10-F04 closed: `InputError` renders `role="alert"` in ruby; every auth, settings, knowledge and category field pairs `aria-invalid` with `aria-describedby` pointing at its error id; `stamp.ts` gained `inputClasses(error)` so invalid fields wear the ruby border and ring without conflicting with focus styles; the rich text wrapper, colour/icon fieldsets, category selector toggle and delete-password field wire their errors the same way.
- E10-F07 closed: the category selector moves focus into its search on open, closes on outside pointerdown, walks options with ArrowDown/ArrowUp/Home/End, takes the single match with Enter (preventDefault keeps it from submitting the form), returns focus to the Add button on Escape, and handles Escape from anywhere in the selector via a document listener. Escape belongs to the panel only: Quick Capture's dialog returns `preventDefault()` from `onEscapeKeyDown` while `categoryPanelIsOpen()` because Radix dismisses on document capture before React's bubble-phase handlers run (this also fixed Escape silently closing the capture dialog during the E2E run).
- E2E journey 05 added (`05-form-errors-keyboard.js`): an empty Quick Capture submit asserts `aria-invalid`, `aria-describedby`, `role="alert"` and the ruby border, then drives the selector keyboard flow (focus on open, Enter pick, Escape closes the panel while the dialog stays open and focus returns to Add, ArrowDown/ArrowUp walk) and saves the record.
- Verified: 170 tests / 1286 assertions, format/lint, tsc, Pint, PHPStan level 7 (`verify-phpstan.neon`), `npm run build`, craft detector 0 findings on wave-7 sources, E2E 5/5 journeys green with no console or page errors, and a bounded screenshot pass covering cold-load skeletons (dashboard, knowledge, categories on desktop plus knowledge at 390x844), in-flight list skeletons (knowledge desktop and mobile with the Search spinner, categories during a sort visit) and invalid-form states (Quick Capture desktop and mobile with ruby borders and alert messages, login wrong-credentials) at 1440x960 and 390x844.
