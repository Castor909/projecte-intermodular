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

module.exports = {
  getAlbums,
  getAlbumById,
};