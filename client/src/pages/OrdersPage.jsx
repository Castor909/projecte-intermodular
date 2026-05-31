import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../useAuth';

const ETHERSCAN = 'https://etherscan.io/tx';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function shortHash(hash) {
  if (!hash) return '';
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

function OrdersPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }

    fetch('/api/orders/mine', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) return <div style={{ padding: 40 }}>Loading orders…</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>No orders yet.</p>
          <Link to="/" className="btn-connect">Browse catalog</Link>
        </div>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id} className="order-card">
              <div className="order-card__header">
                <span className="order-card__date">{formatDate(order.createdAt)}</span>
                <span className="order-card__total">{Number(order.totalEth).toFixed(3)} ETH</span>
              </div>

              <div className="order-card__tx">
                <span className="order-card__tx-label">Tx</span>
                <a
                  href={`${ETHERSCAN}/${order.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="order-card__tx-link"
                >
                  {shortHash(order.txHash)} ↗
                </a>
              </div>

              <ul className="order-card__items">
                {(order.items || []).map((item, i) => (
                  <li key={i} className="order-card__item">
                    <span>{item.title} × {item.qty}</span>
                    <span>{(item.priceEth * item.qty).toFixed(3)} ETH</span>
                  </li>
                ))}
              </ul>

              {order.shippingAddress?.fullName && (
                <p className="order-card__address">
                  {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
