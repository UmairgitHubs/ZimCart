# ZimCart platform completion status

This document summarizes what is **implemented and wired to the backend** versus what remains **UI-only, mock-driven, or missing** across the **admin-dashboard** (Next.js), **backend** (Express + Prisma + PostgreSQL), and **zimCart** (Expo / React Native). **Last updated:** 2026-04-12 (aligned with repository routes and representative admin pages).

---

## 1. Architecture snapshot

| Layer | Stack | API base |
|--------|--------|----------|
| Backend | Express, `/api/v1` prefix | — |
| Admin dashboard | Next.js, `apiClient` → `NEXT_PUBLIC_BACKEND_URL`, cookie-based refresh | Same origin cookies with backend CORS |
| zimCart | Expo, Axios `api.ts` | Hardcoded `BASE_URL` in `zimCart/src/services/api.ts` (should move to env) |

**Backend route groups (mounted under `/api/v1`):** `auth`, `cart`, `customer` + `customers` (alias), `health`, `help`, `products`, `upload`, `inventory`, `categories`, `marts`, `orders`, `vouchers`, `analytics`, `riders`.

**Prisma highlights:** `User` (roles `CUSTOMER`, `ADMIN`, `STORE_MANAGER`, `RIDER`), `RiderProfile` (1:1 with `User` when role is rider), `Store`, `Category`, `Product`, `Order` / `OrderItem`, `Cart` / `CartItem`, `Voucher` / `UserVoucher`, `SupportTicket`, `FAQ`, addresses, payment methods, notifications, sessions, etc. There is **no** Prisma model for **waste logs** or a **payment transactions ledger** (reconciliation beyond order snapshots).

---

## 2. Admin dashboard — what is effectively **done**

These areas use **TanStack Query + service modules** calling the real API (not the static `MOCK_*` constants as the primary data source).

| Area | Status | Notes |
|------|--------|--------|
| **Auth** | Done | Login, register, forgot/reset password, logout, `getMe` via `auth.service` + `apiClient`. |
| **Shell / RBAC** | Done | `ProtectedRoute` for `STORE_MANAGER` and `ADMIN`; sidebar, layout, header. |
| **Products** | Done | List with URL-driven filters/pagination, CRUD hooks (`useProducts`, mutations), image upload flows aligned with backend. |
| **Categories** | Done | `useCategories` + modals wired to API pattern (same as products ecosystem). |
| **Customers (admin)** | Done | `useCustomers` → `/customers/admin/*` (list, create, update, delete) with pagination in URL. |
| **Inventory** | Done | `useInventory`, stock update, history, delete → `/inventory/*`. |
| **Orders (admin)** | Mostly done | `useOrders` → `GET/PATCH/DELETE /orders`, stats, manual create/update. **Caveat:** list is **fetch-all** in one query (no server-side pagination on this page yet). |
| **Promotions (vouchers)** | Done | `useVouchers` → `/vouchers`; `STORE_MANAGER` scoped to their mart; `ADMIN` may set `storeId` on create (optional in UI). |
| **Customer support (admin inbox)** | Done | `useSupportTickets` → `GET/PATCH /help/tickets/admin`, `POST /help/tickets/admin`; staff replies appended to `message`; `STORE_MANAGER` sees customers who have ordered their mart. |
| **Overview (`/dashboard`)** | Done | `useAnalyticsOverview` → `GET /analytics/overview`; main KPIs and chart series from API. **Caveat:** the XL breakpoint **RightPanel** (calendar + “recent activities”) still uses static `constants/dashboard` data. |
| **Analytics (`/dashboard/analytics`)** | Done | `useAnalyticsInsights` → `GET /analytics/insights` with range query; charts driven from API. |
| **Riders (fleet CRUD)** | Mostly done | `useRiders` / mutations → `GET/POST/PATCH/DELETE /riders` (JWT; `STORE_MANAGER` scoped to managed mart). **Caveat:** no order ↔ rider assignment, live GPS, or delivery state surfaced from orders. |
| **Mart settings — Store tab** | Done | `useMartSettings` → `GET/PATCH /marts/admin/settings`; `ADMIN` mart picker → `GET /marts/admin/directory`. |
| **Header product search** | Done | Quick search in dashboard header calls product list/search API (not a dead placeholder). |

**Supporting UX:** CSV/PDF-style exports via client-side `ReportService` / export utils where implemented (exports reflect **current** data source — real or mock depending on page).

