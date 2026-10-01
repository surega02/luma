# Luma v1.0 — API / Route & Backend Specification

> **Tagline:** Learn. Capture. Grow.  
> **Scope:** MVP  
> **Architecture:** Laravel 13 + Inertia 3 + React 19 + TypeScript + MySQL  
> **API style:** Server-driven web application using Laravel routes + Inertia.  
> **Public REST API:** Not part of MVP.

---

## 1. Purpose

Dokumen ini menerjemahkan PRD, ERD, dan Technical Design Luma v1.0 menjadi kontrak implementasi backend yang konkret.

Cakupan:

- route map
- controller responsibilities
- request validation
- authorization
- action/service responsibilities
- Inertia page props
- query/filter behavior
- backend business rules
- transaction boundaries
- error and redirect behavior
- testing matrix

---

# 2. Backend Architecture

```text
Browser
  │
  ▼
Inertia React
  │
  │ GET / POST / PATCH / DELETE
  ▼
Laravel Route
  │
  ▼
Controller
  ├── Form Request
  ├── Policy
  ├── Query Object
  └── Action
          │
          ▼
      Eloquent
          │
          ▼
        MySQL
```

### Responsibility

| Layer        | Responsibility                           |
| ------------ | ---------------------------------------- |
| Route        | URL + HTTP method + middleware           |
| Controller   | Orchestration, response, redirect        |
| Form Request | Input validation + request authorization |
| Policy       | Resource authorization                   |
| Query Object | Complex read/query composition           |
| Action       | Business operation with side effects     |
| Model        | Persistence + relationships + casts      |
| Database     | Integrity, FK, unique constraints        |

Controllers must remain thin.

---

# 3. Route Groups

## 3.1 Public Routes

| Method | URI                | Name               | Handler     | Auth  |
| ------ | ------------------ | ------------------ | ----------- | ----- |
| GET    | `/`                | `home`             | `Welcome`   | Guest |
| GET    | `/login`           | `login`            | Starter Kit | Guest |
| GET    | `/register`        | `register`         | Starter Kit | Guest |
| GET    | `/forgot-password` | `password.request` | Starter Kit | Guest |

Authentication routes are provided by the Laravel official React starter kit.

---

## 3.2 Authenticated Application Routes

All routes below use:

```text
middleware: auth
```

Main pages:

| Method | URI                              | Name                     | Controller                         |
| ------ | -------------------------------- | ------------------------ | ---------------------------------- |
| GET    | `/dashboard`                     | `dashboard`              | `DashboardController@index`        |
| GET    | `/knowledge`                     | `knowledge.index`        | `KnowledgeController@index`        |
| POST   | `/knowledge`                     | `knowledge.store`        | `KnowledgeController@store`        |
| GET    | `/knowledge/{knowledge}`         | `knowledge.show`         | `KnowledgeController@show`         |
| PATCH  | `/knowledge/{knowledge}`         | `knowledge.update`       | `KnowledgeController@update`       |
| DELETE | `/knowledge/{knowledge}`         | `knowledge.destroy`      | `KnowledgeController@destroy`      |
| GET    | `/categories`                    | `categories.index`       | `CategoryController@index`         |
| POST   | `/categories`                    | `categories.store`       | `CategoryController@store`         |
| PATCH  | `/categories/{category}`         | `categories.update`      | `CategoryController@update`        |
| DELETE | `/categories/{category}`         | `categories.destroy`     | `CategoryController@destroy`       |
| GET    | `/trash`                         | `trash.index`            | `TrashController@index`            |
| POST   | `/knowledge/{knowledge}/restore` | `knowledge.restore`      | `TrashController@restore`          |
| DELETE | `/knowledge/{knowledge}/force`   | `knowledge.force-delete` | `TrashController@forceDelete`      |
| GET    | `/profile`                       | `profile.index`          | `ProfileController@index`          |
| PATCH  | `/profile`                       | `profile.update`         | `ProfileController@update`         |
| PUT    | `/password`                      | `password.update`        | `ProfileController@updatePassword` |
| DELETE | `/profile`                       | `profile.destroy`        | `ProfileController@destroy`        |

---

## 3.3 Insight Routes

