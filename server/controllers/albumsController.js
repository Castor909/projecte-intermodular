const Album = require('../models/Album');

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