---

## 3. Admin dashboard — what is **not** complete (mock / simulated / partial)

| Area | Current behavior | Backend / data gap |
|------|------------------|---------------------|
| **Transactions** | `MOCK_TRANSACTIONS`; reconcile/edit/delete simulated | **No** payments/ledger model or routes (orders store a `paymentMethod` string snapshot only). |
| **Waste log** | `MOCK_WASTE_LOGS`; CRUD simulated | **No** waste / shrinkage table or API. |
| **Mart settings — Notifications & Security tabs** | Forms still receive `MOCK_NOTIFICATION_SETTINGS` / `MOCK_SECURITY_SETTINGS` | **No** store-scoped notification preference or security-settings persistence API wired from admin UI. |
| **Profile onboarding wizard** | Multi-step UI only | Not persisted via a dedicated onboarding API. |
| **Overview — RightPanel (XL)** | Static calendar grid + `RECENT_ACTIVITIES` | Optional: feed from real activity/notifications or remove until an API exists. |
| **Riders — operations depth** | List/create/edit/delete rider profiles works | **No** `Order.riderId` (or equivalent), dispatch UI, or live tracking tied to orders. |
| **Orders list UX** | Fully functional against API | List path still **fetch-all** then client filter/pagination; no dedicated server-side pagination on the orders page yet. |

**Legacy / cleanup:** Redux `ordersSlice` still seeds `MOCK_ORDERS` and simulates manual orders, but the **Orders page uses `useOrders` + `ordersApi`** — the slice is redundant for the main list flow and may confuse future work.

---

## 4. Backend — strengths and explicit gaps

### Implemented (representative)

- **Marketplace:** public `GET /marts`, `GET /marts/:id`, `GET /products`, product detail.
- **Customer app:** profile, addresses, payment methods, cart, place order, orders list, favourites, vouchers list + validate, notifications, sessions, security, account deletion, data export/clear history (under `/customers/...` with JWT).
- **Admin / manager:** JWT-protected product CRUD, inventory, categories (via product/category routes), **admin customer** routes, **admin orders** (list, stats, status, manual create/update, delete), **staff voucher CRUD** (`/vouchers`), **support ticket inbox** (`/help/tickets/admin`, `PATCH /help/tickets/:id`), uploads.
- **Analytics (admin):** `GET /analytics/overview`, `GET /analytics/insights` (scoped `ADMIN`, `STORE_MANAGER`).
- **Riders (admin):** `GET/POST/PATCH/DELETE /riders` with `RiderProfile` persistence.
- **Mart staff settings:** `GET/PATCH /marts/admin/settings`, `GET /marts/admin/directory` (admin mart picker).

### Gaps that block “complete” admin or mobile features

1. **Rider operations (delivery)** — fleet CRUD exists; **no** order assignment, handoff, or GPS pipeline tied to `Order`.
2. **Financial / transactions** — no reconciliation ledger, payouts, or PSP webhooks for the admin **Transactions** page.
3. **Mart notification & security settings** — store profile fields are persisted; **admin UI tabs** for notifications/security still mock until APIs + wiring exist.
4. **Waste / shrinkage** — greenfield if product owners want the feature (schema + API + admin UI).
5. **Profile / onboarding persistence** — no dedicated backend for the admin profile wizard.

---

## 5. zimCart customer app — what is **done**

| Feature | Status |
|---------|--------|
| Navigation | Customer stack + tabs; entry at onboarding or main based on auth. |
| Marts discovery | `useMarts` → backend. |
| Store / product browse | `useStoreDetails`, `useProducts`, `useCategories` → backend. |
| Cart | Full CRUD + clear → `/cart/*`. |
| Checkout | `placeOrder` → `POST /customers/orders`; clears cart after success. |
| Voucher UI | Validate code via `POST /customers/vouchers/validate`; wallet of vouchers via API (`VouchersScreen` comment notes mock removed). |
| Favourites | API-driven (`useFavourites`). |
| Auth flows | Login, register, forgot/reset password screens in navigator. |
| Profile ecosystem | Many screens exist and services target `/customers/*` (addresses, payment methods, notifications, sessions, etc.). |

---

## 6. zimCart — remaining work and **alignment** issues

### UI still mock or static

