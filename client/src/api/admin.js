function getToken() {
  return localStorage.getItem('admin_token') || '';
}

export function setAdminToken(token) {
  localStorage.setItem('admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('admin_token');
}

export async function adminLogin(password) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Login failed');
  }
  const data = await res.json();
  setAdminToken(data.token);
  return data;
}

function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-token': getToken(),
  };
}

export async function createAlbum(albumData) {
  const res = await fetch('/api/albums', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(albumData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create album');
  }
  return res.json();
}

export async function updateAlbum(id, albumData) {
  const res = await fetch(`/api/albums/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(albumData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update album');
  }
  return res.json();
}

export async function fetchDiscogsRelease(releaseId) {
  const res = await fetch(`/api/discogs/release/${releaseId}`, {
    headers: { 'x-admin-token': getToken() },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to fetch from Discogs');
  }
  return res.json();
}

export async function deleteAlbum(id) {
  const res = await fetch(`/api/albums/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': getToken() },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete album');
  }
}
