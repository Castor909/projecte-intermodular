// Service for albums API requests
async function parseApiError(response, fallbackMessage) {
  try {
    const data = await response.json();
    if (data?.message) return data.message;
  } catch {
    // Ignore parsing failures and use fallback message.
  }
  return fallbackMessage;
}

export async function fetchAlbums(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
  const qs = new URLSearchParams(clean).toString();
  const res = await fetch(qs ? `/api/albums?${qs}` : '/api/albums');
  if (!res.ok) {
    const message = await parseApiError(res, 'Failed to fetch albums');
    throw new Error(message);
  }
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch('/api/albums/genres');
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAlbumById(id) {
  const res = await fetch(`/api/albums/${id}`);
  if (!res.ok) {
    const message = await parseApiError(res, 'Album not found');
    throw new Error(message);
  }
  return res.json();
}
