const express = require('express');
const router = express.Router();
const { getAlbums, getGenres, getAlbumById, createAlbum, updateAlbum, deleteAlbum } = require('../controllers/albumsController');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', getAlbums);
router.get('/genres', getGenres);
router.get('/:id', getAlbumById);
router.post('/', requireAdmin, createAlbum);
router.put('/:id', requireAdmin, updateAlbum);
router.delete('/:id', requireAdmin, deleteAlbum);

module.exports = router;
