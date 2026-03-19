import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAlbumById } from '../api/albums';

function AlbumDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbumById(id)
      .then(setAlbum)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading album...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (!album) return <div style={{ padding: 40 }}>Album not found.</div>;

  return (
    <div className="album-detail" style={{ padding: 40 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>
      <div style={{ display: 'flex', gap: 40 }}>
        <img src={album.coverUrl} alt={album.title} style={{ width: 240, borderRadius: 8 }} />
        <div>
          <h2>{album.title}</h2>
          <p><b>Artist:</b> {album.artist}</p>
          <p><b>Year:</b> {album.year}</p>
          <p><b>Genre:</b> {album.genre}</p>
          <p><b>Description:</b> {album.description}</p>
          <p style={{ fontWeight: 'bold', color: '#D35400' }}>{album.priceEth} ETH</p>
          <button className="btn-connect btn-large" onClick={() => onAddToCart(album)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlbumDetailPage;