| Method | URI                               | Name                       | Controller                  |
| ------ | --------------------------------- | -------------------------- | --------------------------- |
| POST   | `/knowledge/{knowledge}/insights` | `knowledge.insights.store` | `InsightController@store`   |
| PATCH  | `/insights/{insight}`             | `insights.update`          | `InsightController@update`  |
| DELETE | `/insights/{insight}`             | `insights.destroy`         | `InsightController@destroy` |

Insight is a child resource of Knowledge for creation, while update/delete uses the Insight resource itself.

---

## 3.4 Version History Routes

Definition:

```text
GET /knowledge/{knowledge}/definition-history
```

Name:

```text
knowledge.definition-history
```

My Understanding:

```text
GET /knowledge/{knowledge}/understanding-history
```

Name:

```text
knowledge.understanding-history
```

Both endpoints are authenticated and must authorize access through the parent Knowledge.

---

# 4. Route Declaration

Recommended `routes/web.php` shape:

```php
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InsightController;
use App\Http\Controllers\KnowledgeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrashController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => inertia('Welcome'))->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/knowledge', [KnowledgeController::class, 'index'])
        ->name('knowledge.index');

    Route::post('/knowledge', [KnowledgeController::class, 'store'])
        ->name('knowledge.store');

    Route::get('/knowledge/{knowledge}', [KnowledgeController::class, 'show'])
        ->name('knowledge.show');

    Route::patch('/knowledge/{knowledge}', [KnowledgeController::class, 'update'])
        ->name('knowledge.update');

    Route::delete('/knowledge/{knowledge}', [KnowledgeController::class, 'destroy'])
        ->name('knowledge.destroy');

    Route::get('/categories', [CategoryController::class, 'index'])
        ->name('categories.index');

    Route::post('/categories', [CategoryController::class, 'store'])
        ->name('categories.store');

    Route::patch('/categories/{category}', [CategoryController::class, 'update'])
        ->name('categories.update');

    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy');

    Route::get('/trash', [TrashController::class, 'index'])
        ->name('trash.index');

    Route::post('/knowledge/{knowledge}/restore', [TrashController::class, 'restore'])
        ->name('knowledge.restore');

    Route::delete('/knowledge/{knowledge}/force', [TrashController::class, 'forceDelete'])
        ->name('knowledge.force-delete');

    Route::post('/knowledge/{knowledge}/insights', [InsightController::class, 'store'])
        ->name('knowledge.insights.store');

    Route::patch('/insights/{insight}', [InsightController::class, 'update'])
        ->name('insights.update');

    Route::delete('/insights/{insight}', [InsightController::class, 'destroy'])
        ->name('insights.destroy');

    Route::get(
        '/knowledge/{knowledge}/definition-history',
        [KnowledgeController::class, 'definitionHistory']
    )->name('knowledge.definition-history');

    Route::get(
        '/knowledge/{knowledge}/understanding-history',
        [KnowledgeController::class, 'understandingHistory']
    )->name('knowledge.understanding-history');

    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile.index');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::put('/password', [ProfileController::class, 'updatePassword'])
        ->name('password.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});
```

Use route model binding for resource parameters.

---

# 5. Controller Contract

## 5.1 DashboardController

### `index()`

Returns:

```text
Inertia::render('Dashboard/Index', props)
```

Props:

```ts
{
    progress: {
        total: number;
        captured: number;
        understood: number;
        complete: number;
    };

    recentKnowledge: KnowledgeSummary[];
    recentInsights: RecentInsight[];
    growth: GrowthPoint[];
    topCategories: CategoryStat[];
}
```

Dashboard query must be server-side and aggregate in SQL.

---

# 6. KnowledgeController

## 6.1 `index()`

### Purpose

Render Knowledge List.

### Input Query Parameters

```text
search
category_ids[]
sort
per_page
page
```

Allowed values:

```text
sort:
    recently_updated
    newest
    oldest

per_page:
    10
    20
    50
```

Default:

```text
sort = recently_updated
per_page = 20
```

### Props

```ts
{
    knowledges: Paginated<KnowledgeCard>;
    filters: {
        search: string | null;
        category_ids: number[];
        sort: string;
        per_page: number;
    };
    categories: CategoryOption[];
}
```

### Query behavior

Search fields:

- `title`
- `definition`
- `my_understanding`
- `insights.content`

Search:

- case-insensitive
- partial match

Search excludes:

- `source`
- `url`

---

# 7. Knowledge Search Query

Create:

