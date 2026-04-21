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

export async function fetchAlbums() {
  const res = await fetch('/api/albums');
  if (!res.ok) {
    const message = await parseApiError(res, 'Failed to fetch albums');
    throw new Error(message);
  }
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
