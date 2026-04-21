# VinylEth 🎵

**Online vinyl record store with crypto payment integration.**

## 📖 Project Context
Vinyl has experienced a significant revival over the last 15-20 years. VinylEth addresses the need for intentional music listening while integrating modern Web3 technologies. This project is a full-stack web application designed for vinyl enthusiasts who value privacy and decentralized finance.

## 🚀 Tech Stack (MERN)
* **MongoDB**: NoSQL database for storing album metadata and user info.
* **Express.js**: Backend framework for the RESTful API.
* **React.js**: Frontend library for a dynamic Single Page Application (SPA).
* **Node.js**: Runtime environment.
* **Web3**: Ethereum Blockchain integration (MetaMask).

## 🎨 Design Identity
* **Aesthetic**: Retro/Vintage.
* **Palette**: Cream (Background), Dark Brown (Text), Burnt Orange (Accents).
* **Typography**: Playfair Display.

## � Project Resources
* **GitHub Repository**: https://github.com/Castor909/projecte-intermodular
* **Trello Board**: https://trello.com/b/DAAdSBPs/projecte-intermodular
* **Student**: Stepan Andreev
* **Course**: Projecte Intermodular UD1A

## �🛠 Installation & Setup

### Prerequisites
* Node.js v20.19+ (required by MongoDB/Mongoose dependencies)
* MongoDB running locally or Atlas URI (optional for now - frontend works without DB)

If you use nvm, install the required Node once (not per folder):
```bash
nvm install 20.19.0 && nvm use 20.19.0
```

### Steps
1.  Clone the repository:
    ```bash
    git clone https://github.com/Castor909/projecte-intermodular.git
    cd projecte-intermodular
    ```
2.  Install Server dependencies (optional for now):
    ```bash
    cd server
    npm install
    ```
3.  Install Client dependencies:
    ```bash
    cd ../client
    npm install
    ```
4.  **Open one or two terminal windows** and run:
        * **Terminal 1 (Server, optional)**:
            ```bash
            cd server
            node index.js
            ```
            Server will run on `http://localhost:5000`
        * **Terminal 2 (Client)**:
            ```bash
            cd client
            npm run dev
            ```
            Client will run on `http://localhost:5173`

5.  Open `http://localhost:5173` in your browser

## 📅 Roadmap
* [x] Initial Environment Setup
* [x] Database Design & Connection
* [x] Home Page Implementation
* [x] Product Details & Cart
* [ ] Smart Contract Integration (planned)

## 📋 Current Implementation Status

### ✅ Consolidated Through UD1B
* MongoDB integration with album model and seed dataset
* Backend API endpoints for album list and album details
* Frontend catalog connected to backend API
* Album detail page with route-based navigation
* Local cart with persistence (localStorage)
* Folder split by pages/components/api/context for clearer responsibility separation

### ✅ Implemented in this UD2A Session
* Basic MetaMask wallet connection in header (connect/disconnect + account badge)
* Cart quantity controls (+/-) with persistent totals
* Stock-aware cart behavior (quantity capped by available stock)
* Catalog search, genre filter, and sorting controls
* Improved API error propagation to frontend messages
* Backend validation for malformed album id (`400`) vs missing album (`404`)
* Lightweight API contract test script for `200/400/404` behavior
* Cart state transition checks for edge cases (stock limit, decrement removal, out-of-stock, remove)

### 🔄 Next Steps (UD2A)
* Continue Web3 phase with payment transaction flow

### ⚠ Runtime Note
Backend startup requires MongoDB available at `MONGO_URI`.
If MongoDB is not running, the server exits during startup and API runtime checks cannot be completed.
If your local MongoDB service is unstable, use a Docker fallback:
`docker run -d --name ud2a-mongo -p 27017:27017 mongo:7`

---
*Projecte Intermodular - Stepan Andreev*