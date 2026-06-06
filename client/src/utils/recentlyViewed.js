const KEY = 'vinyleth_recently_viewed';
const MAX = 6;

export function addToRecentlyViewed(album) {
  try {
    const prev = getRecentlyViewed();
    const next = [album, ...prev.filter((a) => a._id !== album._id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
