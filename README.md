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
* [ ] Database Design & Connection
* [x] Home Page Implementation
* [ ] Product Details & Cart
* [ ] Smart Contract Integration

## 📋 UD1A - Current Status

### ✅ Implemented Features
* Project structure setup with MERN stack
* Development environment configuration (Node.js, React with Vite)
* Home page with album catalog display
* "Album of the Week" featured section
* Responsive grid layout for vinyl records
* Design system implementation (Retro/Vintage aesthetic with Playfair Display)
* Basic Express.js server setup
* GitHub repository with version control
* Trello board for project management

### 🔄 Next Steps (UD1B)
* Database integration with MongoDB
* Backend API endpoints for albums
* Shopping cart functionality
* Product detail pages
* MetaMask wallet connection

---
*Projecte Intermodular UD1A - Stepan Andreev*