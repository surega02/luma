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

| Epic | Name                                        | Priority |
| ---- | ------------------------------------------- | -------: |
| E01  | Project Bootstrap & Engineering Foundation  |       P0 |
| E02  | Authentication & Account Management         |       P0 |
| E03  | Database, Models & Authorization Foundation |       P0 |
| E04  | Knowledge Management                        |       P0 |
| E05  | Category Management                         |       P0 |
| E06  | Search, Filter, Sorting & Pagination        |       P0 |
| E07  | Insight & Version History                   |       P0 |
| E08  | Trash & Lifecycle Management                |       P0 |
| E09  | Dashboard & Learning Analytics              |       P0 |
| E10  | React/Inertia UX Infrastructure             |       P0 |
| E11  | Responsive Navigation & Application Shell   |       P0 |
| E12  | Testing, Security & Release Hardening       |       P0 |

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
- [x] Configure PHP 8.3+.
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

- [ ] Category list page.
- [ ] Icon.
- [ ] Color.
- [ ] Name.
- [ ] Knowledge count.
- [ ] Edit.
- [ ] Delete.
- [ ] Empty state.

**Acceptance Criteria**

- Category count reflects active Knowledge.

---

## E05-F02 — Create Category

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Create modal.
- [ ] Name.
- [ ] Color.
- [ ] Icon.
- [ ] Unique name validation.
- [ ] Success toast.

**Acceptance Criteria**

- Duplicate name in same account is rejected.

---

## E05-F03 — Edit Category

**Priority:** P0  
**Effort:** S

Tasks:

- [ ] Edit modal.
- [ ] Unique name validation.
- [ ] Update icon/color.
- [ ] Success toast.

---

## E05-F04 — Delete Category

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Show affected knowledge count.
- [ ] Confirmation.
- [ ] Detach pivot rows.
- [ ] Delete Category.
- [ ] Knowledge remains.
- [ ] Uncategorized behavior.

**Acceptance Criteria**

- No Knowledge is deleted when Category is removed.

---

## E05-F05 — Category Selector

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Searchable multi-select.
- [ ] Selected category chips.
- [ ] Multiple category support.
- [ ] Create Category action.
- [ ] Return newly created category to selector.

**Acceptance Criteria**

- User can create and select a new Category without leaving Knowledge form.

---

# 9. E06 — Search, Filter, Sorting & Pagination

## E06-F01 — Knowledge search

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Search Title.
- [ ] Search Definition.
- [ ] Search My Understanding.
- [ ] Search Insight.
- [ ] Case-insensitive partial match.
- [ ] Exclude Source/URL.
- [ ] Debounce typing.
- [ ] Search button.
- [ ] Empty search result state.

**Acceptance Criteria**

- Search `machine` finds `Machine Learning`.
- Search is case-insensitive.

---

## E06-F02 — Category filter

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Multiple category filter.
- [ ] OR semantics.
- [ ] Uncategorized filter.
- [ ] Category + Uncategorized OR logic.
- [ ] Preserve filter in query string.

**Acceptance Criteria**

- Programming + AI returns Knowledge matching either category.

---

## E06-F03 — Sorting

**Priority:** P0  
**Effort:** S

Tasks:

- [ ] Recently Updated.
- [ ] Newest.
- [ ] Oldest.
- [ ] Allow-list sort values.

**Acceptance Criteria**

- Invalid sort value cannot manipulate SQL.

---

## E06-F04 — Pagination

**Priority:** P0  
**Effort:** S

Tasks:

- [ ] 10/page.
- [ ] 20/page.
- [ ] 50/page.
- [ ] Default 20.
- [ ] Preserve query/filter state.

**Acceptance Criteria**

- Search/filter/sort persists while navigating pages.

---

## E06-F05 — Knowledge Query Object

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Create KnowledgeIndexQuery.
- [ ] User scope.
- [ ] Active record scope.
- [ ] Eager loading.
- [ ] Search.
- [ ] Filter.
- [ ] Sorting.
- [ ] Pagination.

**Acceptance Criteria**

- No N+1 query on Knowledge List.

---

# 10. E07 — Insight & Version History

## E07-F01 — Add Insight

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Add Insight control.
- [ ] Tiptap editor.
- [ ] Save/Cancel.
- [ ] Validation.
- [ ] CreateInsight action.
- [ ] Status recalculation.
- [ ] Updated timestamp.
- [ ] Success toast.

**Acceptance Criteria**

- First Insight can transition Understood → Complete.

---

## E07-F02 — Edit Insight

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Inline/modal edit state.
- [ ] Save/Cancel.
- [ ] UpdateInsight action.
- [ ] Status recalculation.
- [ ] Updated timestamp.

**Acceptance Criteria**

- Insight changes persist without auto-save.

---

## E07-F03 — Delete Insight

**Priority:** P0  
**Effort:** S

Tasks:

- [ ] Direct delete action.
- [ ] No confirmation.
- [ ] Update status.
- [ ] Update Knowledge timestamp.

**Acceptance Criteria**

- Deleting last Insight changes Complete → Understood.

