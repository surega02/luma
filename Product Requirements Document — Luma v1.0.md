# Product Requirements Document

## Luma v1.0

**Tagline:**  
**Learn. Capture. Grow.**

**Supporting statement:**  
**Capture what you learn. Build what you know.**

**Version:** 1.0  
**Platform:** Responsive Web Application  
**Primary Stack:** Laravel + Inertia.js + React + MySQL + Laravel Breeze + Tailwind CSS + Tiptap

---

# 1. Product Overview

## 1.1 Product Name

**Luma**

Luma adalah personal knowledge management application yang membantu user menangkap apa yang mereka pelajari, mengorganisasi knowledge, mencari kembali informasi, dan merefleksikan pemahaman mereka.

Core learning loop:

**Capture → Organize → Retrieve → Reflect**

---

# 2. Product Vision

Luma bertujuan menjadi ruang pribadi bagi user untuk mengubah informasi yang mereka temui menjadi knowledge yang terstruktur dan mudah digunakan kembali.

Luma tidak hanya berfungsi sebagai tempat menyimpan catatan, tetapi membantu user membangun personal knowledge base secara bertahap.

---

# 3. Problem Statement

User sering menemukan informasi dari berbagai sumber tetapi mengalami beberapa masalah:

- Informasi yang dipelajari tersebar di berbagai tempat.
- Catatan sulit ditemukan kembali.
- Informasi yang disimpan belum tentu benar-benar dipahami.
- Tidak ada struktur sederhana untuk menghubungkan proses belajar dengan refleksi.
- Catatan lama sering tersimpan tetapi jarang digunakan kembali.

Luma menyelesaikan masalah tersebut dengan workflow sederhana:

**Capture → Organize → Retrieve → Reflect**

---

# 4. Goals

## 4.1 MVP Goals

Luma MVP harus memungkinkan user untuk:

1. Membuat akun dan login.
2. Menyimpan knowledge dengan cepat.
3. Mengorganisasi knowledge menggunakan multiple category.
4. Mencari knowledge dengan cepat.
5. Memfilter dan mengurutkan knowledge.
6. Membuka dan mengedit knowledge.
7. Menambahkan insight sebagai proses refleksi.
8. Melihat riwayat perubahan Definition dan My Understanding.
9. Memindahkan knowledge ke Trash dan melakukan restore.
10. Melihat perkembangan knowledge melalui Dashboard.
11. Mengelola profile dan account.

## 4.2 Non-Goals MVP

Fitur berikut berada di luar scope MVP:

- AI assistant
- AI summarization
- AI-generated insight
- AI semantic search
- File/image attachment
- Public knowledge
- Share by Link / Unlisted Knowledge
- Dark mode
- Native Android/iOS application
- Notification/reminder

Fitur tersebut dapat dikembangkan pada fase Post-MVP.

---

# 5. Target User

Target utama adalah **individual learner** yang ingin menyimpan dan mengembangkan knowledge pribadi secara terstruktur.

Contoh use case:

- Software developer mempelajari teknologi baru.
- Student menyimpan materi pembelajaran.
- Professional mencatat konsep yang dipelajari.
- Self-learner menyimpan insight dari artikel, video, dokumentasi, atau pengalaman kerja.

---

# 6. User Access Model

## 6.1 Private by Default

Semua knowledge bersifat private.

Setiap user hanya dapat mengakses data miliknya sendiri:

- Knowledge
- Category
- Insight
- Version History
- Trash

## 6.2 Future Sharing

Post-MVP akan menyediakan:

**Unlisted / Share by Link**

Shared knowledge akan bersifat read-only dan dapat diakses menggunakan link.

---

# 7. Authentication

Authentication menggunakan **Laravel Breeze**.

## 7.1 Register

Required:

- Name
- Username
- Email
- Password
- Password Confirmation

Password:

- Minimum 8 karakter.

Email verification:

- Tidak diperlukan untuk MVP.

## 7.2 Login

User dapat login menggunakan:

- Email atau Username
- Password

## 7.3 Logout

User dapat logout dari aplikasi.

## 7.4 Forgot Password

User dapat melakukan reset password melalui email.

## 7.5 Profile

User dapat mengubah:

- Name
- Username
- Password

Email tidak dapat diubah melalui Profile.

Username harus unik.

## 7.6 Delete Account

User dapat menghapus account secara permanen.

Flow:

1. User memilih Delete Account.
2. Sistem menampilkan confirmation.
3. User memasukkan password.
4. Jika password valid, account dihapus.
5. Seluruh data user ikut dihapus.

---

# 8. Main Navigation

## Desktop

Fixed sidebar:

- Dashboard
- Knowledge
- Categories
- Trash
- Profile

Sidebar dapat:

- Expand
- Collapse

Saat collapsed, icon navigation tetap terlihat.

## Mobile

Menggunakan **bottom navigation**.

Navigasi tetap menyediakan akses utama ke:

- Dashboard
- Knowledge
- Categories
- Trash
- Profile

---

# 9. Global Quick Capture

Quick Capture tersedia secara global melalui header.

Dapat diakses dari:

- Dashboard
- Knowledge
- Categories
- Trash
- Profile

Quick Capture menggunakan **Modal**.

Pada mobile, modal tetap responsive dan menyesuaikan ukuran layar.

---

# 10. Knowledge

Knowledge adalah core entity dalam Luma.

## 10.1 Knowledge Fields

### Required

- Title
- Definition

### Optional

- My Understanding
- Category
- Source
- URL

Insight tidak dibuat dari Quick Capture dan ditambahkan setelah knowledge dibuat.

---

# 11. Quick Capture

Quick Capture digunakan untuk menyimpan knowledge dengan cepat.

## 11.1 Fields

- Title — required
- Definition — required
- My Understanding — optional
- Category — optional, multiple
- Source — optional
- URL — optional

Insight tidak tersedia pada Quick Capture.

## 11.2 Rich Text

Definition dan My Understanding menggunakan **Tiptap**.

Supported formatting:

- Bold
- Italic
- Bullet list
- Numbered list
- Link

## 11.3 Validation

Jika Title atau Definition kosong:

- Error ditampilkan pada field terkait.
- Modal tetap terbuka.
- Knowledge tidak disimpan.

## 11.4 Save

Setelah berhasil:

1. Knowledge dibuat.
2. Toast ditampilkan:

**“Knowledge created successfully.”**

3. User diarahkan ke Knowledge List.

## 11.5 Cancel

Jika user menutup Quick Capture:

- Modal langsung ditutup.
- Input yang belum disimpan dibuang.
- Tidak ada draft.
- Tidak ada auto-save.

---

# 12. Knowledge List

Knowledge List menggunakan **Card Layout**, bukan table.

## 12.1 Responsive Layout

Standard-sized cards.

Desktop:

- Beberapa card per row.

Tablet:

- Card menyesuaikan lebar.

Mobile:

- Card ditampilkan secara responsive dan mobile-friendly.

## 12.2 Card Content

Setiap card menampilkan:

- Title
- Definition snippet
- Category
- Status
- Created Date

Jika tidak memiliki category:

**Uncategorized**

## 12.3 Card Actions

Setiap card menyediakan:

- Open Detail
- Edit
- Delete

---

# 13. Knowledge Status

Status ditampilkan menggunakan:

**Icon + Text**

Status:

- Captured
- Understood
- Complete

Status bersifat sistem-generated berdasarkan kondisi knowledge.

> **Status transition rule:** implementasi v1.0 menggunakan state machine sederhana dan harus konsisten dengan kelengkapan `My Understanding` dan `Insight`.

Suggested state:

- **Captured** → knowledge sudah dibuat tetapi belum memiliki My Understanding.
- **Understood** → My Understanding tersedia tetapi belum memiliki Insight.
- **Complete** → My Understanding dan minimal satu Insight tersedia.

---

# 14. Knowledge Editing

Knowledge menggunakan **Quick Edit**.

Field yang dapat diedit bersama:

- Title
- Definition
- My Understanding
- Category
- Source
- URL

## 14.1 Save

Perubahan hanya disimpan saat user menekan:

**Save Changes**

Tidak menggunakan auto-save.

## 14.2 Cancel

Cancel membatalkan seluruh perubahan yang belum disimpan.

## 14.3 Unsaved Changes

