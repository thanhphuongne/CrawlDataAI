# CrawlDataAI - UI Design Spec (All Screens)

## 1. Muc tieu tai lieu
Tai lieu nay mo ta chi tiet thiet ke UI/UX cho toan bo man hinh cua he thong crawl trong code hien tai, bao gom:
- Cac man hinh dang su dung trong luong chinh.
- Cac man hinh da ton tai trong code nhung chua gan vao luong AppFlow.
- Quy tac nhat quan ve layout, state, hanh vi, validation, responsive va accessibility.

Pham vi dua tren frontend React/Next trong thu muc `frontend-react/src/components`.

## 2. Tong quan he thong man hinh

### 2.1. Nhom man hinh dang active trong luong AppFlow
- Landing
- Register
- Verify OTP
- Login
- Forgot Password
- Chat
- My Crawls
- Crawl Detail
- Settings
- Shared layout: AppSidebar + Navbar

### 2.2. Nhom man hinh da co trong code (planned/legacy)
- Dashboard
- New Crawl - Step 1
- New Crawl - Step 2
- Crawl Progress
- Exports

## 3. Nguyen tac thiet ke UI

### 3.1. Nguyen tac cot loi
- Don gian, uu tien thao tac nhanh cho user crawl data.
- Luong chat la trung tam cua trai nghiem.
- Moi trang deu co duong thoat ro rang (Back, Cancel, Navigate).
- Trang thai he thong phai nhin thay duoc: loading, processing, success, error.

### 3.2. He thong visual
- Style chinh: clean dashboard + card-based UI.
- Mau nen: gradient nhe o cac trang auth/public.
- Mau nhan trang thai:
  - Success: xanh la
  - Running/Processing: xanh duong
  - Failed/Error: do
- Thanh phan chu dao: Card, Table, Input, Button, Badge, Progress, Tabs, Dropdown.

### 3.3. Typography va spacing
- Heading cap 1: ten trang ro rang, ngan gon.
- Subtext: mo ta muc dich trang ngay duoi heading.
- Khoang cach uu tien theo block 16/24/32 px.

### 3.4. Accessibility
- Tat ca input can co label ro rang.
- Button can co trang thai disabled va visual phan biet.
- Contrast mau dat muc de doc o che do sang/toi.
- Keyboard flow:
  - Enter submit o auth/chat input.
  - Co the tab qua cac control chinh.

## 4. Luong nguoi dung chinh

### 4.1. Luong onboarding
Landing -> Register -> Verify OTP -> Chat

### 4.2. Luong login
Landing -> Login -> Chat

### 4.3. Luong crawl
Chat -> Tao crawl request -> Theo doi ket qua trong chat -> View Crawl Detail

### 4.4. Luong quan ly lich su
My Crawls -> View Crawl Detail -> Export

### 4.5. Luong cai dat tai khoan
Settings -> Profile/Security/API Key/Danger Zone

## 5. Screen catalog (chi tiet tung man hinh)

---

## 5.1. Landing Page
File: `frontend-react/src/components/LandingPage.tsx`

### Muc tieu
- Gioi thieu gia tri san pham crawl bang AI.
- Dieu huong vao Login hoac Register.

### Cac khu vuc UI
- Hero card 2 cot:
  - Cot trai: logo, headline, description, CTA.
  - Cot phai: hero image + 3 feature highlights.
- Stats block: Crawls, Users, Uptime.

### CTA
- User chua login: Start -> Login, Sign Up -> Register.
- User da login: Go to Dashboard (thuc te co the map ve Chat).

### Responsive
- Mobile: card chuyen 1 cot, CTA xep doc.

### State
- Khong co loading phuc tap.

---

## 5.2. Register Page
File: `frontend-react/src/components/RegisterPage.tsx`

### Muc tieu
- Tao tai khoan moi de vao he thong crawl.

### Form fields
- Name (optional)
- Email (required)
- Password (required)
- Confirm Password (required)

### Validation
- Bat buoc email + password.
- Password va confirm phai trung.
- Password strength >= medium (>= 50 theo logic hien tai).

### Feedback UI
- Progress bar do manh password + text Weak/Medium/Strong.
- Toast khi loi validate.

### Dieu huong
- Submit thanh cong -> Verify OTP.
- Link duoi form -> Login.

---

## 5.3. Verify OTP Page
File: `frontend-react/src/components/VerifyOTPPage.tsx`

