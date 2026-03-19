const express = require('express');
const cors = require('cors');
const albumsRouter = require('./routes/albums');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});