const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/db');
const { seedAlbums } = require('./seed/seedAlbums');
const albumsRouter = require('./routes/albums');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const path = require('path');

// Serve album cover images from client assets so coverUrl '/images/...' resolves
app.use('/images', express.static(path.join(__dirname, '../client/src/assets/images')));

// API routes
app.use('/api/albums', albumsRouter);

// Test route to show that the API is working
app.get('/', (req, res) => {
  res.send('VinylEth API is running...');
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Connect to DB, seed if empty, then start server
(async function start() {
  try {
    await connectDatabase(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await seedAlbums();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();