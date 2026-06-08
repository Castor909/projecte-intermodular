const express = require('express');
const jwt = require('jsonwebtoken');
const Album = require('../models/Album');
const Order = require('../models/Order');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const { sendOrderReceipt } = require('../utils/mailer');

const router = express.Router();

// POST /api/orders — confirm payment, decrement stock, save order
router.post('/', async (req, res, next) => {
  const { txHash, items, shippingAddress, email } = req.body;

  if (!txHash || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'txHash and items are required' });
  }

  // Optionally associate with logged-in user (token not required)
  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
      userId = payload.userId;
    } catch { /* anonymous order is fine */ }
  }

  try {
    // Decrement stock for each item — floor at 0
    for (const item of items) {
      await Album.findByIdAndUpdate(item.albumId, [
        { $set: { stock: { $max: [0, { $subtract: ['$stock', item.qty] }] } } },
      ], { updatePipeline: true });
    }

    const totalEth = items.reduce((sum, i) => sum + i.priceEth * i.qty, 0);

    const order = await Order.create({ txHash, items, totalEth, shippingAddress, userId });

    // Send receipt email (best-effort, non-blocking)
    if (email) {
      sendOrderReceipt({ to: email, txHash, items, totalEth, shippingAddress }).catch(() => {});
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — admin: all orders with optional filters
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { search, from, to } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.txHash = new RegExp(escaped, 'i');
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    const orders = await Order.find(filter)
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/mine — order history for logged-in user
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
