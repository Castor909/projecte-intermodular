
# VinylEth

**Full-stack online vinyl record store with cryptocurrency payment integration.**

Built with the MERN stack and Ethereum/MetaMask, VinylEth lets customers browse a curated vinyl catalog, manage a cart and wishlist, and pay for orders directly via MetaMask on the Sepolia testnet. An admin panel covers the full product lifecycle including Discogs API imports.

- **Student:** Stepan Andreev
- **Course:** Projecte Intermodular — CIFP Francesc de Borja Moll
- **Repository:** https://github.com/Castor909/projecte-intermodular

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (7-day tokens), bcrypt |
| Payments | MetaMask (`eth_sendTransaction`), Sepolia testnet |
| Email | Resend API (order receipt emails) |
| External APIs | Discogs (album metadata + cover), iTunes (audio preview) |
| PWA | Web App Manifest + custom icon |

---

## Features

### Catalog
- Album listing with pagination, real-time debounced search, genre filter, and 8 sort options
- Album detail page with full metadata, tracklist with durations, and 30-second iTunes audio preview
- Stock status badges, featured album section, special offers (discounted albums), similar albums, recently viewed (localStorage)

### Shopping Cart & Wishlist
- Add/remove items, quantity controls capped at available stock, discount-aware pricing
- Cart persists across sessions via localStorage
- Wishlist with badge counter, persisted to localStorage

### Checkout
- 3-step flow: Cart → Shipping → Payment
- Shipping form with validation; address auto-filled from saved profile
- MetaMask payment with ETH→Wei BigInt conversion, TX hash display, and Etherscan link
- Order saved to DB on payment success; stock decremented automatically
- Email receipt sent via Resend after successful order

### User Accounts
- Register / Login with JWT auth, protected routes
- Profile page: change password, save/edit delivery address
- Order history with TX hashes and Etherscan links

### Admin Panel
- Password-protected admin area (separate from user auth)
- Dashboard: total albums, out-of-stock count, total orders, revenue
- Album CRUD with full form; batch operations (discount, featured flag, delete)
- Quick Discogs import: enter release ID → form auto-filled with metadata + tracklist
- iTunes audio preview auto-fill
- CSV export of visible albums
- Orders view with search by TX hash and date-range filter

---

## Project Structure

```
projecte-intermodular/
├── client/              # React SPA (Vite)
│   ├── src/
│   │   ├── pages/       # Route-level components
│   │   ├── components/  # Reusable UI components
│   │   ├── api/         # Fetch wrappers for backend endpoints
│   │   ├── services/    # Business logic (cart state, price utils)
│   │   ├── context/     # React contexts (Auth, Cart, Wishlist)
│   │   └── config/      # App-level constants (store wallet address)
│   └── public/          # Static assets, PWA manifest
└── server/              # Express API
    ├── routes/          # Route handlers
    ├── controllers/     # Business logic for albums
    ├── models/          # Mongoose schemas (Album, User, Order)
    ├── middleware/       # JWT auth, admin token guards
    ├── utils/           # Helpers (Discogs mapper, price, email)
    ├── config/          # DB connection
    └── seed/            # Initial dataset
```

---

## Setup

### Prerequisites
- Node.js v20.19+
- MongoDB running locally, or a MongoDB Atlas URI
- MetaMask browser extension (for payment testing)

### 1. Clone and install dependencies

```bash
git clone https://github.com/Castor909/projecte-intermodular.git
cd projecte-intermodular

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and fill in the required values (see `.env.example` for descriptions).

### 3. Seed the database (first run)

```bash
cd server
node seed/seedAlbums.js
```

### 4. Start the application

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev        # or: node index.js
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

See `server/.env.example` for the full list with descriptions.

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `ADMIN_PASSWORD` | Yes | Password for the admin panel |
| `RESEND_API_KEY` | Optional | Resend API key for order receipt emails |
| `RECEIPT_EMAIL` | Optional | Fallback recipient on Resend free plan |
| `DISCOGS_TOKEN` | Optional | Discogs API token for album imports |

---

## Testing

```bash
# Backend API contract tests (requires running server + MongoDB)
cd server && npm test

# Frontend cart logic tests
cd client && npm test
```

---

## Data Models

**Album** — title, artist, year, genre, priceEth, coverUrl, stock, featured, description, audioUrl, tracks, label, country, vinylFormat, barcode, discountPercent

**User** — email, passwordHash, savedAddress { fullName, address, city, postalCode, country }

**Order** — txHash, items, totalEth, shippingAddress, userId (optional, supports anonymous checkout)
