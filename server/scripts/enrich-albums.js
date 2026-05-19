/**
 * Enriches albums in the database with vinyl metadata from MusicBrainz.
 * Adds: label, country, vinylFormat, barcode, mbid.
 *
 * Usage: npm --prefix server run enrich
 * Requires: MongoDB running and MONGO_URI set in server/.env
 */

const dotenv = require('dotenv');
dotenv.config();

const { connectDatabase } = require('../config/db');
const Album = require('../models/Album');

const MB_API = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'VinylEth/1.0 (projecte-intermodular-school)';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mbFetch(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`MusicBrainz ${res.status} — ${url}`);
  return res.json();
}

async function findVinylRelease(artist, title) {
  const q = encodeURIComponent(`artist:"${artist}" release:"${title}"`);
  const data = await mbFetch(`${MB_API}/release?query=${q}&fmt=json&limit=15`);
  await sleep(1200);

  const releases = data.releases || [];
  // Prefer a 12" Vinyl release; fall back to any vinyl; then first result
  const isVinyl = (r) => r.media?.some((m) => m.format?.toLowerCase().includes('vinyl'));
  const is12inch = (r) => r.media?.some((m) => m.format === '12" Vinyl');

  return releases.find(is12inch) || releases.find(isVinyl) || releases[0] || null;
}

async function fetchReleaseDetail(mbid) {
  const data = await mbFetch(`${MB_API}/release/${mbid}?inc=labels+media&fmt=json`);
  await sleep(1200);
  return data;
}

function extractFields(detail) {
  const label = detail['label-info']?.[0]?.label?.name || null;
  const country = detail.country || null;
  const barcode = detail.barcode || null;

  const vinylMedia = detail.media?.find((m) =>
    m.format?.toLowerCase().includes('vinyl')
  );
  const vinylFormat = vinylMedia?.format || null;

  return { label, country, vinylFormat, barcode };
}

async function enrichAlbum(album) {
  console.log(`\nSearching: ${album.artist} — ${album.title}`);

  let release;
  try {
    release = await findVinylRelease(album.artist, album.title);
  } catch (err) {
    console.log(`  Search failed: ${err.message}`);
    return;
  }

  if (!release) {
    console.log('  No release found, skipping.');
    return;
  }

  console.log(`  Found: ${release.title} [${release.id}] (${release.date || '?'}, ${release.country || '?'})`);

  let detail;
  try {
    detail = await fetchReleaseDetail(release.id);
  } catch (err) {
    console.log(`  Detail fetch failed: ${err.message}`);
    return;
  }

  const { label, country, vinylFormat, barcode } = extractFields(detail);
  console.log(`  label=${label}  country=${country}  format=${vinylFormat}  barcode=${barcode}`);

  const update = { mbid: release.id };
  if (label) update.label = label;
  if (country) update.country = country;
  if (vinylFormat) update.vinylFormat = vinylFormat;
  if (barcode) update.barcode = barcode;

  await Album.findByIdAndUpdate(album._id, { $set: update });
  console.log('  Saved.');
}

async function main() {
  await connectDatabase(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const albums = await Album.find({});
  console.log(`Found ${albums.length} album(s) to enrich.`);

  for (const album of albums) {
    await enrichAlbum(album);
  }

  console.log('\nEnrichment complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
