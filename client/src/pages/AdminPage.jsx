import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums } from '../api/albums';
import { clearAdminToken, createAlbum, deleteAlbum, updateAlbum } from '../api/admin';
import AdminAlbumForm from '../components/AdminAlbumForm';

function AdminPage() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadAlbums = useCallback(() => {
    setLoading(true);
    setFetchError('');
    fetchAlbums()
      .then(setAlbums)
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  function handleLogout() {
    clearAdminToken();
    navigate('/admin/login');
  }

  function handleEdit(album) {
    setEditTarget(album);
    setMode('edit');
    setSaveError('');
    window.scrollTo(0, 0);
  }

  function handleCreate() {
    setEditTarget(null);
    setMode('create');
    setSaveError('');
    window.scrollTo(0, 0);
  }

  function handleCancel() {
    setMode('list');
    setEditTarget(null);
    setSaveError('');
  }

  function handleUnauthorized() {
    clearAdminToken();
    navigate('/admin/login');
  }

  async function handleDelete(album) {
    if (!window.confirm(`Delete "${album.title}"? This cannot be undone.`)) return;
    try {
      await deleteAlbum(album._id);
      setAlbums((prev) => prev.filter((a) => a._id !== album._id));
    } catch (err) {
      if (err.message.toLowerCase().includes('unauthorized')) {
        handleUnauthorized();
        return;
      }
      alert(`Delete failed: ${err.message}`);
    }
  }

  async function handleSave(payload) {
    setSaving(true);
    setSaveError('');
    try {
      if (mode === 'edit') {
        const updated = await updateAlbum(editTarget._id, payload);
        setAlbums((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      } else {
        const created = await createAlbum(payload);
        setAlbums((prev) => [created, ...prev]);
      }
      setMode('list');
      setEditTarget(null);
      window.scrollTo(0, 0);
    } catch (err) {
      if (err.message.toLowerCase().includes('unauthorized')) {
        handleUnauthorized();
        return;
      }
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <span className="admin-header__title">VinylEth Admin</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn-secondary admin-btn-small" onClick={() => navigate('/')}>
            ← Shop
          </button>
          <button className="btn-secondary admin-btn-small" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="admin-content">
        {mode !== 'list' ? (
          <>
            <button className="btn-secondary" style={{ marginBottom: 24 }} onClick={handleCancel}>
              ← Back to list
            </button>
            <AdminAlbumForm
              initialAlbum={editTarget}
              onSave={handleSave}
              onCancel={handleCancel}
              saving={saving}
              saveError={saveError}
            />
          </>
        ) : (
          <>
            <div className="admin-list-header">
              <h2 style={{ margin: 0 }}>Albums ({albums.length})</h2>
              <button className="btn-connect" onClick={handleCreate}>+ Add Album</button>
            </div>

            {loading && <p>Loading albums...</p>}
            {fetchError && <p className="notice warning">{fetchError}</p>}

            {!loading && !fetchError && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cover</th>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Genre</th>
                      <th>Price (ETH)</th>
                      <th>Stock</th>
                      <th>Discount</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {albums.map((album) => (
                      <tr key={album._id}>
                        <td>
                          <img
                            src={album.coverUrl}
                            alt={album.title}
                            className="admin-table-cover"
                          />
                        </td>
                        <td className="admin-table-title">{album.title}</td>
                        <td>{album.artist}</td>
                        <td>{album.genre}</td>
                        <td>{album.priceEth}</td>
                        <td>{album.stock}</td>
                        <td style={{ textAlign: 'center' }}>
                          {album.discountPercent > 0 ? `${album.discountPercent}%` : '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>{album.featured ? '✓' : '—'}</td>
                        <td className="admin-table-actions">
                          <button
                            className="btn-secondary admin-btn-small"
                            onClick={() => handleEdit(album)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn-delete admin-btn-small"
                            onClick={() => handleDelete(album)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {albums.length === 0 && (
                  <p className="admin-empty">No albums yet. Add the first one!</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
