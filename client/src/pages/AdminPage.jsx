import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums } from '../api/albums';
import { clearAdminToken, createAlbum, deleteAlbum, fetchAdminOrders, fetchAdminStats, updateAlbum } from '../api/admin';
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

  // ── Batch selection state ──
  const [selected, setSelected] = useState(new Set());
  const [discountInput, setDiscountInput] = useState('');
  const [batchWorking, setBatchWorking] = useState(false);

  // ── Stats state ──
  const [stats, setStats] = useState(null);

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
    fetchAdminStats().then(setStats).catch(() => {});
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

  useEffect(() => {
    setSelected(new Set());
  }, [adminSearch, adminGenre]);

  // ── Batch helpers ──
  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (visibleAlbums.length > 0 && visibleAlbums.every((a) => selected.has(a._id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(visibleAlbums.map((a) => a._id)));
    }
  }

  async function handleBatchUpdate(payload) {
    setBatchWorking(true);
    try {
      const results = await Promise.all([...selected].map((id) => updateAlbum(id, payload)));
      const map = Object.fromEntries(results.map((a) => [a._id, a]));
      setAlbums((prev) => prev.map((a) => map[a._id] ?? a));
      setSelected(new Set());
    } catch (err) {
      if (err.message.toLowerCase().includes('unauthorized')) { handleUnauthorized(); return; }
      alert(`Batch update failed: ${err.message}`);
    } finally {
      setBatchWorking(false);
    }
  }

  async function handleBatchSetDiscount() {
    const pct = parseInt(discountInput, 10);
    if (isNaN(pct) || pct < 0 || pct > 100) { alert('Enter a number between 0 and 100.'); return; }
    await handleBatchUpdate({ discountPercent: pct });
    setDiscountInput('');
  }

  async function handleBatchToggleFeatured() {
    setBatchWorking(true);
    try {
      const targets = albums.filter((a) => selected.has(a._id));
      const results = await Promise.all(targets.map((a) => updateAlbum(a._id, { featured: !a.featured })));
      const map = Object.fromEntries(results.map((a) => [a._id, a]));
      setAlbums((prev) => prev.map((a) => map[a._id] ?? a));
      setSelected(new Set());
    } catch (err) {
      if (err.message.toLowerCase().includes('unauthorized')) { handleUnauthorized(); return; }
      alert(`Batch update failed: ${err.message}`);
    } finally {
      setBatchWorking(false);
    }
  }

  async function handleBatchDelete() {
    if (!window.confirm(`Delete ${selected.size} album(s)? This cannot be undone.`)) return;
    setBatchWorking(true);
    try {
      await Promise.all([...selected].map((id) => deleteAlbum(id)));
      setAlbums((prev) => prev.filter((a) => !selected.has(a._id)));
      setSelected(new Set());
    } catch (err) {
      if (err.message.toLowerCase().includes('unauthorized')) { handleUnauthorized(); return; }
      alert(`Batch delete failed: ${err.message}`);
    } finally {
      setBatchWorking(false);
    }
  }

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

      {stats && (
        <div className="admin-stats">
          <div className="admin-stats__cards">
            <div className="admin-stats__card">
              <span className="admin-stats__value">{stats.totalAlbums}</span>
              <span className="admin-stats__label">Albums</span>
            </div>
            <div className="admin-stats__card admin-stats__card--warn">
              <span className="admin-stats__value">{stats.outOfStock}</span>
              <span className="admin-stats__label">Out of stock</span>
            </div>
            <div className="admin-stats__card">
              <span className="admin-stats__value">{stats.discounted}</span>
              <span className="admin-stats__label">On sale</span>
            </div>
            <div className="admin-stats__card">
              <span className="admin-stats__value">{stats.totalOrders}</span>
              <span className="admin-stats__label">Orders</span>
            </div>
            <div className="admin-stats__card admin-stats__card--accent">
              <span className="admin-stats__value">{stats.totalRevenue.toFixed(3)}</span>
              <span className="admin-stats__label">ETH revenue</span>
            </div>
          </div>

          {stats.topAlbums.length > 0 && (
            <div className="admin-stats__top">
              <h3 className="admin-stats__top-title">Top sellers</h3>
              <ol className="admin-stats__top-list">
                {stats.topAlbums.map((a) => (
                  <li key={a._id} className="admin-stats__top-item">
                    <span className="admin-stats__top-name">{a.title}</span>
                    <span className="admin-stats__top-artist">{a.artist}</span>
                    <span className="admin-stats__top-qty">{a.totalQty} sold</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

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

            {!loading && !fetchError && selected.size > 0 && (
              <div className="admin-batch-bar">
                <span className="admin-batch-count">{selected.size} selected</span>
                <div className="admin-batch-actions">
                  <div className="admin-batch-group">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      placeholder="%"
                      className="admin-batch-discount-input"
                    />
                    <button className="btn-secondary admin-btn-small" onClick={handleBatchSetDiscount} disabled={batchWorking}>
                      Set discount
                    </button>
                  </div>
                  <button className="btn-secondary admin-btn-small" onClick={() => handleBatchUpdate({ discountPercent: 0 })} disabled={batchWorking}>
                    Clear discount
                  </button>
                  <button className="btn-secondary admin-btn-small" onClick={handleBatchToggleFeatured} disabled={batchWorking}>
                    Toggle featured
                  </button>
                  <button className="admin-btn-delete admin-btn-small" onClick={handleBatchDelete} disabled={batchWorking}>
                    Delete
                  </button>
                  <button className="btn-secondary admin-btn-small" onClick={() => setSelected(new Set())} disabled={batchWorking}>
                    Deselect all
                  </button>
                </div>
              </div>
            )}

            {!loading && !fetchError && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: 36 }}>
                        <input
                          type="checkbox"
                          checked={visibleAlbums.length > 0 && visibleAlbums.every((a) => selected.has(a._id))}
                          onChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </th>
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
                      <tr key={album._id} className={selected.has(album._id) ? 'admin-row--selected' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selected.has(album._id)}
                            onChange={() => toggleSelect(album._id)}
                            aria-label={`Select ${album.title}`}
                          />
                        </td>
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
