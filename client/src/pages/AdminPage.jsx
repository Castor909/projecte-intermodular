import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums } from '../api/albums';
import { clearAdminToken, createAlbum, deleteAlbum, fetchAdminOrders, updateAlbum } from '../api/admin';
import AdminAlbumForm from '../components/AdminAlbumForm';

const ETHERSCAN = 'https://etherscan.io/tx/';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function shortHash(hash) {
  return hash ? `${hash.slice(0, 8)}…${hash.slice(-6)}` : '—';
}

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' | 'orders'

  // ── Albums state ──
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminGenre, setAdminGenre] = useState('all');

  // ── Orders state ──
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFrom, setOrderFrom] = useState('');
  const [orderTo, setOrderTo] = useState('');

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

  const loadOrders = useCallback(() => {
    setOrdersLoading(true);
    setOrdersError('');
    fetchAdminOrders({ search: orderSearch, from: orderFrom, to: orderTo })
      .then(setOrders)
      .catch((err) => setOrdersError(err.message))
      .finally(() => setOrdersLoading(false));
  }, [orderSearch, orderFrom, orderTo]);

  useEffect(() => {
    if (activeTab === 'orders') loadOrders();
  }, [activeTab, loadOrders]);

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

  const visibleAlbums = albums.filter((album) => {
    const q = adminSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      album.title?.toLowerCase().includes(q) ||
      album.artist?.toLowerCase().includes(q);
    const matchesGenre = adminGenre === 'all' || album.genre === adminGenre;
    return matchesSearch && matchesGenre;
  });

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

      <div className="admin-tabs">
        <button
          className={`admin-tab${activeTab === 'albums' ? ' admin-tab--active' : ''}`}
          onClick={() => { setActiveTab('albums'); setMode('list'); }}
        >
          Albums
        </button>
        <button
          className={`admin-tab${activeTab === 'orders' ? ' admin-tab--active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' ? (
          <>
            <div className="admin-list-header">
              <h2 style={{ margin: 0 }}>Orders ({orders.length})</h2>
            </div>

            <div className="admin-filter-bar">
              <input
                type="search"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by tx hash…"
                className="admin-filter-search"
              />
              <input
                type="date"
                value={orderFrom}
                onChange={(e) => setOrderFrom(e.target.value)}
                className="admin-filter-date"
                title="From date"
              />
              <input
                type="date"
                value={orderTo}
                onChange={(e) => setOrderTo(e.target.value)}
                className="admin-filter-date"
                title="To date"
              />
              {(orderSearch || orderFrom || orderTo) && (
                <button
                  className="btn-secondary admin-btn-small"
                  onClick={() => { setOrderSearch(''); setOrderFrom(''); setOrderTo(''); }}
                >
                  Clear
                </button>
              )}
            </div>

            {ordersLoading && <p>Loading orders…</p>}
            {ordersError && <p className="notice warning">{ordersError}</p>}

            {!ordersLoading && !ordersError && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Buyer</th>
                      <th>Items</th>
                      <th>Total ETH</th>
                      <th>Tx hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="admin-empty">No orders yet.</td></tr>
                    ) : orders.map((order) => (
                      <tr key={order._id}>
                        <td className="admin-orders-date">{formatDate(order.createdAt)}</td>
                        <td>{order.userId?.email ?? <span className="admin-orders-anon">anonymous</span>}</td>
                        <td className="admin-orders-items">
                          {order.items.map((it, i) => (
                            <span key={i} className="admin-orders-item">
                              {it.title} ×{it.qty}
                            </span>
                          ))}
                        </td>
                        <td>{order.totalEth?.toFixed(3)} ETH</td>
                        <td>
                          <a
                            href={`${ETHERSCAN}${order.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-orders-txlink"
                            title={order.txHash}
                          >
                            {shortHash(order.txHash)}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : mode !== 'list' ? (
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
              <h2 style={{ margin: 0 }}>
                Albums ({adminSearch || adminGenre !== 'all'
                  ? `${visibleAlbums.length} of ${albums.length}`
                  : albums.length})
              </h2>
              <button className="btn-connect" onClick={handleCreate}>+ Add Album</button>
            </div>

            {!loading && !fetchError && albums.length > 0 && (
              <div className="admin-filter-bar">
                <input
                  type="search"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search by title or artist…"
                  className="admin-filter-search"
                />
                <select
                  value={adminGenre}
                  onChange={(e) => setAdminGenre(e.target.value)}
                  className="admin-filter-genre"
                >
                  <option value="all">All genres</option>
                  {[...new Set(albums.map((a) => a.genre).filter(Boolean))].sort().map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}

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
                    {visibleAlbums.map((album) => (
                      <tr key={album._id}>
                        <td>
                          <img
                            src={album.coverUrl}
                            alt={album.title}
                            className="admin-table-cover"
                            loading="lazy"
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