```text
App\Queries\KnowledgeIndexQuery
```

Responsibilities:

1. start from authenticated user's Knowledge
2. exclude trashed records
3. apply search
4. apply category filter
5. apply Uncategorized filter
6. apply safe sort mapping
7. eager load required relationships
8. paginate

Pseudo flow:

```php
$query = $user->knowledges()
    ->with(['categories', 'insights'])
    ->whereNull('deleted_at');

if ($search !== null) {
    // grouped search across knowledge + insights
}

if ($categoryIds !== []) {
    // OR category filter
}

if ($includeUncategorized) {
    // OR no-category condition
}

$query->orderBy(...safe sort...);

return $query->paginate($perPage);
```

All filter conditions must remain inside the user's scoped query.

---

# 8. Category Filter Semantics

Multiple selected categories use **OR**.

Example:

```text
Programming + AI
```

means:

```text
Knowledge has Programming
OR
Knowledge has AI
```

For Uncategorized:

```text
Programming + AI + Uncategorized
```

means:

```text
has Programming
OR
has AI
OR
has no category
```

Use grouped query conditions so OR clauses cannot bypass:

```text
where user_id = current_user
```

---

# 9. KnowledgeController — `store()`

### Request

```text
POST /knowledge
```

### Request Class

```text
StoreKnowledgeRequest
```

### Input

```json
{
    "title": "Machine Learning",
    "definition": "<p>...</p>",
    "my_understanding": "<p>...</p>",
    "category_ids": [1, 3],
    "source": "Google AI Guide",
    "url": "https://example.com"
}
```

### Validation

```text
title:
    required|string

definition:
    required|string

my_understanding:
    nullable|string

category_ids:
    nullable|array

category_ids.*:
    integer|exists in categories owned by current user

source:
    nullable|string

url:
    nullable|string
```

No application-level URL format validation.

### Authorization

Authenticated user can create Knowledge for self.

### Action

```text
CreateKnowledge
```

### Transaction

Required.

### Side Effects

1. create Knowledge
2. sync categories
3. create Definition Version 1
4. create My Understanding Version 1 if non-null/non-empty
5. calculate status
6. commit

### Response

Redirect:

```text
knowledge.index
```

Flash:

```text
success = "Knowledge created successfully."
```

---

# 10. KnowledgeController — `show()`

### Request

```text
GET /knowledge/{knowledge}
```

### Authorization

```text
KnowledgePolicy@view
```

### Include

```text
categories
insights
```

History is not required on initial page load.

### Props

```ts
{
    knowledge: KnowledgeDetail;
}
```

Optional lazy/deferred data may be used for history counts or secondary data.

---

# 11. KnowledgeController — `update()`

### Request

```text
PATCH /knowledge/{knowledge}
```

### Request Class

```text
UpdateKnowledgeRequest
```

### Authorization

```text
KnowledgePolicy@update
```

### Input

Same as Store.

### Action

```text
UpdateKnowledge
```

### Required Transaction Steps

```text
BEGIN
  update main Knowledge
  create Definition Version
  create My Understanding Version if applicable
  sync categories
  recalculate status
COMMIT
```

### Version Rule

Every successful Save Changes creates a new Definition Version.

For My Understanding:

- if value exists after save, create next version
- first saved value = version 1
- subsequent Save Changes = version + 1

### Response

```text
redirect knowledge.show
```

Flash:

```text
"Knowledge updated successfully."
```

---

# 12. Definition History

## Endpoint

```text
GET /knowledge/{knowledge}/definition-history
```

### Authorization

```text
KnowledgePolicy@view
```

### Query

```php
$knowledge->definitionVersions()
    ->orderByDesc('version')
    ->paginate(20);
```

### Props

```ts
{
    history: Paginated<DefinitionVersion>;
}
```

### Output

Each item:

```json
{
    "version": 3,
    "content": "<p>...</p>",
    "created_at": "2026-09-27T10:00:00+07:00"
}
```

Read-only.

No restore.

No diff.

---

# 13. My Understanding History

## Endpoint

```text
GET /knowledge/{knowledge}/understanding-history
```

Rules identical to Definition History.

If there has never been a My Understanding value, return an empty paginated result.

---

# 14. KnowledgeController — `destroy()`

### Request

```text
DELETE /knowledge/{knowledge}
```

### Authorization

```text
KnowledgePolicy@delete
```

