const Album = require('../models/Album');
const mongoose = require('mongoose');

// GET /api/albums
async function getAlbums(req, res, next) {
  try {
    const albums = await Album.find();
    res.json(albums);
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
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};