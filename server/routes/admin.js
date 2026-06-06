const express = require('express');
const Album = require('../models/Album');
const Order = require('../models/Order');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  res.json({ token: process.env.ADMIN_PASSWORD });
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res, next) => {
  try {
    const [
      totalAlbums,
      outOfStock,
      discounted,
      totalOrders,
      revenueResult,
      topAlbums,
    ] = await Promise.all([
      Album.countDocuments(),
      Album.countDocuments({ stock: 0 }),
      Album.countDocuments({ discountPercent: { $gt: 0 } }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalEth' } } }]),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.albumId',
            title: { $first: '$items.title' },
            artist: { $first: '$items.artist' },
            totalQty: { $sum: '$items.qty' },
          },
        },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({
      totalAlbums,
      outOfStock,
      discounted,
      totalOrders,
      totalRevenue: revenueResult[0]?.total ?? 0,
      topAlbums,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