### Behavior

Use Laravel SoftDeletes.

```php
$knowledge->delete();
```

### Response

Redirect:

```text
knowledge.index
```

Flash:

```text
"Knowledge deleted successfully."
```

No hard delete occurs here.

---

# 15. TrashController — `index()`

### Request

```text
GET /trash
```

### Query

Only trashed Knowledge owned by current user.

```php
$user->knowledges()
    ->onlyTrashed()
    ->with('categories')
    ->latest('deleted_at')
    ->paginate(20);
```

### Props

```ts
{
    knowledges: Paginated<TrashKnowledgeCard>;
}
```

Sorting is fixed:

```text
deleted_at DESC
```

---

# 16. TrashController — `restore()`

### Request

```text
POST /knowledge/{knowledge}/restore
```

### Important

Route model binding must include trashed records.

Use:

```php
->withTrashed()
```

or equivalent explicit query resolution.

### Authorization

```text
KnowledgePolicy@restore
```

### Behavior

```php
$knowledge->restore();
```

### Category behavior

If a previous Category was deleted:

- do not recreate Category
- restore Knowledge
- remaining categories stay attached
- if none remain, UI shows Uncategorized

### Response

Redirect:

```text
trash.index
```

Flash:

```text
"Knowledge restored successfully."
```

---

# 17. TrashController — `forceDelete()`

### Request

```text
DELETE /knowledge/{knowledge}/force
```

### Authorization

```text
KnowledgePolicy@forceDelete
```

### Behavior

Permanent deletion.

Dependent records:

- Insights
- Definition Versions
- Understanding Versions
- Category pivot records

must be removed according to foreign-key / application strategy.

### Confirmation

Frontend confirmation is required.

Backend does not depend on frontend confirmation for security.

### Response

Redirect:

```text
trash.index
```

Flash:

```text
"Knowledge permanently deleted."
```

---

# 18. CategoryController — `index()`

### Request

```text
GET /categories
```

### Query Parameters

```text
sort
```

Allowed:

```text
az
newest
most_knowledge
```

Default:

```text
az
```

### Props

```ts
{
    categories: CategoryListItem[];
    sorting: {
        current: string;
    };
}
```

Each category includes:

```text
id
name
color
icon
knowledge_count
created_at
```

Use SQL aggregation for `knowledge_count`.

---

# 19. CategoryController — `store()`

### Request

```text
POST /categories
```

### Request Class

```text
StoreCategoryRequest
```

### Input

```json
{
    "name": "Programming",
    "color": "blue",
    "icon": "code"
}
```

### Validation

```text
name:
    required|string|unique for current user

color:
    required|string

icon:
    required|string
```

Enforce uniqueness again at database level:

```text
UNIQUE(user_id, name)
```

### Response

Redirect:

```text
categories.index
```

Flash:

```text
"Category created successfully."
```

---

# 20. CategoryController — `update()`

### Request

```text
PATCH /categories/{category}
```

### Authorization

```text
CategoryPolicy@update
```

### Request Class

```text
UpdateCategoryRequest
```

### Rule

Category name must remain unique within the same user.

### Response

```text
categories.index
```

Flash:

```text
"Category updated successfully."
```

---

# 21. CategoryController — `destroy()`

### Request

```text
DELETE /categories/{category}
```

### Authorization

```text
CategoryPolicy@delete
```

### Behavior

1. count affected Knowledge
2. detach category from pivot
3. delete Category

Knowledge remains.

### Transaction

Recommended.

### Response

```text
categories.index
```

Flash:

```text
"Category deleted successfully."
```

Affected count should be available to the confirmation UI before the delete mutation.

Recommended supporting read:

```text
GET /categories/{category}/impact
```

However, to keep MVP small, the category list can already render:

```text
knowledge_count
```

and use that count for the confirmation message.

---

# 22. InsightController — `store()`

### Request

```text
POST /knowledge/{knowledge}/insights
```

### Request Class

```text
StoreInsightRequest
```

### Input

```json
{
    "content": "<p>This is my insight.</p>"
}
```

### Validation

```text
content:
    required|string
```

### Authorization

```text
KnowledgePolicy@update
```

The ability to add an Insight requires access to edit the parent Knowledge.

### Action

```text
CreateInsight
```

### Side Effects

1. create Insight
2. recalculate Knowledge status
3. touch Knowledge.updated_at