Jika user mencoba meninggalkan halaman dengan perubahan yang belum disimpan:

Confirmation:

**“You have unsaved changes. Leave without saving?”**

Action:

- Leave
- Stay

---

# 15. Category

Satu Knowledge dapat memiliki **multiple Category**.

## 15.1 Category Fields

- Name
- Color
- Icon

## 15.2 Category Name

Category name:

- Harus unik dalam satu account.
- Duplicate category ditolak.

## 15.3 Category Creation

Category dapat dibuat dari:

- Categories page
- Category selector pada Knowledge form

Create Category menggunakan **Modal**.

Setelah category berhasil dibuat dari selector:

- Category langsung tersedia.
- User dapat langsung memilihnya untuk Knowledge.

## 15.4 Category Selector

Menggunakan:

**Searchable Multi-select**

Behavior:

- User dapat mencari category.
- User dapat memilih multiple category.
- Selected category ditampilkan sebagai chip/badge.
- Tersedia opsi **+ Create Category**.

---

# 16. Categories Page

Categories ditampilkan sebagai **List**, bukan card.

Setiap category menampilkan:

- Icon
- Color
- Name
- Knowledge count
- Edit
- Delete

## 16.1 Sorting

User dapat memilih:

- A–Z
- Newest
- Most Knowledge

## 16.2 Delete Category

Jika category masih digunakan:

Confirmation harus menampilkan jumlah knowledge yang terdampak.

Contoh:

**“This category is used by 12 knowledge items. Delete it?”**

Setelah dikonfirmasi:

- Category dihapus.
- Knowledge tidak dihapus.
- Category dilepas dari knowledge.
- Knowledge tanpa category menjadi `Uncategorized`.

---

# 17. Category Filter

Multiple category filter menggunakan **OR logic**.

Contoh:

User memilih:

- Programming
- AI

Maka hasil menampilkan knowledge yang memiliki:

- Programming
- AI
- Programming + AI

`Uncategorized` dapat dipilih bersamaan dengan category lain.

Contoh:

**Programming + AI + Uncategorized**

akan menampilkan knowledge yang:

- memiliki Programming, atau
- memiliki AI, atau
- tidak memiliki category.

---

# 18. Search

Search tersedia di Knowledge List.

## 18.1 Search Fields

Search mencakup:

- Title
- Definition
- My Understanding
- Insight

Search tidak mencakup:

- Source
- URL

## 18.2 Search Behavior

Search:

- Case-insensitive
- Partial match

Contoh:

Search:

`machine`

dapat menemukan:

`Machine Learning`

## 18.3 Search Trigger

Mendukung:

- Auto search saat mengetik
- Tombol Search

Search dapat digunakan bersama Category Filter.

---

# 19. Sorting

Knowledge List harus mendukung sorting sesuai kebutuhan user.

Minimum behavior:

- Default sorting mengikuti activity/updated state.
- Recently Updated harus memperhitungkan semua perubahan pada knowledge.

Perubahan yang memengaruhi `updated_at`:

- Title
- Definition
- My Understanding
- Category
- Source
- URL
- Add Insight
- Edit Insight
- Delete Insight

---

# 20. Pagination

Knowledge List menggunakan pagination.

Options:

- 10
- 20
- 50

Default:

**20 knowledge/page**

---

# 21. Knowledge Detail

Urutan informasi:

1. Title + Status
2. Definition
3. My Understanding
4. Insight
5. Category
6. Source & URL

## 21.1 Main Actions

- Back
- Edit / Quick Edit
- Delete

Version History tidak menjadi primary action di header.

---

# 22. Source & URL

Source dan URL bersifat independen.

User dapat mengisi:

- Source saja
- URL saja
- Keduanya
- Tidak keduanya

Tidak ada validasi URL khusus.

URL disimpan sebagai text.

System tidak mengecek apakah URL dapat diakses.

Pada Knowledge Detail:

- Source ditampilkan sebagai informasi biasa.
- URL ditampilkan hanya jika ada.
- URL ditampilkan sebagai clickable link dengan label:

**Open Source**

---

# 23. Insight

Insight hanya dibuat dari Knowledge Detail.

## 23.1 Add Insight

Flow:

1. User klik **+ Add Insight**
2. Editor terbuka.
3. User memasukkan Insight.
4. User memilih:
    - Save
    - Cancel

Tidak ada auto-save.

## 23.2 Edit Insight

Flow:

1. User klik Edit.
2. Insight masuk edit mode.
3. User melakukan perubahan.
4. User memilih:
    - Save
    - Cancel

Tidak ada auto-save.

## 23.3 Delete Insight

Insight dapat dihapus langsung.

Tidak ada confirmation.

Jika Insight terakhir dihapus:

**Complete → Understood**

Delete Insight juga memperbarui `updated_at` Knowledge.

---

# 24. Version History

Version History tersedia untuk:

- Definition
- My Understanding

History bersifat:

- Read-only
- Tidak memiliki diff
- Tidak memiliki restore

## 24.1 Access

Masing-masing field memiliki tombol:

**History**

Contoh:

Definition → History

My Understanding → History

## 24.2 History Information

Setiap version menampilkan:

- Version Number
- Date & Time
- Content

Tidak menampilkan user.

## 24.3 Definition History

Saat Knowledge dibuat:

**Definition = Version 1**

Setiap Save Changes akan menghasilkan version baru, termasuk ketika content Definition tidak berubah.

## 24.4 My Understanding History

Jika My Understanding kosong saat Knowledge dibuat:

- Belum ada history.

Saat pertama kali disimpan:

**Version 1**

Setiap Save Changes berikutnya menghasilkan version baru.

---

# 25. Trash

Trash menggunakan **Responsive Card Layout**, konsisten dengan Knowledge List.

Setiap card menampilkan:

- Title
- Definition snippet
- Deleted Date
- Restore
- Permanently Delete

## 25.1 Sorting

Default:

**Deleted Date terbaru → paling lama**

## 25.2 Delete to Trash

Delete Knowledge dari Knowledge List atau Detail:

- Knowledge tidak langsung dihapus permanen.
- Knowledge masuk Trash.

Delete menggunakan confirmation.

## 25.3 Restore

Restore mengembalikan Knowledge ke Knowledge List.

Jika category yang sebelumnya digunakan sudah dihapus:

- Category tersebut tidak dibuat kembali.
- Knowledge tetap di-restore.
- Jika tidak memiliki category lain → Uncategorized.

## 25.4 Permanent Delete

Permanent Delete menghapus Knowledge secara permanen.

Action menggunakan confirmation.

---

# 26. Shared Knowledge — Post-MVP

Fitur sharing bukan bagian MVP tetapi requirement dasarnya sudah ditentukan.

Model:

**Unlisted / Share by Link**

Behavior:

- Default private.
- Shared knowledge read-only.
- Semua isi Knowledge dapat dilihat.
- Tidak muncul di public search.
- Owner dapat Disable Sharing.
- Shared page menampilkan perubahan terbaru secara otomatis.
- Jika Knowledge masuk Trash → shared link tidak dapat diakses.
- Jika Knowledge di-restore dan sharing tetap aktif → link dapat digunakan kembali.

---

# 27. Dashboard

Dashboard menggunakan konsep:

**Learning Overview**

Dashboard terdiri dari:

## 27.1 Learning Progress

Menampilkan:

- Total Knowledge
- Captured
- Understood
- Complete

## 27.2 Knowledge Growth

Grafik:

**30 hari terakhir**

Menampilkan dua metrik:

- Knowledge Created per Day
- Cumulative Knowledge

## 27.3 Recent Learning

Menampilkan:

- 5 Knowledge terbaru
- 5 Insight terbaru

## 27.4 Top Categories

Category paling aktif ditentukan berdasarkan:

**jumlah Knowledge**

---

# 28. Empty States

## 28.1 No Knowledge

Menampilkan:

> **Belum ada knowledge.**  
> Mulai catat apa yang kamu pelajari hari ini.

Dengan button:

**+ Quick Capture**

## 28.2 Search Empty State

Jika search tidak menemukan hasil:

> **Knowledge tidak ditemukan.**

## 28.3 Filter Empty State

Jika filter tidak menghasilkan data:

> **No knowledge found for the selected filter.**

---

# 29. Landing Page