---

## E07-F04 — Definition History

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Definition History button.
- [ ] History page/modal.
- [ ] Version number.
- [ ] Date/time.
- [ ] Content.
- [ ] Read-only.
- [ ] Pagination.

**Acceptance Criteria**

- Version history follows every Save Changes.

---

## E07-F05 — My Understanding History

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] History button.
- [ ] Empty history state.
- [ ] Version number.
- [ ] Date/time.
- [ ] Content.
- [ ] Read-only.
- [ ] Pagination.

**Acceptance Criteria**

- First saved My Understanding becomes Version 1.

---

# 11. E08 — Trash & Lifecycle Management

## E08-F01 — Trash List

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Trash page.
- [ ] Responsive cards.
- [ ] Title.
- [ ] Definition snippet.
- [ ] Deleted date.
- [ ] Restore.
- [ ] Permanent delete.
- [ ] Newest deleted first.
- [ ] Empty state.

**Acceptance Criteria**

- Only current user's trashed Knowledge appears.

---

## E08-F02 — Restore

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Restore endpoint.
- [ ] Restore authorization.
- [ ] withTrashed route binding/query.
- [ ] Restore Knowledge.
- [ ] Success toast.
- [ ] Missing Category behavior.

**Acceptance Criteria**

- Deleted Category is not recreated on restore.

---

## E08-F03 — Permanent Delete

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Permanent delete confirmation.
- [ ] Force delete endpoint.
- [ ] Remove dependent data.
- [ ] Success toast.

**Acceptance Criteria**

- Knowledge and all dependent MVP data are permanently removed.

---

# 12. E09 — Dashboard & Learning Analytics

## E09-F01 — Learning Progress

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Total Knowledge.
- [ ] Captured count.
- [ ] Understood count.
- [ ] Complete count.
- [ ] SQL aggregate query.

**Acceptance Criteria**

- Counts match active Knowledge only.

---

## E09-F02 — 30-Day Growth

**Priority:** P0  
**Effort:** L

Tasks:

- [ ] Daily Knowledge created.
- [ ] Cumulative Knowledge.
- [ ] 30-day date range.
- [ ] Fill zero-activity dates.
- [ ] Query optimized in SQL.
- [ ] Chart data contract.

**Acceptance Criteria**

- Every one of the last 30 days has a data point.

---

## E09-F03 — Recent Knowledge

**Priority:** P0  
**Effort:** S

Tasks:

- [ ] Latest 5 active Knowledge.
- [ ] Summary data only.

---

## E09-F04 — Recent Insight

**Priority:** P0  
**Effort:** S

Tasks:

- [ ] Latest 5 Insight records.
- [ ] Include parent Knowledge reference.

---

## E09-F05 — Top Categories

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Count Knowledge by Category.
- [ ] Use active Knowledge only.
- [ ] Sort descending.
- [ ] Define display limit for dashboard.
- [ ] Avoid N+1.

**Acceptance Criteria**

- Category ranking reflects Knowledge count, not Insight count.

---

# 13. E10 — React/Inertia UX Infrastructure

## E10-F01 — Application Layout

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Authenticated layout.
- [ ] Guest layout.
- [ ] Header.
- [ ] Global Quick Capture access.
- [ ] Flash/toast host.

---

## E10-F02 — Toast System

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Success toast.
- [ ] Error toast.
- [ ] Bottom-right desktop.
- [ ] Bottom-center mobile/tablet.
- [ ] Auto dismiss.
- [ ] Manual close.
- [ ] Safe area above bottom navigation.

**Acceptance Criteria**

- Every successful mutation can display product-defined success feedback.

---

## E10-F03 — Skeleton Loading

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Knowledge list skeleton.
- [ ] Dashboard skeleton.
- [ ] Category list skeleton where useful.
- [ ] Action button loading state.

---

## E10-F04 — Form Validation UI

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Field error component.
- [ ] Accessible error messages.
- [ ] Invalid state styles.
- [ ] Preserve entered values after validation failure.

---

## E10-F05 — Confirmation Dialog

**Priority:** P0  
**Effort:** M

Tasks:

- [x] Generic confirmation component.
- [x] Delete Knowledge.
- [ ] Permanent Delete.
- [ ] Delete Category.
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
- [ ] Keyboard support.
- [x] Create Category action.
- [x] Empty category results.

---

# 14. E11 — Responsive Navigation & Application Shell

## E11-F01 — Desktop Sidebar

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Fixed sidebar.
- [ ] Expanded state.
- [ ] Collapsed state.
- [ ] Icon-only collapsed mode.
- [ ] Active menu state.

---

## E11-F02 — Mobile Bottom Navigation

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Bottom navigation.
- [ ] Dashboard.
- [ ] Knowledge.
- [ ] Categories.
- [ ] Trash.
- [ ] Profile.
- [ ] Safe spacing for toast/modal.

---

## E11-F03 — Responsive Breakpoints

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Card resizing.
- [ ] Modal responsive sizing.
- [ ] No horizontal overflow.

**Acceptance Criteria**

