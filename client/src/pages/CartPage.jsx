import React from 'react';
import { useNavigate } from 'react-router-dom';
import { effectivePrice } from '../utils/price';

function CartPage({ cart, onRemove, onIncreaseQty, onDecreaseQty, onClear, cartNotice, onClearNotice }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + effectivePrice(item) * item.qty, 0);
  return (
    <div className="cart-page" style={{ padding: 40 }}>
      <h2>Your Cart</h2>
      {cartNotice && <p className="notice warning">{cartNotice}</p>}
      {cart.length === 0 ? (
        <div>No items in cart.</div>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map((item) => (
              <li key={item._id} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
                <img src={item.coverUrl} alt={item.title} style={{ width: 60, borderRadius: 4 }} loading="lazy" />
                <div style={{ flex: 1 }}>
                  <b>{item.title}</b> by {item.artist} <br />
                  <div className="qty-controls">
                    <button onClick={() => onDecreaseQty(item._id)} aria-label={`Decrease ${item.title} quantity`}>-</button>
                    <span>Qty: {item.qty}</span>
                    <button
                      onClick={() => onIncreaseQty(item._id)}
                      aria-label={`Increase ${item.title} quantity`}
                      disabled={Number.isFinite(item.stock) && item.qty >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  {Number.isFinite(item.stock) && (
                    <small>Available: {item.stock}</small>
                  )}
                </div>
                <span>
                  {item.discountPercent > 0 && (
                    <s style={{ color: '#999', marginRight: 4, fontSize: '0.85em' }}>{item.priceEth} ETH</s>
                  )}
                  {(effectivePrice(item) * item.qty).toFixed(3)} ETH
                </span>
                <button className="btn-secondary" onClick={() => onRemove(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 20 }}>
            <b>Total: {total.toFixed(3)} ETH</b>
          </div>
          <div className="cart-actions">
            <button className="btn-secondary" onClick={() => { onClear(); onClearNotice(); }}>Clear Cart</button>
            <button className="btn-connect btn-large" onClick={() => navigate('/checkout/shipping')}>
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
