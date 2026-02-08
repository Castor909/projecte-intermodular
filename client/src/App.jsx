import React from 'react';

function App() {
  // Mock Data for catalog - in a real app, this would come from an API or blockchain
  const albums = [
    { id: 1, title: "Dark Side of the Moon", artist: "Pink Floyd", price: "0.05 ETH" },
    { id: 2, title: "Abbey Road", artist: "The Beatles", price: "0.034 ETH" },
    { id: 3, title: "Rumours", artist: "Fleetwood Mac", price: "0.04 ETH" }
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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Album of the week</h1>
        <p>Rediscover the classics through the blockchain.</p>
      </div>

      {/* Catalog Grid */}
      <section>
        <h2 style={{ paddingLeft: '40px' }}>New Arrivals</h2>
        <div className="catalog-grid">
          {albums.map((album) => (
            <div key={album.id} className="album-card">
              <div className="album-cover">Cover Art</div>
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