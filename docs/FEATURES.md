# Features Audit — Independent Code Analysis
> Generated: 2026-06-06 | Method: Full source code inspection (client + server)
> This audit is derived entirely from reading the actual code, NOT from FEATURES.md.

---

## Legend
- `[x]` — Fully implemented (code exists and logic is complete)
- `[~]` — Partially implemented (code exists but incomplete or broken)
- `[ ]` — Not implemented (no code found)

---

## 1. Catalog & Product Browsing

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 1 | Album listing with pagination ("Load more") | `[x]` | `CatalogPage.jsx`, `albumsController.js` |
| 2 | Real-time search with debounce (250ms) | `[x]` | `CatalogPage.jsx`, `useDebounce.js` |
| 3 | Genre filter (fetched from DB) | `[x]` | `CatalogPage.jsx`, `GET /api/albums/genres` |
| 4 | Sort: price, year, title, stock, featured | `[x]` | `albumsController.js` (8+ sort options) |
| 5 | Album detail page (full metadata) | `[x]` | `AlbumDetailPage.jsx`, `albumsController.js` |
| 6 | Tracklist display with durations | `[x]` | `AlbumDetailPage.jsx` (renders `album.tracks[]`) |
| 7 | Stock status badge (Out / Last copies) | `[x]` | `StockBadge.jsx` (thresholds: 0 and ≤2) |
| 8 | Featured album on homepage | `[x]` | `FeaturedAlbum.jsx` (queries `featured=true`) |
| 9 | Special offers / discounted albums section | `[x]` | `SpecialOffers.jsx` (`discountPercent > 0`) |
| 10 | Similar albums (same genre, 4 items) | `[x]` | `SimilarAlbums.jsx` |
| 11 | Recently viewed albums (localStorage, max 6) | `[x]` | `RecentlyViewed.jsx`, `recentlyViewed.js` |
| 12 | Skeleton loading cards | `[x]` | `SkeletonCard.jsx` |

---

## 2. Shopping Cart

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 13 | Add to cart from catalog card | `[x]` | `AlbumCard.jsx`, `cartState.js` |
| 14 | Add to cart from detail page | `[x]` | `AlbumDetailPage.jsx`, `cartState.js` |
| 15 | Stock validation before add (blocks OOS) | `[x]` | `cartState.js` → checks `stock > 0` |
| 16 | Quantity increase / decrease per item | `[x]` | `CartPage.jsx`, `cartState.js` |
| 17 | Quantity capped at available stock | `[x]` | `cartState.js` (enforced on increment) |
| 18 | Remove item (decrement to 0) | `[x]` | `cartState.js` |
| 19 | Clear entire cart | `[x]` | `CartPage.jsx`, `cartState.js` |
| 20 | Price with discount applied in cart | `[x]` | `CartPage.jsx`, `price.js::effectivePrice()` |
| 21 | Cart persists across page refresh (localStorage) | `[x]` | `CartContext.jsx` |
| 22 | Cart notification messages | `[x]` | `CartContext.jsx` (stock warning toasts) |

---

## 3. Wishlist

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 23 | Add/remove from wishlist | `[x]` | `WishlistContext.jsx`, `useWishlist.js` |
| 24 | Toggle from catalog and detail page | `[x]` | `AlbumCard.jsx`, `AlbumDetailPage.jsx` |
| 25 | Wishlist page with album cards | `[x]` | `WishlistPage.jsx` |
| 26 | Wishlist count badge in header | `[x]` | `Header.jsx` (badge if `wishlist.length > 0`) |
| 27 | Wishlist persists to localStorage | `[x]` | `WishlistContext.jsx` (`vinyleth_wishlist` key) |
| 28 | Empty wishlist state with CTA | `[x]` | `WishlistPage.jsx` |

---

## 4. Checkout Flow

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 29 | Checkout step indicator (Cart → Shipping → Payment) | `[x]` | `ShippingPage.jsx`, `PaymentPage.jsx` |
| 30 | Shipping form (name, address, city, postal, country) | `[x]` | `ShippingPage.jsx` |
| 31 | Shipping form validation (all fields required) | `[x]` | `ShippingPage.jsx` |
| 32 | Save shipping address to user profile | `[x]` | `ShippingPage.jsx` → `PUT /api/auth/address` |
| 33 | Autofill shipping from saved profile address | `[x]` | `ShippingPage.jsx` (loads from profile first) |
| 34 | Payment via MetaMask (eth_sendTransaction) | `[x]` | `PaymentPage.jsx`, `payment.js` |
| 35 | ETH → Wei conversion with BigInt precision | `[x]` | `PaymentPage.jsx` |
| 36 | Order summary before payment (items + total) | `[x]` | `PaymentPage.jsx` |
| 37 | TX hash display after payment | `[x]` | `PaymentPage.jsx` |
| 38 | Etherscan link for TX hash | `[x]` | `PaymentPage.jsx` |
| 39 | Cart cleared after successful payment | `[x]` | `PaymentPage.jsx` (calls `clearCart()`) |
| 40 | STORE_WALLET address configured | `[x]` | `config/payment.js` — `0x06c630497F14FB4eef9f620599448d6b0efa192a` |

