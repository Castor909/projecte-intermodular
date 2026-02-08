const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Test route to show that the API is working
app.get('/', (req, res) => {
  res.send('VinylEth API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});