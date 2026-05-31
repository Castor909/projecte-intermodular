import React from 'react';

function StockBadge({ stock }) {
  if (!Number.isFinite(stock)) return null;
  if (stock === 0) return <span className="stock-badge stock-badge--out">Out of stock</span>;
  if (stock <= 2) return <span className="stock-badge stock-badge--low">Last copies</span>;
  return null;
}

export default StockBadge;