### Muc tieu
- Xac minh email sau dang ky.

### UI block
- Card trung tam.
- Input OTP 6 so, can giua, letter spacing lon.
- Nhom action: Verify, Resend, Back to Registration.

### Validation
- OTP phai du 6 chu so.

### States
- isLoading khi verify.
- isResending khi gui lai ma.
- Error toast neu OTP sai/het han.

### UX note
- Man hinh nay dang dung inline style rieng, can thong nhat voi design system (Card/Input/Button cua UI kit).

---

## 5.4. Login Page
File: `frontend-react/src/components/LoginPage.tsx`

### Muc tieu
- Dang nhap tai khoan.

### Form fields
- Email
- Password

### Actions
- Login
- Forgot password
- Link den Sign up

### Validation
- Bat buoc nhap du field.

### Post-login
- Thanh cong -> Chat page.

---

## 5.5. Forgot Password Page
File: `frontend-react/src/components/ForgotPasswordPage.tsx`

### Muc tieu
- Khoi tao quy trinh dat lai mat khau.

### UI states
- Truoc khi gui:
  - Form email + button Send Reset Link.
- Sau khi gui:
  - Success state voi icon Mail + thong bao da gui.
  - Button Back to Login.

### Validation
- Email khong duoc rong.

---

## 5.6. Chat Page (Core Screen)
File: `frontend-react/src/components/ChatPage.tsx`

### Muc tieu
- Trung tam tao va theo doi crawl qua hoi thoai AI.

### Layout
- Header:
  - Ten AI Crawl Assistant
  - Trang thai ket noi realtime (Connected/Disconnected)
- Message area (scrollable):
  - Bong chat user ben phai, AI ben trai.
  - AI message co the kem crawl data card.
- Input area:
  - Text input + send button.
  - Warning bar neu mat ket noi.

### Crawl data card trong message AI
- Badge status: pending/crawling/completed/failed.
- Progress bar phan tram xu ly.
- JSON preview.
- Actions:
  - Copy JSON
  - Export dropdown (JSON/CSV/PDF)
  - View Details (neu co crawlId)

### Suggestion prompts
- Hien khi moi co message welcome.
- 4 card mau (e-commerce, jobs, news, real-estate).

### Realtime behavior
- Dung websocket hook de:
  - Nhan chat_response
  - Nhan data_request_proposal
  - Nhan conversation_history
- Co fallback khi khong ket noi.

### Trang thai quan trong
- isProcessing: hien loading bubble "AI is analyzing..."
- isConnected: disable input va send khi disconnected.

---

## 5.7. My Crawls Page
File: `frontend-react/src/components/MyCrawlsPage.tsx`

### Muc tieu
- Xem lich su crawl va truy cap nhanh vao chi tiet.

### Layout
- Header + subtitle.
- 4 stat cards:
  - Total Crawls
  - Completed
  - Running
  - Total Items
- Card Crawl History:
  - Search bar
  - Table columns: URL, Task, Status, Items, Date, Action

### Empty states
- Khong co du lieu: icon + CTA "Go to Chat".
- Co search nhung khong match: thong bao "Try a different search term".

### Data
- Lay danh sach tu requestAPI.getRequests().

---

## 5.8. Crawl Detail Page
File: `frontend-react/src/components/CrawlDetailPage.tsx`

### Muc tieu
- Hien chi tiet ket qua 1 crawl.

### Header
- Tieu de Crawl Details + URL.
- Nhom export dropdown (JSON/CSV/PDF).

### KPI cards
- Duration
- Items Found
- Status

### Tabs
- Data Table
- Raw JSON
- Chat History

### Data Table tab
- Search input.
- Bang du lieu trich xuat.

### Raw JSON tab
- Khung pre scrollable de xem JSON thuan.

### Chat History tab
- Hoi thoai user/AI + input hoi tiep.

### States can bo sung
- Loading skeleton khi fetch detail.
- Error state co retry.

### Luu y ky thuat
- Can sua logic data binding (hien co cho dung mockData trong 1 so cho).

---

## 5.9. Settings Page
File: `frontend-react/src/components/SettingsPage.tsx`

### Muc tieu
- Quan ly tai khoan va bao mat.

### Tabs
- Profile
- Security
- API Access
- Danger Zone

### Profile tab
- Avatar fallback tu initials.
- Form name/email.