Landing Page ditujukan kepada guest.

## Hero

Headline:

**Learn. Capture. Grow.**

Supporting statement:

**Capture what you learn. Build what you know.**

Supporting description:

Luma helps you capture what you learn, organize your knowledge, reflect on your understanding, and turn scattered information into knowledge that grows with you.

CTA:

- Get Started
- Login

## How It Works

Workflow:

**Capture → Organize → Retrieve → Reflect**

## Key Features

- Quick Capture
- Knowledge Management
- Categories
- Insights
- Learning Dashboard

## Product Preview

Menampilkan preview visual Knowledge Card.

---

# 30. Guest Access

Guest dapat mengakses:

- Landing Page
- Login
- Register

Guest tidak dapat mengakses:

- Dashboard
- Knowledge
- Categories
- Trash
- Profile

Shared Knowledge guest access tersedia pada Post-MVP setelah Share by Link diimplementasikan.

---

# 31. UI / Design System

## Theme

MVP hanya menggunakan:

**Light Mode**

Dark mode adalah Post-MVP.

## UI Principles

- Clean
- Minimal
- Learning-oriented
- Content-first
- Responsive
- Mobile-friendly

## Knowledge

Card-based.

## Categories

List-based.

## Trash

Card-based.

---

# 32. Responsive Requirements

Luma harus berfungsi pada:

- Desktop
- Tablet
- Mobile

Tidak boleh ada horizontal overflow untuk workflow utama.

Component harus menyesuaikan:

- Card width
- Typography
- Modal width
- Navigation
- Form layout

---

# 33. Feedback System

Semua successful action menggunakan toast.

Contoh:

- Knowledge created successfully.
- Knowledge updated successfully.
- Knowledge deleted successfully.
- Knowledge restored successfully.
- Category created successfully.
- Category updated successfully.
- Category deleted successfully.
- Insight added successfully.
- Insight updated successfully.
- Insight deleted successfully.
- Profile updated successfully.
- Password changed successfully.

## Toast Position

Desktop:

**Bottom-right**

Tablet/Mobile:

**Bottom-center**

Toast:

- Temporary
- Auto-dismiss
- Dapat ditutup manual

---

# 34. Error Handling

## Validation Error

Error ditampilkan langsung pada field.

## Server / Network Error

Gunakan toast error.

Contoh:

> **Something went wrong. Please try again.**

Jangan menampilkan:

- SQL error
- Stack trace
- Internal exception detail

kepada user.

---

# 35. Loading State

Tidak menggunakan global blocking spinner.

## Form / Action

Gunakan button state:

- Saving...
- Deleting...
- Restoring...
- Updating...

Button yang sedang diproses disabled untuk mencegah duplicate request.

## Page / Data Loading

Gunakan:

**Skeleton Loading**

untuk:

- Knowledge List
- Dashboard
- Category List jika diperlukan

---

# 36. Data Ownership & Security

Setiap query data harus dibatasi berdasarkan authenticated user.

Contoh konsep:

`user_id = authenticated_user_id`

User tidak boleh:

- Membaca knowledge user lain.
- Mengedit knowledge user lain.
- Menghapus knowledge user lain.
- Mengakses category user lain.
- Mengakses insight user lain.
- Mengakses history user lain.

Authorization harus diterapkan di backend, bukan hanya frontend.

---

# 37. Core Entities

MVP minimal membutuhkan entity:

## User

Data authentication dan profile.

## Knowledge

Core learning record.

## Category

Custom category milik user.

## Knowledge Category

Pivot relation untuk many-to-many.

## Insight

Insight yang terkait dengan Knowledge.

## Definition Version

Version history Definition.

## My Understanding Version

Version history My Understanding.

---

# 38. Suggested Database Structure

## users

- id
- name
- username
- email
- password
- created_at
- updated_at

## knowledges

- id
- user_id
- title
- definition
- my_understanding
- source
- url
- status
- created_at
- updated_at
- deleted_at

## categories

- id
- user_id
- name
- color
- icon
- created_at
- updated_at

## category_knowledge

- knowledge_id
- category_id

## insights

- id
- knowledge_id
- content
- created_at
- updated_at

## definition_versions

- id
- knowledge_id
- version
- content
- created_at

