import React, { useState } from 'react';
import AlbumCard from './AlbumCard';
import { getRecentlyViewed } from '../utils/recentlyViewed';

function RecentlyViewed() {
  const [albums] = useState(() =>
    getRecentlyViewed().map((a) => ({ ...a, cover: a.coverUrl || a.cover }))
  );

  if (albums.length === 0) return null;

  return (
    <section className="recently-viewed">
      <h3 className="recently-viewed__title">Recently viewed</h3>
      <div className="recently-viewed__grid">
        {albums.map((album) => (
          <AlbumCard key={album._id} album={album} />
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;
