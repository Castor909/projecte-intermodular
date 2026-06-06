import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums } from '../api/albums';

function FeaturedAlbum() {
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    fetchAlbums({ featured: 'true' })
      .then((data) => setAlbum(Array.isArray(data) ? (data[0] ?? null) : null))
      .catch(() => {});
  }, []);

  if (!album) return null;

  const albumId = album._id || album.id;
  const price = album.priceEth ? `${album.priceEth} ETH` : album.price;

  return (
    <div className="hero-section">
      <h1>Album of the week</h1>
      <p>Rediscover the classics through the blockchain.</p>
      <div className="featured-album">
        <img src={album.coverUrl || album.cover} alt={album.title} className="featured-cover" loading="eager" />
        <div className="featured-info">
          <h2>{album.title}</h2>
          <p className="featured-artist">{album.artist}</p>
          <p className="featured-price">{price}</p>
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
