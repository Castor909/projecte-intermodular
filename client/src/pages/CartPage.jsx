import React from 'react';

function CartPage({ cart, onRemove, onIncreaseQty, onDecreaseQty, onClear, cartNotice, onClearNotice }) {
  const total = cart.reduce((sum, item) => sum + (item.priceEth * item.qty), 0);
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
                <img src={item.coverUrl} alt={item.title} style={{ width: 60, borderRadius: 4 }} />
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
                <span>{(item.priceEth * item.qty).toFixed(3)} ETH</span>
                <button onClick={() => onRemove(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 20 }}>
            <b>Total: {total.toFixed(3)} ETH</b>
          </div>
          <button style={{ marginTop: 20 }} onClick={() => { onClear(); onClearNotice(); }}>Clear Cart</button>
        </>
      )}
    </div>
  );
}

export default CartPage;
