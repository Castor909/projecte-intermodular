const express = require('express');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

const USER_AGENT = 'VinylEth/1.0 (projecte-intermodular-school)';

// GET /api/discogs/release/:id — proxy to Discogs API (admin only)
router.get('/release/:id', requireAdmin, async (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: 'Release ID must be a number' });
  }

  try {
    const headers = {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    };

    if (process.env.DISCOGS_TOKEN) {
      headers['Authorization'] = `Discogs token=${process.env.DISCOGS_TOKEN}`;
    }

    const response = await fetch(`https://api.discogs.com/releases/${id}`, { headers });

    if (response.status === 404) {
      return res.status(404).json({ message: 'Release not found on Discogs' });
    }
    if (response.status === 429) {
      return res.status(429).json({ message: 'Discogs rate limit reached. Try again in a minute.' });
    }
    if (!response.ok) {
      return res.status(502).json({ message: `Discogs API error: ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