---

## 5. Authentication & User Accounts

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 41 | User registration (email + password) | `[x]` | `RegisterPage.jsx`, `POST /api/auth/register` |
| 42 | Email format validation | `[x]` | `routes/auth.js` |
| 43 | Password min 6 chars + confirmation match | `[x]` | `RegisterPage.jsx`, `routes/auth.js` |
| 44 | Duplicate email prevention | `[x]` | `routes/auth.js` (unique index on email) |
| 45 | User login (email + password) | `[x]` | `LoginPage.jsx`, `POST /api/auth/login` |
| 46 | JWT token (7-day expiry) | `[x]` | `routes/auth.js` (expiresIn: '7d') |
| 47 | Session persists via localStorage | `[x]` | `AuthContext.jsx` |
| 48 | Session restored on page reload | `[x]` | `AuthContext.jsx` |
| 49 | Logout (clears token + user state) | `[x]` | `AuthContext.jsx` |
| 50 | Protected routes (redirect to /login) | `[x]` | `Router.jsx` |
| 51 | Profile page (view email, manage address) | `[x]` | `ProfilePage.jsx` |
| 52 | Change password (requires current password) | `[x]` | `ProfilePage.jsx`, `POST /api/auth/change-password` |
| 53 | Save delivery address on profile | `[x]` | `ProfilePage.jsx`, `PUT /api/auth/address` |

---

## 6. MetaMask / Web3 Wallet

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 54 | Detect MetaMask in browser | `[x]` | `Header.jsx` (checks `window.ethereum`) |
| 55 | Connect wallet (request accounts) | `[x]` | `Header.jsx` |
| 56 | Display shortened address (6+4 chars) | `[x]` | `Header.jsx` |
| 57 | React to accountsChanged event | `[x]` | `Header.jsx` (event listener on mount) |
| 58 | Wallet connection error handling | `[x]` | `Header.jsx` |

---

## 7. Order Management

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 59 | Create order on payment success | `[x]` | `POST /api/orders`, `routes/orders.js` |
| 60 | Auto-decrement stock on order | `[x]` | `routes/orders.js` (floor at 0) |
| 61 | Anonymous orders supported (no login required) | `[x]` | `routes/orders.js` (userId optional) |
| 62 | Order stores TX hash + shipping + items | `[x]` | `models/Order.js` |
| 63 | User order history page | `[x]` | `OrdersPage.jsx`, `GET /api/orders/mine` |
| 64 | Order list: date, total ETH, TX hash, items | `[x]` | `OrdersPage.jsx` |
| 65 | Short TX hash display + Etherscan link | `[x]` | `OrdersPage.jsx` |

---

## 8. Admin Panel

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 66 | Admin login (password-only auth) | `[x]` | `AdminLoginPage.jsx`, `POST /api/admin/login` |
| 67 | Admin token stored in localStorage | `[x]` | `AdminLoginPage.jsx` (`admin_token` key) |
| 68 | Admin middleware (x-admin-token header) | `[x]` | `middleware/requireAdmin.js` |
| 69 | Dashboard stats (albums, OOS, orders, revenue) | `[x]` | `AdminPage.jsx`, `GET /api/admin/stats` |
| 70 | Top 5 best-selling albums | `[x]` | `AdminPage.jsx`, `GET /api/admin/stats` |
| 71 | Album list with search + genre filter | `[x]` | `AdminPage.jsx` |
| 72 | Create album (full form) | `[x]` | `AdminAlbumForm.jsx`, `POST /api/albums` |
| 73 | Edit album (full form, prefilled) | `[x]` | `AdminAlbumForm.jsx`, `PUT /api/albums/:id` |
| 74 | Delete single album | `[x]` | `AdminPage.jsx`, `DELETE /api/albums/:id` |
| 75 | Batch select albums | `[x]` | `AdminPage.jsx` |
| 76 | Batch set discount % | `[x]` | `AdminPage.jsx` |
| 77 | Batch toggle featured flag | `[x]` | `AdminPage.jsx` |
| 78 | Batch delete albums | `[x]` | `AdminPage.jsx` |
| 79 | Export visible albums to CSV | `[x]` | `AdminPage.jsx` (with date in filename) |
| 80 | Quick Discogs import from dashboard | `[x]` | `AdminPage.jsx` (release ID → one click) |
| 81 | Admin orders view (all orders) | `[x]` | `AdminPage.jsx`, `GET /api/admin/orders` |
| 82 | Admin orders: search by TX hash | `[x]` | `AdminPage.jsx` (regex search) |
| 83 | Admin orders: filter by date range | `[x]` | `AdminPage.jsx` |
| 84 | Admin orders: shows buyer email or "Anonymous" | `[x]` | `AdminPage.jsx` |

