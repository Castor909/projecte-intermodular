const Album = require('../models/Album');
const mongoose = require('mongoose');

const SORT_MAP = {
  'title-asc':  { title: 1 },
  'title-desc': { title: -1 },
  'price-asc':  { priceEth: 1 },
  'price-desc': { priceEth: -1 },
  'year-desc':  { year: -1 },
  'year-asc':   { year: 1 },
  'stock-desc': { stock: -1 },
};

// GET /api/albums
async function getAlbums(req, res, next) {
  try {
    const { page, limit = '24', search, genre, sort, featured, discounted } = req.query;

    const filter = {};
    if (genre && genre !== 'all') filter.genre = genre;
    if (featured === 'true') filter.featured = true;
    if (discounted === 'true') filter.discountPercent = { $gt: 0 };
    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'i');
      filter.$or = [{ title: re }, { artist: re }, { genre: re }];
    }

    const sortObj = SORT_MAP[sort] || { featured: -1, createdAt: -1 };

    if (page !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
      const [albums, total] = await Promise.all([
        Album.find(filter).sort(sortObj).skip((pageNum - 1) * limitNum).limit(limitNum),
        Album.countDocuments(filter),
      ]);
      return res.json({ albums, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    }

    const albums = await Album.find(filter).sort(sortObj);
    res.json(albums);
  } catch (err) {
    next(err);
  }
}

// GET /api/albums/genres
async function getGenres(req, res, next) {
  try {
    const genres = await Album.distinct('genre');
    res.json(genres.filter(Boolean).sort((a, b) => a.localeCompare(b)));
  } catch (err) {
    next(err);
  }
}

// GET /api/albums/:id
async function getAlbumById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid album id format' });
    }

    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    res.json(album);
  } catch (err) {
    next(err);
  }
}

// POST /api/albums
async function createAlbum(req, res, next) {
  try {
    const album = await Album.create(req.body);
    res.status(201).json(album);
  } catch (err) {
    next(err);
  }
}

// PUT /api/albums/:id
async function updateAlbum(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid album id format' });
    }
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/albums/:id
async function deleteAlbum(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid album id format' });
    }
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAlbums,
  getGenres,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};