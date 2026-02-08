import React from 'react';

import cover1 from './assets/images/dark-side-of-the-moon.jpg'; 
import cover2 from './assets/images/abbey-road.jpg';
import cover3 from './assets/images/rumours.jpg';

function App() {
  // Mock Data for catalog - in a real app, this would come from an API or blockchain
  const albums = [
    { id: 1, title: "Dark Side of the Moon", artist: "Pink Floyd", price: "0.05 ETH", cover: cover1 },
    { id: 2, title: "Abbey Road", artist: "The Beatles", price: "0.034 ETH", cover: cover2 },
    { id: 3, title: "Rumours", artist: "Fleetwood Mac", price: "0.04 ETH", cover: cover3 }
  ];

  return (
    <div className="App">
      {/* Header from the design */}
      <header>
        <div className="logo">VinylEth</div>
        <nav>
          <a href="#">Catalog</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
        <button className="btn-connect">Connect wallet</button>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Album of the week</h1>
        <p>Rediscover the classics through the blockchain.</p>
        <div className="featured-album">
          <img src={albums[0].cover} alt={albums[0].title} className="featured-cover" />
          <div className="featured-info">
            <h2>{albums[0].title}</h2>
            <p className="featured-artist">{albums[0].artist}</p>
            <p className="featured-price">{albums[0].price}</p>
            <button className="btn-connect btn-large">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <section>
        <h2 style={{ paddingLeft: '40px' }}>New Arrivals</h2>
        <div className="catalog-grid">
          {albums.map((album) => (
            <div key={album.id} className="album-card">
              <img src={album.cover} alt={album.title} className="album-cover" />
              <h3>{album.title}</h3>
              <p>{album.artist}</p>
              <p style={{ fontWeight: 'bold', color: '#D35400' }}>{album.price}</p>
              <button className="btn-connect" style={{ width: '100%' }}>View</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;