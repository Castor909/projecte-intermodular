const Album = require('../models/Album');
const albums = require('../data/albums');

async function seedAlbums() {
  const albumCount = await Album.countDocuments();

  if (albumCount > 0) {
    return;
  }

  await Album.insertMany(albums);
}

module.exports = {
  seedAlbums,
};