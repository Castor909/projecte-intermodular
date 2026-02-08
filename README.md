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

## 🛠 Installation & Setup

### Prerequisites
* Node.js (v14+) installed
* MongoDB running locally or Atlas URI (optional for now - frontend only works without DB)

### Steps
1.  Clone the repository:
    ```bash
    git clone https://github.com/Castor909/projecte-intermodular.git
    cd projecte-intermodular
    ```
2.  Install Server dependencies:
    ```bash
    cd server
    npm install
    ```
3.  Install Client dependencies:
    ```bash
    cd ../client
    npm install
    ```
4.  **Open two terminal windows** and run:
    * **Terminal 1 (Server)**:
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

---
*Projecte Intermodular UD1A - Stepan Andreev*