### Response

Redirect:

```text
knowledge.show
```

Flash:

```text
"Insight added successfully."
```

---

# 23. InsightController — `update()`

### Request

```text
PATCH /insights/{insight}
```

### Authorization

```text
InsightPolicy@update
```

### Side Effects

1. update content
2. recalculate parent Knowledge status
3. touch Knowledge.updated_at

### Response

```text
knowledge.show
```

Flash:

```text
"Insight updated successfully."
```

---

# 24. InsightController — `destroy()`

### Request

```text
DELETE /insights/{insight}
```

### Authorization

```text
InsightPolicy@delete
```

### Side Effects

1. delete Insight
2. recalculate parent Knowledge status
3. touch Knowledge.updated_at

### Response

```text
knowledge.show
```

Flash:

```text
"Insight deleted successfully."
```

No frontend confirmation is required by product behavior.

---

# 25. ProfileController — `index()`

### Request

```text
GET /profile
```

### Props

```ts
{
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
    }
}
```

Never expose:

```text
password
remember_token
security secrets
```

---

# 26. ProfileController — `update()`

### Request

```text
PATCH /profile
```

### Fields

```text
name
username
```

### Validation

```text
name:
    required|string

username:
    required|string|unique except current user
```

Email is not editable from Profile.

### Response

Redirect:

```text
profile.index
```

Flash:

```text
"Profile updated successfully."
```

---

# 27. Password Update

### Request

```text
PUT /password
```

### Validation

```text
current_password
password
password_confirmation
```

Password:

```text
minimum 8 characters
```

### Authorization

Authenticated user.

### Behavior

- validate current password
- hash new password
- persist
- optionally invalidate other sessions according to starter-kit/auth configuration

### Response

```text
profile.index
```

Flash:

```text
"Password changed successfully."
```

---

# 28. Delete Account

### Request

```text
DELETE /profile
```

### Required Input

```text
password
```

### Validation

```text
required
current password must match
```

### Transaction

Recommended:

```text
BEGIN
  delete user's data
  delete user
COMMIT
```

### Deletion Scope

- Knowledge
- Category
- Insight
- Version history
- Pivot records
- User

All user-owned records are removed.

### Response

Redirect to guest landing page.

Flash:

```text
"Your account has been deleted."
```

---

# 29. Authorization Matrix

| Resource              |            View |          Create |       Update |       Delete | Restore | Force Delete |
| --------------------- | --------------: | --------------: | -----------: | -----------: | ------: | -----------: |
| Knowledge             |           Owner |       Auth user |        Owner |        Owner |   Owner |        Owner |
| Category              |           Owner |       Auth user |        Owner |        Owner |       — |            — |
| Insight               |    Parent owner | Knowledge owner | Parent owner | Parent owner |       — |            — |
| Definition History    | Knowledge owner |          System |            — |            — |       — |            — |
| Understanding History | Knowledge owner |          System |            — |            — |       — |            — |

No route should allow access to another user's resource by guessing an ID.

---

# 30. Form Request List

```text
app/Http/Requests/
├── Knowledge/
│   ├── StoreKnowledgeRequest.php
│   └── UpdateKnowledgeRequest.php
│
├── Category/
│   ├── StoreCategoryRequest.php
│   └── UpdateCategoryRequest.php
│
├── Insight/
│   ├── StoreInsightRequest.php
│   └── UpdateInsightRequest.php
│
└── Profile/
    ├── UpdateProfileRequest.php
    ├── UpdatePasswordRequest.php
    └── DeleteAccountRequest.php
```

Form Requests own request-level validation.

Policies remain the authoritative resource authorization layer.

---

# 31. Action Classes

Recommended:

```text
app/Actions/
├── Knowledge/
│   ├── CreateKnowledge.php
│   ├── UpdateKnowledge.php
│   ├── DeleteKnowledge.php
│   ├── RestoreKnowledge.php
│   ├── ForceDeleteKnowledge.php
│   └── RecalculateKnowledgeStatus.php
│
├── Category/
│   ├── CreateCategory.php
│   ├── UpdateCategory.php
│   └── DeleteCategory.php
│
├── Insight/
│   ├── CreateInsight.php
│   ├── UpdateInsight.php
│   └── DeleteInsight.php
│
└── Profile/
    ├── UpdateProfile.php
    ├── UpdatePassword.php
    └── DeleteAccount.php
```