## understanding_versions

- id
- knowledge_id
- version
- content
- created_at

---

# 39. Soft Delete

Knowledge menggunakan:

**Soft Delete**

ketika user melakukan Delete.

Field:

`deleted_at`

Behavior:

- Active Knowledge → normal Knowledge List.
- Deleted Knowledge → Trash.
- Restore → `deleted_at = null`
- Permanent Delete → hard delete.

---

# 40. Technology Requirements

## Backend

- Laravel
- Laravel Breeze
- Eloquent ORM
- MySQL

## Frontend

- React
- Inertia.js
- Tailwind CSS
- Tiptap

## Architecture

Laravel menangani:

- Authentication
- Authorization
- Business Logic
- Database
- Validation

React menangani:

- UI
- Form interaction
- Responsive components
- Client-side interaction

Inertia menjadi bridge antara Laravel dan React.

---

# 41. Core User Flows

## 41.1 Register

Register → Login → Dashboard

## 41.2 Capture Knowledge

Dashboard / any page → Quick Capture → Fill Form → Save → Knowledge List

## 41.3 Complete Knowledge

Knowledge List → Knowledge Detail → Edit My Understanding → Add Insight → Complete

## 41.4 Search

Knowledge → Search keyword → Filter results → Open Knowledge

## 41.5 Category Management

Categories → Create Category → Modal → Save → Category List

## 41.6 Delete Knowledge

Knowledge → Delete → Confirmation → Trash

## 41.7 Restore Knowledge

Trash → Restore → Knowledge List

## 41.8 Delete Account

Profile → Delete Account → Confirmation → Password → Permanent Account Deletion

---

# 42. Functional Requirements

## FR-001 Authentication

System must support registration, login, logout, forgot password, and reset password.

## FR-002 Profile

System must allow user to update Name, Username, and Password.

## FR-003 Knowledge Creation

System must allow user to create Knowledge through Quick Capture.

## FR-004 Knowledge Editing

System must allow user to edit existing Knowledge.

## FR-005 Knowledge Deletion

System must move deleted Knowledge to Trash.

## FR-006 Knowledge Restore

System must restore Knowledge from Trash.

## FR-007 Category Management

System must support create, read, update, and delete Category.

## FR-008 Multiple Category

System must support many-to-many Knowledge → Category.

## FR-009 Search

System must search Title, Definition, My Understanding, and Insight using case-insensitive partial matching.

## FR-010 Filter

System must support multiple Category selection using OR logic.

## FR-011 Insight

System must support Add/Edit/Delete Insight.

## FR-012 Version History

System must maintain Definition and My Understanding history according to versioning rules.

## FR-013 Dashboard

System must display learning metrics and knowledge growth.

## FR-014 Responsive UI

System must work on desktop, tablet, and mobile.

---

# 43. Non-Functional Requirements

## Performance

Primary pages should load efficiently and avoid unnecessary full-page reloads.

## Security

- Password hashing
- Authentication
- Authorization
- CSRF protection
- Input validation
- User-level data isolation

## Usability

Core action:

**Quick Capture**

should be accessible with minimal navigation.

## Accessibility

Interface should support:

- Keyboard navigation
- Form labels
- Accessible buttons
- Sufficient contrast
- Semantic HTML where appropriate

---

# 44. MVP Acceptance Criteria

MVP dianggap siap ketika:

### Authentication

- User dapat Register.
- User dapat Login.
- User dapat Logout.
- User dapat Forgot/Reset Password.
- User dapat mengubah Profile.
- User dapat Delete Account.

### Knowledge

- User dapat Create Knowledge.
- User dapat Edit Knowledge.
- User dapat Delete Knowledge.
- User dapat Restore Knowledge.
- User dapat Permanently Delete Knowledge.

### Category

- User dapat Create Category.
- User dapat Edit Category.
- User dapat Delete Category.
- User dapat memilih multiple category.

### Search & Filter

- Search bekerja dengan partial matching.
- Search case-insensitive.
- Category filter menggunakan OR.
- Uncategorized dapat difilter.
- Pagination 10/20/50 bekerja.

### Insight

- Add Insight bekerja.
- Edit Insight bekerja.
- Delete Insight bekerja.
- Status berubah sesuai state knowledge.

