const express = require('express');
const router = express.Router();
const { getAlbums, getAlbumById } = require('../controllers/albumsController');

router.get('/', getAlbums);
router.get('/:id', getAlbumById);

module.exports = router;