A small CRUD operation does not require a separate Action if it remains genuinely simple. The purpose is to keep multi-write/domain operations testable and away from controllers.

---

# 32. Knowledge Status Service

Recommended dedicated domain operation:

```text
RecalculateKnowledgeStatus
```

Pseudo logic:

```php
if (blank($knowledge->my_understanding)) {
    return KnowledgeStatus::CAPTURED;
}

if ($knowledge->insights()->exists()) {
    return KnowledgeStatus::COMPLETE;
}

return KnowledgeStatus::UNDERSTOOD;
```

All status transitions must go through this logic.

Do not accept `status` from frontend mutation requests.

---

# 33. Versioning Service

Recommended:

```text
CreateKnowledgeVersion
```

Responsibilities:

### Definition

```text
next = max(version) + 1
```

### My Understanding

Only create a version when content exists.

If first non-null save:

```text
version = 1
```

Every subsequent Save:

```text
version = max(version) + 1
```

Because every Save Changes creates a version, do not compare the old and new Definition content to decide whether to create history.

---

# 34. Transaction Boundaries

Use transactions for:

### Create Knowledge

```text
Knowledge
+
DefinitionVersion
+
UnderstandingVersion
+
Category pivot
```

### Update Knowledge

```text
Knowledge
+
DefinitionVersion
+
UnderstandingVersion
+
Category pivot
+
Status
```

### Create/Edit/Delete Insight

```text
Insight
+
Knowledge.updated_at
+
Knowledge.status
```

### Delete Category

```text
detach pivot
+
delete category
```

### Delete Account

```text
all owned data
+
user
```

---

# 35. Inertia Props Contract

## Knowledge Index

```ts
interface KnowledgeIndexProps {
    knowledges: Paginated<KnowledgeCard>;
    categories: CategoryOption[];
    filters: {
        search: string;
        category_ids: number[];
        include_uncategorized: boolean;
        sort: KnowledgeSort;
        per_page: 10 | 20 | 50;
    };
}
```

## Knowledge Show

```ts
interface KnowledgeShowProps {
    knowledge: KnowledgeDetail;
}
```

## Categories Index

```ts
interface CategoriesIndexProps {
    categories: CategoryListItem[];
    sort: CategorySort;
}
```

## Trash Index

```ts
interface TrashIndexProps {
    knowledges: Paginated<TrashKnowledgeCard>;
}
```

## Dashboard

```ts
interface DashboardProps {
    progress: ProgressStats;
    growth: GrowthPoint[];
    recentKnowledge: KnowledgeSummary[];
    recentInsights: RecentInsight[];
    topCategories: CategoryStat[];
}
```

---

# 36. Redirect + Flash Contract

Mutating requests should normally use:

```text
POST/PATCH/DELETE
    ↓
server mutation
    ↓
redirect
    ↓
flash message
    ↓
Inertia page
```

Example:

```php
return to_route('knowledge.index')
    ->with('success', 'Knowledge created successfully.');
```

Do not return ad-hoc JSON from internal Inertia mutations unless a feature specifically requires it.

---

# 37. Error Contract

## Validation Error

Laravel validation automatically redirects back with field errors.

React reads:

```ts
form.errors;
```

Expected UX:

```text
Title
[                       ]
Title is required

Definition
[                       ]
Definition is required
```

## Authorization Error

Return standard `403`.

Do not reveal why another user's record exists.

## Not Found

Return standard `404`.

## Unexpected Server Error

- log server detail
- show friendly UI
- do not expose stack traces in production

---

# 38. Pagination Contract

Laravel paginator JSON/props must be normalized into a frontend-friendly shape.

Recommended:

```ts
interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}
```

Keep page navigation server-driven.

---

# 39. Sorting Contract

### Knowledge

```text
recently_updated
newest
oldest
```

### Categories

```text
az
newest
most_knowledge
```

### Trash

Fixed:

```text
deleted_at DESC
```

Only allow recognized sort keys.

---

# 40. URL Query Contract

Knowledge:

```text
/knowledge
    ?search=machine
    &category_ids[]=1
    &category_ids[]=3
    &include_uncategorized=1
    &sort=recently_updated
    &per_page=20
    &page=2
```

Rules:

