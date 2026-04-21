import React from 'react';
import { useNavigate } from 'react-router-dom';

function FeaturedAlbum({ album }) {
  const navigate = useNavigate();

  if (!album) return null;

  const albumId = album._id || album.id;

  return (
    <div className="hero-section">
      <h1>Album of the week</h1>
      <p>Rediscover the classics through the blockchain.</p>
      <div className="featured-album">
        <img src={album.cover} alt={album.title} className="featured-cover" />
        <div className="featured-info">
          <h2>{album.title}</h2>
          <p className="featured-artist">{album.artist}</p>
          <p className="featured-price">{album.price}</p>
          <button
            className="btn-connect btn-large"
            onClick={() => navigate(`/album/${albumId}`)}
            disabled={!albumId}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedAlbum;
