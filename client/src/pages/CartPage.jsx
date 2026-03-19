import React from 'react';

function CartPage({ cart, onRemove, onClear }) {
  const total = cart.reduce((sum, item) => sum + (item.priceEth * item.qty), 0);
  return (
    <div style={{ padding: 40 }}>
      <h2>Your Cart</h2>
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
                  <span>Qty: {item.qty}</span>
                </div>
                <span>{item.priceEth} ETH</span>
                <button onClick={() => onRemove(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 20 }}>
            <b>Total: {total.toFixed(3)} ETH</b>
          </div>
          <button style={{ marginTop: 20 }} onClick={onClear}>Clear Cart</button>
        </>
      )}
    </div>
  );
}

export default CartPage;