- omit empty search
- normalize category IDs
- default invalid sort
- default invalid per_page
- prevent unsupported parameters from affecting SQL

---

# 41. Caching

MVP caching:

- Do not cache per-user Knowledge lists by default.
- Do not cache Dashboard per-user data globally without user-aware keys.
- Prefer correct query/index design first.

Potential future:

- category metadata cache
- dashboard short-lived cache
- AI result cache

---

# 42. Rate Limiting

Authentication endpoints should retain starter-kit / framework rate limiting.

For application mutations:

- no custom rate limit initially
- revisit if abuse appears

Potential future targets:

- repeated Delete Account
- high-volume automated Knowledge creation
- public share endpoints

---

# 43. Backend Test Matrix

## Authentication

```text
register
login
logout
forgot password
reset password
password update
delete account
```

## Knowledge

```text
create valid
create invalid
update valid
update invalid
delete
restore
force delete
cross-user access denied
```

## Categories

```text
create
duplicate name rejected
update
delete
cross-user access denied
many-to-many sync
```

## Search

```text
title partial match
definition partial match
understanding partial match
insight partial match
case-insensitive
source excluded
url excluded
```

## Filter

```text
single category
multiple categories OR
uncategorized
category + uncategorized OR
cross-user category rejected
```

## Version History

```text
definition version 1 on create
definition new version every save
understanding version absent when empty
understanding version 1 on first save
subsequent understanding versions
```

## Insight

```text
create
update
delete
status recalculation
timestamp update
authorization
```

---

# 44. Feature Test Examples

Recommended test names:

```text
it('creates knowledge and definition version one')
it('creates understanding version one when initial understanding exists')
it('creates a new definition version on every save')
it('does not expose another users knowledge')
it('filters knowledge by multiple categories using OR semantics')
it('includes uncategorized knowledge in an OR filter')
it('moves knowledge to trash')
it('restores trashed knowledge')
it('force deletes a trashed knowledge')
it('recalculates knowledge status after insight deletion')
it('requires the current password to delete an account')
```

---

# 45. Backend Definition of Done

A backend feature is complete when:

- route exists
- middleware is correct
- Form Request exists when validation is non-trivial
- Policy authorization exists
- Action/Query exists where appropriate
- transaction is used for multi-write operations
- database constraints support the rule
- Inertia props are typed
- redirect/flash behavior is defined
- feature tests exist
- cross-user access test exists
- no raw SQL/user-controlled ordering is exposed
- logs do not leak credentials
- response matches frontend contract

---

# 46. Recommended Implementation Order

```text
1. Auth / starter kit
2. Users / profile
3. Knowledge migrations + model
4. Category migrations + model
5. Insight migrations + model
6. Version migrations + model
7. Policies
8. Knowledge create/update/delete/restore
9. Category CRUD
10. Insight CRUD
11. Search/filter/pagination
12. History endpoints
13. Dashboard queries
14. Trash
15. Profile/delete account
16. Feature tests
17. Browser tests
```

---

# 47. Post-MVP API Boundary

MVP deliberately does **not** expose a public REST API.

When native mobile, external integrations, or AI services require stable API contracts, introduce:

```text
/api/v1/...
```

with token authentication such as Laravel Sanctum.

Keep the current Inertia web routes separate from that future API.

---

# 48. Route Naming Summary

```text
home
dashboard

knowledge.index
knowledge.store
knowledge.show
knowledge.update
knowledge.destroy
knowledge.restore
knowledge.force-delete
knowledge.definition-history
knowledge.understanding-history
knowledge.insights.store

insights.update
insights.destroy

categories.index
categories.store
categories.update
categories.destroy

trash.index

profile.index
profile.update
password.update
profile.destroy
```

---

# 49. Backend Architecture Summary

```text
                 ┌──────────────────────┐
                 │      React 19        │
                 │      TypeScript      │
                 └──────────┬───────────┘
                            │
                         Inertia
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Laravel Routes     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     Controllers      │
                 └──────┬─────────┬─────┘
                        │         │
                 Form Requests  Policies
                        │         │
                        └────┬────┘
                             ▼
                    Actions / Queries
                             │
                             ▼
                       Eloquent ORM
                             │
                             ▼
                          MySQL
```

The architecture intentionally keeps the MVP server-driven, user-scoped, transaction-safe, and testable without introducing a separate API service or client-side global state layer.
