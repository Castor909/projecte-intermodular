import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAlbumById } from '../api/albums';
import AudioPlayer from '../components/AudioPlayer';
import { SkeletonDetail } from '../components/SkeletonCard';
import { effectivePrice } from '../utils/price';

function AlbumDetailPage({ onAddToCart, cartNotice, onClearNotice }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addMessage, setAddMessage] = useState('');

  useEffect(() => {
    fetchAlbumById(id)
      .then(setAlbum)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    return () => {
      onClearNotice();
    };
    // Intentionally run cleanup only on unmount to avoid clearing notice on cart re-renders.
  }, []);

  function handleAddToCart() {
    const result = onAddToCart(album);
    if (result?.ok) {
      setAddMessage(`${album.title} added to cart.`);
    } else {
      setAddMessage('');
    }
  }

  const isOutOfStock = Number.isFinite(album?.stock) && album.stock <= 0;
  const hasDiscount = Number.isFinite(album?.discountPercent) && album.discountPercent > 0;
  const discountedEth = hasDiscount ? effectivePrice(album).toFixed(3) : null;

  if (loading) return <div style={{ padding: 40 }}><SkeletonDetail /></div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (!album) return <div style={{ padding: 40 }}>Album not found.</div>;

  return (
    <div className="album-detail" style={{ padding: 40 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>
      <div style={{ display: 'flex', gap: 40 }}>
        <img
          src={album.coverUrl}
          alt={album.title}
          style={{ width: 240, height: 240, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <h2>{album.title}</h2>
          <p><b>Artist:</b> {album.artist}</p>
          <p><b>Year:</b> {album.year}</p>
          <p><b>Genre:</b> {album.genre}</p>
          <p><b>Description:</b> {album.description}</p>
          <p><b>Stock:</b> {album.stock ?? 'N/A'}</p>
          {hasDiscount ? (
            <div className="album-card__pricing">
              <span className="album-card__original">{album.priceEth} ETH</span>
              <span className="album-card__discounted">{discountedEth} ETH</span>
              <span className="album-card__discount-badge">−{album.discountPercent}%</span>
            </div>
          ) : (
            <p style={{ fontWeight: 'bold', color: '#D35400' }}>{album.priceEth} ETH</p>
          )}
          <button className="btn-connect btn-large" onClick={handleAddToCart} disabled={isOutOfStock}>
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          {cartNotice && <p className="notice warning">{cartNotice}</p>}
          {addMessage && <p className="notice success">{addMessage}</p>}

          {album.audioUrl && <AudioPlayer src={album.audioUrl} />}

          {(album.label || album.country || album.vinylFormat || album.barcode) && (
            <dl className="vinyl-specs">
              <h3 className="vinyl-specs__title">Vinyl specs</h3>
              {album.vinylFormat && <><dt>Format</dt><dd>{album.vinylFormat}</dd></>}
              {album.label && <><dt>Label</dt><dd>{album.label}</dd></>}
              {album.country && <><dt>Country</dt><dd>{album.country}</dd></>}
              {album.barcode && <><dt>Barcode</dt><dd>{album.barcode}</dd></>}
            </dl>
          )}
        </div>
      </div>
      {album.tracks && album.tracks.length > 0 && (
        <div className="track-list">
          <h3>Tracklist</h3>
          <ol>
            {album.tracks.map((track, index) => (
              <li key={index} className="track-item">
                <span className="track-title">{track.title}</span>
                {track.duration && <span className="track-duration">{track.duration}</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default AlbumDetailPage;
