const express = require('express');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

const USER_AGENT = 'VinylEth/1.0 (projecte-intermodular-school)';

// GET /api/itunes/preview?artist=Pink+Floyd&album=Dark+Side+of+the+Moon
router.get('/preview', requireAdmin, async (req, res, next) => {
  const { artist, album } = req.query;

  if (!artist || !album) {
    return res.status(400).json({ message: '"artist" and "album" query params are required' });
  }

  try {
    const term = encodeURIComponent(`${artist} ${album}`);
    const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=10`;

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      return res.status(502).json({ message: `iTunes API error: ${response.status}` });
    }

    const data = await response.json();

    // Pick the first result that has a preview URL
    const result = (data.results || []).find((r) => r.previewUrl) || null;

    if (!result) {
      return res.status(404).json({ message: 'No preview found for this album on iTunes' });
    }

    res.json({
      previewUrl: result.previewUrl,
      trackName: result.trackName,
      collectionName: result.collectionName,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
