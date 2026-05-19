import React from 'react';
import { useNavigate } from 'react-router-dom';

function SpecialOffers({ albums }) {
  const navigate = useNavigate();
  const featured = albums.filter((album) => album.featured);

  if (featured.length === 0) return null;

  return (
    <section className="special-offers">
      <h2 className="special-offers__title">Special Offers</h2>
      <div className="special-offers__grid">
        {featured.map((album) => (
          <div key={album._id || album.id} className="special-offer-card">
            <span className="special-offer-badge">Featured</span>
            <img src={album.cover} alt={album.title} className="special-offer-cover" />
            <div className="special-offer-info">
              <p className="special-offer-artist">{album.artist}</p>
              <h3 className="special-offer-name">{album.title}</h3>
              <p className="special-offer-price">{album.price}</p>
              <button
                className="btn-connect"
                onClick={() => navigate(`/album/${album._id || album.id}`)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpecialOffers;
