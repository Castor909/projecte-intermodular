import React from 'react';
import FeaturedAlbum from '../components/FeaturedAlbum';
import AlbumCard from '../components/AlbumCard';

import cover1 from '../assets/images/dark-side-of-the-moon.jpg';
import cover2 from '../assets/images/abbey-road.jpg';
import cover3 from '../assets/images/rumours.jpg';

// TODO: Replace with API data in next commit
const albums = [
  { id: 1, title: "Dark Side of the Moon", artist: "Pink Floyd", price: "0.05 ETH", cover: cover1 },
  { id: 2, title: "Abbey Road", artist: "The Beatles", price: "0.034 ETH", cover: cover2 },
  { id: 3, title: "Rumours", artist: "Fleetwood Mac", price: "0.04 ETH", cover: cover3 }
];

function CatalogPage() {
  return (
    <>
      <FeaturedAlbum album={albums[0]} />
      <section>
        <h2 style={{ paddingLeft: '40px' }}>New Arrivals</h2>
        <div className="catalog-grid">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </>
  );
}

export default CatalogPage;