- Primary flows work at mobile, tablet, and desktop widths.

---

# 15. E12 — Testing, Security & Release Hardening

## E12-F01 — Feature Test Foundation

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Factories.
- [ ] Test database.
- [ ] Authentication helpers.
- [ ] Seed/demo data where useful.
- [ ] Base feature test patterns.

---

## E12-F02 — Authentication Tests

**Priority:** P0  
**Effort:** M

Tests:

- [ ] Register.
- [ ] Login.
- [ ] Logout.
- [ ] Password reset.
- [ ] Password update.
- [ ] Delete account.

---

## E12-F03 — Knowledge Tests

**Priority:** P0  
**Effort:** L

Tests:

- [ ] Create.
- [ ] Update.
- [ ] Delete.
- [ ] Restore.
- [ ] Force delete.
- [ ] Status transitions.
- [ ] Version rules.
- [ ] Cross-user denial.

---

## E12-F04 — Category Tests

**Priority:** P0  
**Effort:** M

Tests:

- [ ] Create.
- [ ] Duplicate rejection.
- [ ] Update.
- [ ] Delete.
- [ ] Ownership.
- [ ] Pivot behavior.

---

## E12-F05 — Search / Filter Tests

**Priority:** P0  
**Effort:** M

Tests:

- [ ] Title match.
- [ ] Definition match.
- [ ] Understanding match.
- [ ] Insight match.
- [ ] Case-insensitive.
- [ ] Partial match.
- [ ] Source excluded.
- [ ] URL excluded.
- [ ] Category OR.
- [ ] Uncategorized.
- [ ] Category + Uncategorized.

---

## E12-F06 — Insight / History Tests

**Priority:** P0  
**Effort:** M

Tests:

- [ ] Insight create.
- [ ] Insight update.
- [ ] Insight delete.
- [ ] Complete → Understood.
- [ ] Definition versions.
- [ ] Understanding versions.

---

## E12-F07 — Dashboard Tests

**Priority:** P0  
**Effort:** M

Tests:

- [ ] Progress metrics.
- [ ] 30-day growth.
- [ ] Recent Knowledge.
- [ ] Recent Insight.
- [ ] Top Categories.

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

---

## E12-F09 — Security Hardening

**Priority:** P0  
**Effort:** M

Tasks:

- [ ] Audit all policies.
- [ ] Audit all user-scoped queries.
- [ ] Audit mass assignment.
- [ ] Sanitize rich text.
- [ ] Safe URL rendering.
- [ ] Production APP_DEBUG=false.
- [ ] HTTPS.
- [ ] Secure cookies/session.
- [ ] Verify secrets are excluded from logs.

---

## E12-F10 — Performance Audit

**Priority:** P1  
**Effort:** M

Tasks:

- [ ] N+1 query audit.
- [ ] Dashboard query audit.
- [ ] Knowledge list query audit.
- [ ] Index verification.
- [ ] Inertia payload review.
- [ ] Partial reload review.

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

```text
E01
E02
E03
```

### Wave 2 — Core Knowledge

```text
E04
E10-F06
E10-F05
```

### Wave 3 — Organization & Retrieval

```text
E05
E06
```

### Wave 4 — Reflection & History

```text
E07
```

### Wave 5 — Lifecycle & Dashboard

```text
E08
E09
```

### Wave 6 — Shell & Hardening

```text
E11
E12
```

---

# 19. Definition of Done

A task is **Done** when:

- [ ] Implementation matches PRD behavior.
- [ ] Relevant backend validation exists.
- [ ] Authorization exists.
- [ ] Database constraints are enforced.
- [ ] UI has loading state.
- [ ] UI has validation/error state where applicable.
- [ ] Success feedback exists.
- [ ] Relevant automated tests pass.
- [ ] No known N+1 query exists.
- [ ] Responsive behavior is checked.
- [ ] TypeScript has no type errors.
- [ ] Lint/format checks pass.
- [ ] No console errors introduced.
- [ ] Documentation is updated if behavior changes.

---

# 20. MVP Release Gate

Before calling Luma v1.0 MVP complete:

### Product

- [ ] All P0 features implemented.
- [ ] No Post-MVP feature accidentally included.

### Backend

- [ ] All routes implemented.
- [ ] Policies pass.
- [ ] Validation pass.
- [ ] DB constraints pass.

### Frontend

- [ ] All primary pages implemented.
- [ ] Quick Capture works globally.
- [ ] Mobile navigation works.
- [ ] Responsive states verified.

### Testing

- [ ] Feature suite passes.
- [ ] Browser journeys pass.
- [ ] Cross-user isolation verified.
- [ ] Search/filter regression tests pass.
- [ ] Version history tests pass.

### Security

- [ ] Authorization audited.
- [ ] Rich text sanitization verified.
- [ ] Safe URL rendering verified.
- [ ] Production debug disabled.

### Performance

- [ ] No N+1 on Knowledge List.
- [ ] Dashboard queries reviewed.
- [ ] Pagination works.
- [ ] Inertia payloads reviewed.

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
