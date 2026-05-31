/**
 * Imports albums from a Navidrome server (Subsonic-compatible API) into MongoDB.
 *
 * Cover art strategy:
 *   - If the album has a MusicBrainz ID → Cover Art Archive CDN (no auth needed)
 *   - Otherwise → downloads the embedded cover from Navidrome and saves to server/public/covers/
 *
 * Usage:
 *   npm --prefix server run import:navidrome           # import all albums
 *   npm --prefix server run import:navidrome -- 20     # import first 20 (for testing)
 *
 * Required env vars (server/.env):
 *   NAVIDROME_URL   https://your-navidrome-domain.com
 *   NAVIDROME_USER  your-username
 *   NAVIDROME_PASS  your-password
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { connectDatabase } = require('../config/db');
const Album = require('../models/Album');

const BASE_URL = (process.env.NAVIDROME_URL || '').replace(/\/$/, '');
const USER = process.env.NAVIDROME_USER || '';
const PASS = process.env.NAVIDROME_PASS || '';

const COVERS_DIR = path.join(__dirname, '../public/covers');
const COVERS_ROUTE = '/covers';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Subsonic token auth (md5 + salt — safer than plain password)
function authQuery() {
  const salt = crypto.randomBytes(8).toString('hex');
  const token = crypto.createHash('md5').update(PASS + salt).digest('hex');
  return `u=${encodeURIComponent(USER)}&t=${token}&s=${salt}&v=1.16.1&c=VinylEth&f=json`;
}

async function subsonicGet(endpoint, params = '') {
  const url = `${BASE_URL}/rest/${endpoint}?${authQuery()}${params}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'VinylEth/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${endpoint}`);
  const data = await res.json();
  const sub = data['subsonic-response'];
  if (sub.status !== 'ok') {
    throw new Error(`Subsonic error: ${sub.error?.message || JSON.stringify(sub.error)}`);
  }
  return sub;
}

// Paginate through all albums
async function fetchAllAlbums() {
  const all = [];
  const size = 500;
  let offset = 0;
  while (true) {
    const sub = await subsonicGet('getAlbumList2.view', `&type=alphabeticalByName&size=${size}&offset=${offset}`);
    const batch = sub.albumList2?.album || [];
    all.push(...batch);
    if (batch.length < size) break;
    offset += size;
    await sleep(300);
  }
  return all;
}

async function fetchAlbumDetail(id) {
  const sub = await subsonicGet('getAlbum.view', `&id=${id}`);
  return sub.album;
}

async function downloadCover(coverArtId, destPath) {
  const salt = crypto.randomBytes(8).toString('hex');
  const token = crypto.createHash('md5').update(PASS + salt).digest('hex');
  const url = `${BASE_URL}/rest/getCoverArt.view?id=${coverArtId}&size=400`
    + `&u=${encodeURIComponent(USER)}&t=${token}&s=${salt}&v=1.16.1&c=VinylEth`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

async function resolveCoverUrl(album) {
  // Prefer Cover Art Archive (no auth, always public, works when Pi is off)
  if (album.musicBrainzId) {
    return `https://coverartarchive.org/release/${album.musicBrainzId}/front-250`;
  }

  // Fall back: download the embedded cover from Navidrome
  if (album.coverArt) {
    const filename = `${album.id}.jpg`;
    const destPath = path.join(COVERS_DIR, filename);
    try {
      await downloadCover(album.coverArt, destPath);
      return `${COVERS_ROUTE}/${filename}`;
    } catch (err) {
      console.log(`    Cover download failed: ${err.message}`);
    }
  }

  return null;
}

function formatDuration(totalSeconds) {
  if (!totalSeconds) return '';
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function buildDescription(title, artist, year) {
  return `${title} is a ${year || 'classic'} album by ${artist}.`;
}

async function importAlbum(raw, index, total) {
  const label = `[${index}/${total}] ${raw.artist} — ${raw.name}`;
  console.log(`\n${label}`);

  // Skip duplicates
  const exists = await Album.findOne({ title: raw.name, artist: raw.artist });
  if (exists) { console.log('  Already in DB, skipping.'); return 'skip'; }

  // Full album with tracks
  let detail;
  try {
    detail = await fetchAlbumDetail(raw.id);
  } catch (err) {
    console.log(`  Track fetch failed: ${err.message}`);
    return 'fail';
  }

  const coverUrl = await resolveCoverUrl(raw);
  if (!coverUrl) {
    console.log('  No cover available, skipping (coverUrl required).');
    return 'fail';
  }

  const tracks = (detail.song || [])
    .sort((a, b) => (a.track || 0) - (b.track || 0))
    .map((s) => ({ title: s.title, duration: formatDuration(s.duration) }));

  const doc = {
    title: raw.name,
    artist: raw.artist,
    year: raw.year || 2000,
    genre: raw.genre || 'Unknown',
    priceEth: 0.05,
    coverUrl,
    stock: 5,
    featured: false,
    description: buildDescription(raw.name, raw.artist, raw.year),
    tracks,
    ...(raw.musicBrainzId && { mbid: raw.musicBrainzId }),
  };

  try {
    await Album.create(doc);
    const coverSrc = raw.musicBrainzId ? 'CoverArtArchive' : 'Navidrome download';
    console.log(`  OK — ${tracks.length} tracks, cover: ${coverSrc}`);
    return 'ok';
  } catch (err) {
    console.log(`  DB insert failed: ${err.message}`);
    return 'fail';
  }
}

async function main() {
  if (!BASE_URL || !USER || !PASS) {
    console.error('Missing env: NAVIDROME_URL, NAVIDROME_USER, NAVIDROME_PASS');
    process.exit(1);
  }

  await connectDatabase(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  fs.mkdirSync(COVERS_DIR, { recursive: true });

  console.log(`Fetching album list from ${BASE_URL} ...`);
  const all = await fetchAllAlbums();
  console.log(`Navidrome reports ${all.length} albums.`);

  const limitArg = process.argv[2] ? parseInt(process.argv[2], 10) : null;
  const batch = limitArg ? all.slice(0, limitArg) : all;
  console.log(`Importing ${batch.length} album(s)...\n`);

  let ok = 0, skip = 0, fail = 0;

  for (let i = 0; i < batch.length; i++) {
    const result = await importAlbum(batch[i], i + 1, batch.length);
    if (result === 'ok') ok++;
    else if (result === 'skip') skip++;
    else fail++;
    await sleep(250);
  }

  console.log('\n─────────────────────────────');
  console.log(`Imported : ${ok}`);
  console.log(`Skipped  : ${skip} (already in DB)`);
  console.log(`Failed   : ${fail}`);
  console.log('─────────────────────────────');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