- **Home** and many **category hubs** (Grocery, Tech, Fashion, Beauty, Home Decor, Offers, New In, Pickup, etc.) mix **live** marts/deals/categories with **`@/data/mock/home`** (promo strips, aisles, brands, etc.).
- **Search** tab: live product search runs when the query is **at least 2 characters** (`GET /products` with `search`); empty-state “try searching” / recent list uses **AsyncStorage** for recents, not a full trending API.
- **Notification settings** screen uses **local `MOCK_SETTINGS`** instead of `GET/PATCH` notification preferences.
- **Payment methods:** card flow uses **mock token** (`tok_mock_*`) — acceptable for dev only; production needs a real PSP.

### Product / checkout gaps (backend + app)

- **Single-store cart:** checkout assumes all items share `cartItems[0].product.storeId`. Multi-mart basket splitting is not implemented.
- **Voucher vs order total:** UI computes `discountAmount` and `total`, but **`orderData` sent to `placeOrder` does not include `discount`** (backend `placeOrder` accepts `discount`). **Totals on the server can disagree with the client** unless you send `discount` (and ideally `voucherId` / code) and validate server-side.
- **Platform fee:** `platformFee` is shown in the UI but **not** sent in `orderData`; backend order has `subtotal`, `deliveryFee`, `discount`, `total` only — **financial reporting will not match** the app unless the fee is modeled and persisted.
- **Variants:** cart supports `variants` in API; ensure product detail → add-to-cart passes variant JSON consistently end-to-end (worth auditing per screen).

### Other apps inside the same binary

- **Rider** and **Mart** navigators are **placeholders** (“Rider Dashboard” / “Mart Dashboard” text only). There is no dedicated rider or mart staff app flow in this repo beyond the admin dashboard.

### Configuration

- **API base URL** is hardcoded in `zimCart/src/services/api.ts`; align with **EAS env / `.env`** per environment to match admin’s `NEXT_PUBLIC_BACKEND_URL` pattern.

---

## 7. Suggested completion order (cross-cutting)

1. **Correctness:** Server-side validation for checkout (discount, fees, single-store rule) and send matching fields from zimCart.
2. ~~**Admin promotions:** Voucher CRUD + Promotions page~~ **Done.**
3. ~~**Support:** Admin ticket APIs + Customer Support page~~ **Done.** Optional: customer-facing ticket history UI.
4. ~~**Store settings (mart profile):** `GET/PATCH /marts/admin/settings` + admin directory~~ **Done** for the **Store** tab. **Remaining:** notification + security tabs (see §3).
5. ~~**Overview + Analytics:** Metrics for dashboard + analytics pages~~ **Done** (`/analytics/overview`, `/analytics/insights`). **Optional:** replace **RightPanel** static widgets with real data.
6. ~~**Search:** Product search API + zimCart Search + admin header search~~ **Done** (minimum query length / UX may still evolve).
7. ~~**Riders (fleet):** CRUD + `RiderProfile`~~ **Done.** **Remaining:** dispatch/order linkage, compliance, map/GPS if in scope.
8. **Transactions / waste / ledger:** Product + schema decision, then backend + replace admin mocks.
9. **Orders page:** optional server-side pagination for very large datasets.

---

## 8. Quick reference — admin sidebar vs reality

| Sidebar item | Data source today |
|----------------|-------------------|
| Overview | **API** for main KPIs/charts (`/analytics/overview`); **RightPanel** (XL) still static constants |
| Orders | API |
| Products | API |
| Categories | API |
| Inventory | API |
| Customers | API |
| Riders | **API** for list/create/update/delete (`/riders`); **no** order assignment / live map |
| Promotions | API (`/vouchers`) |
| Transactions | Mock |
| Analytics | **API** (`/analytics/insights`) |
| Waste log | Mock |
| Customer support | API (`/help/tickets/admin`) |
| Mart settings | **API** for **Store** tab (`/marts/admin/settings`); **Notifications** / **Security** tabs still mock |
| Profile | Onboarding UI only (no dedicated persist API) |

---

## 9. Admin dashboard — approximate completion

These are **rough engineering estimates**, not a formal scorecard.

| Scope | Approx. % |
|--------|-----------|
| **Day-to-day mart operations** (catalog, orders, inventory, customers, vouchers, support, overview + analytics from API, mart store settings, riders CRUD, header search) | **~88–92%** |
| **Full surface** (every sidebar route + profile + all settings tabs + transactions + waste + deep rider/dispatch + orders server pagination + legacy Redux cleanup) | **~65–72%** |

---

*Generated from repository analysis; update this file when major features are wired or new modules are added.*
