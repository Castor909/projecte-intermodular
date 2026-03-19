import React from 'react';

function FeaturedAlbum({ album }) {
  if (!album) return null;
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
          <button className="btn-connect btn-large">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedAlbum;