### Security tab
- Doi mat khau (current/new/confirm).
- Validation:
  - New = Confirm
  - Do dai toi thieu 8

### API Access tab
- Hien API key + copy button.
- Block example curl usage.

### Danger Zone tab
- Delete account trong Alert Dialog confirm.

### UX note
- Can tranh hardcode API key tren UI.

---

## 5.10. Shared Layout - Sidebar
File: `frontend-react/src/components/AppSidebar.tsx`

### Muc tieu
- Dieu huong nhanh trong khu vuc da dang nhap.

### Menu
- AI Chat
- My Crawls
- Settings

### Footer actions
- Toggle Dark/Light theme
- Logout

---

## 5.11. Shared Layout - Navbar
File: `frontend-react/src/components/Navbar.tsx`

### Muc tieu
- Thanh dieu huong tren cung.

### Thanh phan
- Brand mini.
- Notification icon.
- Avatar dropdown:
  - Profile & Settings
  - Logout

---

## 5.12. Dashboard Page (planned/legacy)
File: `frontend-react/src/components/DashboardPage.tsx`

### Muc tieu
- Tong quan KPI + chat assistant trong mot man hinh.

### Thanh phan
- AI chat card.
- 4 stat cards.
- Bang recent crawls.
- CTA New Crawl.

### Tinh trang
- Da co code, nhung chua duoc map vao AppFlow hien tai.

---

## 5.13. New Crawl - Step 1 (planned)
File: `frontend-react/src/components/NewCrawlStep1.tsx`

### Muc tieu
- Nhap URL muc tieu crawl.

### Thanh phan
- URL input
- Tips box
- Actions: Cancel, Next

### Validation
- URL bat buoc va dung dinh dang.

---

## 5.14. New Crawl - Step 2 (planned)
File: `frontend-react/src/components/NewCrawlStep2.tsx`

### Muc tieu
- Nhap prompt huong dan AI extraction.

### Thanh phan
- Template select (ecommerce/news/jobs/custom)
- Prompt textarea
- Prompt examples
- Actions: Back, Start Crawl

### Validation
- Prompt khong duoc rong.

---

## 5.15. Crawl Progress Page (planned)
File: `frontend-react/src/components/CrawlProgressPage.tsx`

### Muc tieu
- Theo doi realtime tien trinh crawl + chat giua qua trinh.

### Layout
- Progress summary card + cancel/complete action.
- 2 cot:
  - Live log (timeline)
  - AI chat support

### States
- Dang crawl: progress tang dan + log update.
- Hoan tat: cho phep view result.

---

## 5.16. Exports Page (planned)
File: `frontend-react/src/components/ExportsPage.tsx`

### Muc tieu
- Quan ly lich su file export.

### UI
- Bang export list: Crawl Name, Format, Date, Size, Action.
- Empty state ro rang khi chua co export.

---

## 6. Mapping API va backend impact

## 6.1. Endpoint phu hop voi backend Java hien tai
- `/api/auth/register`
- `/api/auth/login`
- `/api/requests` (GET/POST)

## 6.2. Endpoint FE dang dung nhung backend Java chua day du
- OTP flow: verify-otp, resend-otp
- Dialog/data/export APIs
- User profile/password/delete APIs

## 6.3. Realtime
- FE hien co su dung Socket.IO o 1 so man hinh.
- Backend Java dang mo hinh STOMP/SockJS (`/ws`).
- Can thong nhat 1 protocol de UI hoat dong on dinh.

## 7. Responsive spec

### Breakpoint de xuat
- Mobile: < 768
- Tablet: 768 - 1023
- Desktop: >= 1024

### Quy tac responsive
- Auth pages: card full width tren mobile, max-width 400-480 px.
- Table pages:
  - Mobile: uu tien card list hoac table horizontal scroll.
  - Desktop: table day du cot.
- Chat:
  - Input sticky duoi.
  - Message width toi da 85%.

## 8. UI States checklist (ap dung cho tat ca man hinh)

Moi man hinh can co it nhat:
- Loading state
- Empty state
- Error state
- Success feedback (toast/inline)
- Disabled state cho button khi submit dang chay

## 9. Content va microcopy guideline

- Ngan gon, huong hanh dong.
- Neu loi: noi ro can sua gi, khong chi noi "failed".
- Vi du:
  - Tot: "Please include a full URL starting with https://"
  - Khong tot: "Invalid input"

