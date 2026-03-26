import React, { useEffect, useState } from 'react';
import FeaturedAlbum from '../components/FeaturedAlbum';
import AlbumCard from '../components/AlbumCard';
import { fetchAlbums } from '../api/albums';

function CatalogPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums()
      .then((data) => {
        const transformed = data.map((album) => ({
          ...album,
          cover: album.coverUrl || album.cover,
          price: album.priceEth ? `${album.priceEth} ETH` : album.price,
        }));
        setAlbums(transformed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading albums...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (albums.length === 0) return <div style={{ padding: 40 }}>No albums found.</div>;

  return (
    <>
      <FeaturedAlbum album={albums[0]} />
      <section>
        <h2 style={{ paddingLeft: '40px' }}>New Arrivals</h2>
        <div className="catalog-grid">
          {albums.map((album) => (
            <AlbumCard key={album._id || album.id} album={album} />
          ))}
        </div>
      </section>
    </>
  );
}

export default CatalogPage;
