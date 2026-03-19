// Service for albums API requests
export async function fetchAlbums() {
  const res = await fetch('/api/albums');
  if (!res.ok) throw new Error('Failed to fetch albums');
  return res.json();
}

export async function fetchAlbumById(id) {
  const res = await fetch(`/api/albums/${id}`);
  if (!res.ok) throw new Error('Album not found');
  return res.json();
}
