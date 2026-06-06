import React from 'react';
import { useNavigate } from 'react-router-dom';
import StockBadge from './StockBadge';

function AlbumCard({ album }) {
  const navigate = useNavigate();
  const hasDiscount = Number.isFinite(album.discountPercent) && album.discountPercent > 0;
  const discountedEth = hasDiscount
    ? (album.priceEth * (1 - album.discountPercent / 100)).toFixed(3)
    : null;

  return (
    <div className="album-card">
      <div className="album-card__cover-wrap">
        <img src={album.cover} alt={album.title} className="album-cover" loading="lazy" />
        <StockBadge stock={album.stock} />
      </div>
      <h3>{album.title}</h3>
      <p>{album.artist}</p>
      {hasDiscount ? (
        <div className="album-card__pricing">
          <span className="album-card__original">{album.priceEth} ETH</span>
          <span className="album-card__discounted">{discountedEth} ETH</span>
          <span className="album-card__discount-badge">−{album.discountPercent}%</span>
        </div>
      ) : (
        <p style={{ fontWeight: 'bold', color: '#D35400' }}>{album.price}</p>
      )}
      <button
        className="btn-connect"
        style={{ width: '100%' }}
        onClick={() => navigate(`/album/${album._id || album.id}`)}
      >
        View
      </button>
    </div>
  );
}

export default AlbumCard;
