export function mapDiscogs(data) {
  const rawArtist = data.artists?.[0]?.name || '';
  const artist = rawArtist.replace(/\s*\(\d+\)$/, '').replace(/\s*\*$/, '').trim();
  const genre = data.styles?.[0] || data.genres?.[0] || '';
  const fmt = data.formats?.find((f) => f.name === 'Vinyl') || data.formats?.[0];
  const vinylFormat = fmt ? [fmt.name, ...(fmt.descriptions || [])].filter(Boolean).join(', ') : '';
  const barcodeEntry = data.identifiers?.find((i) => i.type === 'Barcode');
  const barcode = barcodeEntry?.value?.trim() || '';
  const tracks = (data.tracklist || [])
    .filter((t) => t.type_ === 'track')
    .map((t) => ({ title: t.title || '', duration: t.duration || '' }));
  const coverUrl = data.images?.[0]?.uri || '';

  const formData = {};
  const filled = [];

  if (data.title) { formData.title = data.title; filled.push('title'); }
  if (artist) { formData.artist = artist; filled.push('artist'); }
  if (data.year) { formData.year = String(data.year); filled.push('year'); }
  if (genre) { formData.genre = genre; filled.push('genre'); }
  if (coverUrl) { formData.coverUrl = coverUrl; filled.push('cover'); }
  if (data.labels?.[0]?.name) { formData.label = data.labels[0].name; filled.push('label'); }
  if (data.country) { formData.country = data.country; filled.push('country'); }
  if (vinylFormat) { formData.vinylFormat = vinylFormat; filled.push('format'); }
  if (barcode) { formData.barcode = barcode; filled.push('barcode'); }

  const filledSummary = tracks.length > 0
    ? [...filled, `tracklist (${tracks.length} tracks)`]
    : filled;

  return { formData, tracks: tracks.length > 0 ? tracks : null, filledSummary };
}
