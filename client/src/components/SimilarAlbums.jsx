import React, { useEffect, useState } from 'react';
import AlbumCard from './AlbumCard';
import { fetchAlbums } from '../api/albums';

function SimilarAlbums({ genre, excludeId }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (!genre) return;
    setAlbums([]);
    fetchAlbums({ genre, page: 1, limit: 5 })
      .then((data) => {
        const similar = data.albums
          .filter((a) => a._id !== excludeId)
          .slice(0, 4)
          .map((a) => ({ ...a, cover: a.coverUrl || a.cover }));
        setAlbums(similar);
      })
      .catch(() => {});
  }, [genre, excludeId]);

  if (albums.length === 0) return null;

  return (
    <section className="similar-albums">
      <h3 className="similar-albums__title">You might also like</h3>
      <div className="similar-albums__grid">
        {albums.map((album) => (
          <AlbumCard key={album._id} album={album} />
        ))}
      </div>
    </section>
  );
}

export default SimilarAlbums;
