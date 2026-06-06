const Album = require('../models/Album');
const albums = require('../data/albums');

async function seedAlbums() {
  for (const album of albums) {
    const exists = await Album.exists({ title: album.title, artist: album.artist });
    if (!exists) {
      await Album.create(album);
    }
  }
}

module.exports = {
  seedAlbums,
};