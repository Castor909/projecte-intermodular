import React from 'react';
import { useNavigate } from 'react-router-dom';
import StockBadge from './StockBadge';

function AlbumCard({ album }) {
  const navigate = useNavigate();
  return (
    <div className="album-card">
      <div className="album-card__cover-wrap">
        <img src={album.cover} alt={album.title} className="album-cover" />
        <StockBadge stock={album.stock} />
      </div>
      <h3>{album.title}</h3>
      <p>{album.artist}</p>
      <p style={{ fontWeight: 'bold', color: '#D35400' }}>{album.price}</p>
      <button className="btn-connect" style={{ width: '100%' }} onClick={() => navigate(`/album/${album._id || album.id}`)}>
        View
      </button>
    </div>
  );
}

export default AlbumCard;