---

## 9. External API Integrations

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 85 | Discogs API: fetch release by ID | `[x]` | `routes/discogs.js`, `GET /api/discogs/:id` |
| 86 | Discogs: map title, artist, year, genre, label, country, barcode | `[x]` | `utils/mapDiscogs.js` |
| 87 | Discogs: map tracklist with durations | `[x]` | `utils/mapDiscogs.js` |
| 88 | Discogs: map cover image URL | `[x]` | `utils/mapDiscogs.js` |
| 89 | Discogs: map vinyl format | `[x]` | `utils/mapDiscogs.js` |
| 90 | iTunes API: fetch 30s audio preview URL | `[x]` | `routes/itunes.js`, `GET /api/itunes` |
| 91 | Auto-fill admin form from Discogs | `[x]` | `AdminAlbumForm.jsx` |
| 92 | Auto-fill audio preview from iTunes | `[x]` | `AdminAlbumForm.jsx` |

---

## 10. Audio Player

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 93 | Custom HTML5 audio player | `[x]` | `AudioPlayer.jsx` |
| 94 | Play / Pause control | `[x]` | `AudioPlayer.jsx` |
| 95 | Seekable progress bar | `[x]` | `AudioPlayer.jsx` |
| 96 | Current time / duration display | `[x]` | `AudioPlayer.jsx` |
| 97 | Buffering indicator | `[x]` | `AudioPlayer.jsx` |
| 98 | Audio preview on album detail page | `[x]` | `AlbumDetailPage.jsx` (shown if `audioUrl` exists) |

---

## 11. Data Models (Server)

| # | Model | Fields | Status |
|---|-------|--------|--------|
| 99 | Album | title, artist, year, genre, priceEth, coverUrl, stock, featured, description, audioUrl, tracks[], label, country, vinylFormat, barcode, mbid, discountPercent | `[x]` |
| 100 | User | email (unique+lowercase), passwordHash, savedAddress{fullName, address, city, postalCode, country} | `[x]` |
| 101 | Order | txHash, items[]{albumId,title,artist,qty,priceEth}, totalEth, shippingAddress{}, userId (optional) | `[x]` |

---

## 12. Infrastructure & Utilities

| # | Feature | Status | Source Files |
|---|---------|--------|--------------|
| 102 | React Error Boundary | `[x]` | `ErrorBoundary.jsx` |
| 103 | 404 Not Found page | `[x]` | `NotFoundPage.jsx` |
| 104 | Centralized server error handler | `[x]` | `server/index.js` |
| 105 | JWT auth middleware | `[x]` | `middleware/requireAuth.js` |
| 106 | Admin token middleware | `[x]` | `middleware/requireAdmin.js` |
| 107 | Discount price utility (`effectivePrice()`) | `[x]` | `utils/price.js` |
| 108 | Debounce hook (configurable delay) | `[x]` | `useDebounce.js` |
| 109 | PWA manifest + icon | `[x]` | `public/manifest.json`, `public/icon.svg` |
| 110 | CORS enabled on server | `[x]` | `server/index.js` |
| 111 | MongoDB Atlas connection | `[x]` | `config/db.js` |

---

## Summary

| Category | Total | Complete | Partial | Missing |
|----------|-------|----------|---------|---------|
| Catalog & Browsing | 12 | 12 | 0 | 0 |
| Shopping Cart | 10 | 10 | 0 | 0 |
| Wishlist | 6 | 6 | 0 | 0 |
| Checkout Flow | 12 | 11 | 1 | 0 |
| Auth & Accounts | 13 | 13 | 0 | 0 |
| MetaMask / Web3 | 5 | 5 | 0 | 0 |
| Order Management | 7 | 7 | 0 | 0 |
| Admin Panel | 19 | 19 | 0 | 0 |
| External APIs | 8 | 8 | 0 | 0 |
| Audio Player | 6 | 6 | 0 | 0 |
| Data Models | 3 | 3 | 0 | 0 |
| Infrastructure | 10 | 10 | 0 | 0 |
| **TOTAL** | **111** | **110** | **1** | **0** |

---

## Only Known Issue

> **Feature #40 — STORE_WALLET address** (`client/src/config/payment.js`)
> The `STORE_WALLET` constant is an empty string. Real ETH payments cannot be sent until a valid Ethereum wallet address is set here.
> This is likely intentional for development/demo purposes.
