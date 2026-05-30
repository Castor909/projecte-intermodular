/**
 * Fetches 30-second audio preview URLs from the iTunes Search API
 * and saves them to the audioUrl field for albums that don't have one yet.
 *
 * Skips albums that already have a valid http(s) audioUrl.
 * Replaces placeholder paths like /audio/preview-*.mp3 with real URLs.
 *
 * Usage: npm --prefix server run enrich:audio
 */

const dotenv = require('dotenv');
dotenv.config();

const { connectDatabase } = require('../config/db');
const Album = require('../models/Album');

const USER_AGENT = 'VinylEth/1.0 (projecte-intermodular-school)';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function needsAudio(album) {
  const url = album.audioUrl || '';
  // Keep existing real URLs; replace empty strings and local /audio/ placeholders
  return !url || url.startsWith('/');
}

async function fetchPreview(artist, title) {
  const term = encodeURIComponent(`${artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=10`;

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`iTunes API ${res.status}`);

  const data = await res.json();
  return (data.results || []).find((r) => r.previewUrl) || null;
}

async function enrichAlbum(album) {
  console.log(`\nSearching: ${album.artist} — ${album.title}`);

  let result;
  try {
    result = await fetchPreview(album.artist, album.title);
  } catch (err) {
    console.log(`  Search failed: ${err.message}`);
    return;
  }

  if (!result) {
    console.log('  No preview found on iTunes, skipping.');
    return;
  }

  console.log(`  Found: "${result.trackName}" from "${result.collectionName}"`);
  console.log(`  URL: ${result.previewUrl}`);

  await Album.findByIdAndUpdate(album._id, { $set: { audioUrl: result.previewUrl } });
  console.log('  Saved.');
}

async function main() {
  await connectDatabase(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const albums = await Album.find({});
  const toEnrich = albums.filter(needsAudio);

  console.log(`${albums.length} total album(s), ${toEnrich.length} need audio enrichment.`);

  for (const album of toEnrich) {
    await enrichAlbum(album);
    await sleep(400);
  }

  console.log('\nAudio enrichment complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