### History

- Definition Version History bekerja.
- My Understanding Version History bekerja.
- Version numbering sesuai requirement.

### Dashboard

- Statistics muncul.
- Growth chart 30 hari muncul.
- Recent Knowledge muncul.
- Recent Insight muncul.
- Top Categories muncul.

### Responsive

- Desktop layout bekerja.
- Tablet layout bekerja.
- Mobile layout bekerja.
- Bottom navigation bekerja pada mobile.
- Sidebar collapse/expand bekerja pada desktop.

---

# 45. Post-MVP Roadmap

## Phase 2 — AI

Potential capabilities:

- AI summary
- AI-generated understanding
- AI-generated insight suggestions
- Related Knowledge
- Semantic Search
- AI Knowledge Assistant

## Phase 3 — Sharing

- Unlisted Knowledge
- Share by Link
- Read-only shared page
- Disable Sharing

## Phase 4 — Content Expansion

- Image attachment
- File attachment
- Rich media

## Phase 5 — Personalization

- Dark Mode
- System Theme
- Learning reminders
- Notification

## Phase 6 — Platform Expansion

- PWA
- Native Android
- Native iOS

---

# 46. Product Principles

Luma mengikuti prinsip:

### 1. Capture First

User harus dapat menyimpan sesuatu dengan cepat tanpa harus langsung membuat catatan sempurna.

### 2. Understand Later

My Understanding dapat dilengkapi setelah knowledge dibuat.

### 3. Reflect Through Insight

Insight digunakan sebagai tahap refleksi untuk mengubah informasi menjadi pemahaman yang lebih personal.

### 4. Organize Simply

Category menyediakan struktur tanpa memaksa user menggunakan sistem tagging yang kompleks.

### 5. Retrieve Easily

Search, filter, sorting, dan dashboard membantu user menemukan kembali knowledge.

### 6. Grow Over Time

Dashboard menunjukkan perkembangan knowledge sehingga user dapat melihat pertumbuhan learning base mereka.

---

# 47. Product Scope Summary

### MVP

**Authentication**

- Register
- Login
- Logout
- Forgot Password
- Reset Password
- Profile
- Delete Account

**Knowledge**

- Quick Capture
- CRUD
- Card List
- Detail
- Status
- Search
- Filter
- Sorting
- Pagination
- Insight
- Version History
- Trash
- Restore

**Category**

- CRUD
- Multiple Category
- Searchable Multi-select
- Category Filter

**Dashboard**

- Progress
- Growth
- Recent Knowledge
- Recent Insight
- Top Categories

**UI**

- Responsive
- Desktop Sidebar
- Mobile Bottom Navigation
- Light Mode
- Toast
- Skeleton Loading
- Field Validation

### Post-MVP

- AI
- Share by Link
- Attachments
- Dark Mode
- Notification
- Mobile Native App

---

# 48. MVP Success Definition

Luma MVP berhasil apabila seorang user dapat melakukan siklus berikut tanpa hambatan berarti:

**Create account → Capture knowledge → Organize with category → Find knowledge → Understand it → Add insight → See learning progress**

Core success metric MVP:

**User successfully creates and completes knowledge entries through the learning loop.**

---

# 49. Open Decisions / Implementation Notes

Beberapa detail implementasi dapat ditentukan pada tahap technical design tanpa mengubah product scope:

- Detail visual status icon.
- Pilihan icon/color yang tersedia untuk Category.
- Exact breakpoint responsive.
- Exact chart library.
- Exact toast library.
- Exact component architecture.
- Database indexing strategy.
- API/request architecture internal Laravel + Inertia.

Keputusan tersebut tidak mengubah core behavior yang telah disepakati dalam PRD v1.0.

---

# 50. Final MVP Concept

**Luma adalah personal knowledge workspace yang membantu user:**

> **Learn. Capture. Grow.**

Dengan pendekatan:

> **Capture what you learn. Build what you know.**

Core experience:

**Capture → Organize → Retrieve → Reflect → Grow**

MVP berfokus pada membangun workflow knowledge yang solid terlebih dahulu sebelum menambahkan AI dan fitur advanced lainnya.
