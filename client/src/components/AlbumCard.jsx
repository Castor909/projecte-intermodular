import React from 'react';

function AlbumCard({ album }) {
  return (
    <div className="album-card">
      <img src={album.cover} alt={album.title} className="album-cover" />
      <h3>{album.title}</h3>
      <p>{album.artist}</p>
      <p style={{ fontWeight: 'bold', color: '#D35400' }}>{album.price}</p>
      <button className="btn-connect" style={{ width: '100%' }}>View</button>
    </div>
  );
}

export default AlbumCard;