## 10. De xuat uu tien trien khai UI (roadmap)

### Phase 1 - MVP crawl end-to-end
- Landing, Register/Login, Chat, My Crawls, Crawl Detail
- Sidebar + Navbar
- Basic Settings (Profile)

### Phase 2 - Stability
- Hoan chinh loading/empty/error tat ca man hinh
- Dong bo design token va style OTP page
- Chuan hoa API contract

### Phase 3 - Advanced flow
- New Crawl 2-step wizard
- Crawl Progress realtime
- Exports management page
- Dashboard tong quan

## 11. Acceptance criteria theo man hinh

### Chat
- Gui message thanh cong bang Enter hoac nut Send.
- Co visual processing khi AI tra loi.
- Co the mo Crawl Detail tu ket qua.

### My Crawls
- Search loc theo URL/task.
- Click View vao dung crawl detail.

### Crawl Detail
- Tab Data/JSON/Chat hoat dong.
- Export dropdown hoat dong.

### Settings
- Doi profile/password co validation.
- Delete account co confirm dialog.

## 12. Danh sach file tham chieu
- `frontend-react/src/components/AppFlow.tsx`
- `frontend-react/src/components/LandingPage.tsx`
- `frontend-react/src/components/RegisterPage.tsx`
- `frontend-react/src/components/VerifyOTPPage.tsx`
- `frontend-react/src/components/LoginPage.tsx`
- `frontend-react/src/components/ForgotPasswordPage.tsx`
- `frontend-react/src/components/ChatPage.tsx`
- `frontend-react/src/components/MyCrawlsPage.tsx`
- `frontend-react/src/components/CrawlDetailPage.tsx`
- `frontend-react/src/components/SettingsPage.tsx`
- `frontend-react/src/components/AppSidebar.tsx`
- `frontend-react/src/components/Navbar.tsx`
- `frontend-react/src/components/DashboardPage.tsx`
- `frontend-react/src/components/NewCrawlStep1.tsx`
- `frontend-react/src/components/NewCrawlStep2.tsx`
- `frontend-react/src/components/CrawlProgressPage.tsx`
- `frontend-react/src/components/ExportsPage.tsx`

---

Neu ban muon, buoc tiep theo minh co the tao them:
- 1 file wireframe text (ASCII) cho tung man hinh.
- 1 file checklist handoff cho designer -> frontend dev -> backend dev.
- 1 file map trang thai API cho tung button/action tren moi screen.

---

## 13. Additional Screens — Complete Inventory

Dưới đây là các màn bổ sung, mỗi màn được định nghĩa ngắn gọn (mục tiêu, thành phần UI, API/realtime, trạng thái, acceptance).

- **Onboarding / First-run** (`frontend-react/src/components/Onboarding.tsx`):
  - Mục tiêu: Hướng dẫn người mới sử dụng, tạo crawl mẫu, tạo API key.
  - Thành phần: Wizard 3 bước, CTA "Create first crawl".
  - API: `POST /api/auth/verify-onboarding` (tùy chọn), `POST /api/requests` để tạo demo.
  - Trạng thái: skip/complete flag, link tới Chat khi xong.

- **Import Data** (`frontend-react/src/components/ImportDataPage.tsx`):
  - Mục tiêu: Upload CSV/JSON để seed hoặc bổ sung dataset.
  - Thành phần: File picker, column mapping UI, preview table, validation errors.
  - API: `POST /api/data/import` (multipart/form-data), `GET /api/data/import/preview`.
  - Acceptance: File up to configured limit, preview hiển thị 10 dòng, mapping lưu được.

- **Team / Users (Admin)** (`frontend-react/src/components/TeamPage.tsx`):
  - Mục tiêu: Quản lý người dùng trong team, vai trò (admin/editor/viewer).
  - Thành phần: Table users, Invite modal (email + role), role dropdown, deactivate action.
  - API: `GET/POST/PUT/DELETE /api/admin/users`.
  - States: Invite-sent, Pending, Active, Disabled.

- **Admin / System Dashboard** (`frontend-react/src/components/AdminDashboard.tsx`):
  - Mục tiêu: Health & infra view cho admin (DB, workers, queues).
  - Thành phần: Health badges, queue lengths, worker list, recent errors feed.
  - API: `GET /api/admin/status`, `GET /api/admin/workers`, `GET /api/admin/queues`.
  - Acceptance: Health green/yellow/red, refresh interval 30s, manual restart worker button (admin-only).

- **Integrations** (`frontend-react/src/components/IntegrationsPage.tsx`):
  - Mục tiêu: Cấu hình S3, Google Sheets, Webhooks, Slack, 기타.
  - Thành phần: List integrations, Configure modal, Test connection button.
  - API: `GET/POST/PUT /api/integrations`, webhook test endpoint.
  - Acceptance: Test connection hiển thị success/failure, secrets masked.

- **Notifications / Activity Feed** (`frontend-react/src/components/Notifications.tsx`):
  - Mục tiêu: Gửi và hiển thị thông báo (job finished, export ready, errors).
  - Thành phần: Bell icon + dropdown, full feed page, mark-as-read.
  - Realtime: event `notification` (websocket).
  - API: `GET /api/notifications`, `POST /api/notifications/mark-read`.

- **Activity / Audit Log** (`frontend-react/src/components/AuditLog.tsx`):
  - Mục tiêu: Lưu audit cho hành động user và hệ thống.
  - Thành phần: Table with filters (user, action, date), export.
  - API: `GET /api/audit` with filters.
  - Security: Admin-only access.

- **Error & Empty States (library)**:
  - Mục tiêu: Tập hợp các pattern reusable cho 404, 500, empty lists, no-results.
  - Thành phần: Icon, headline, description, primary CTA, secondary help link.
  - Acceptance: Mỗi page phải implement ít nhất 1 empty state và 1 error state.

- **On-demand Runner / Manual Job Trigger** (`frontend-react/src/components/ManualRun.tsx`):
  - Mục tiêu: Cho phép chạy thủ công một URL hoặc dry-run để kiểm tra selector/prompt.
  - Thành phần: URL input, mode select (dry-run/full), result preview.
  - API: `POST /api/requests/trigger`, realtime progress events.

- **Worker / Queue Details** (`frontend-react/src/components/WorkersPage.tsx`):
  - Mục tiêu: Theo dõi worker processes, queue backlog, restart/scale controls.
  - Thành phần: Worker list, metrics, action buttons (restart, drain).
  - API: `GET /api/admin/workers`, `POST /api/admin/workers/:id/restart`.

- **Analytics Page** (`frontend-react/src/components/AnalyticsPage.tsx`):
  - Mục tiêu: Biểu đồ items over time, crawl throughput, error rates, SLA metrics.
  - Thành phần: Time-range selector, series charts, export charts.
  - API: `GET /api/metrics?range=...`.

- **Data Retention / Purge** (`frontend-react/src/components/DataRetention.tsx`):
  - Mục tiêu: Cấu hình chính sách lưu trữ dữ liệu (TTL, auto-purge).
  - Thành phần: Policy editor, preview impact estimation, confirm modal.
  - API: `GET/PUT /api/admin/retention`, `POST /api/admin/retention/preview`.

- **Webhooks / Callback Management** (`frontend-react/src/components/Webhooks.tsx`):
  - Mục tiêu: Thêm/sửa/xóa webhook, test delivery, view attempts.
  - Thành phần: List + Add modal, test delivery button, webhook attempt log.
  - API: `GET/POST/DELETE /api/webhooks`, `POST /api/webhooks/:id/test`.

- **Help / Docs / API Docs** (`frontend-react/src/components/HelpDocs.tsx`):
  - Mục tiêu: Tài liệu nhanh, ví dụ curl, FAQ, contact support.
  - Thành phần: Searchable docs, code samples, copy-to-clipboard.

### Acceptance criteria cho mục bổ sung
- Mỗi màn có mô tả mục tiêu, ít nhất 1 API endpoint mapping, và 2 trạng thái (empty + error).
- Admin-only màn cần kiểm tra role trước khi hiển thị action.
- Realtime pages (Crawl Progress, Notifications, Workers) có fallback polling nếu websocket không khả dụng.

--- 

Nếu bạn đồng ý, tôi sẽ:
- chèn wireframe text (ASCII) cho 3 màn ưu tiên: `Chat`, `New Crawl Step 2`, `Crawl Detail`.
- tạo file `docs/api-action-matrix.md` với mapping UI action → endpoint (với trường input/response mô tả).

Cho tôi biết muốn ưu tiên màn nào (mặc định: `Chat` → `Crawl Detail` → `New Crawl Step 2`). 
