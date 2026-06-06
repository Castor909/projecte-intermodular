import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockBadge from './StockBadge';
import { fetchAlbums } from '../api/albums';

function SpecialOffers() {
  const navigate = useNavigate();
  const [discounted, setDiscounted] = useState([]);

  useEffect(() => {
    fetchAlbums({ discounted: 'true' })
      .then((data) => setDiscounted(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (discounted.length === 0) return null;

  return (
    <section className="special-offers">
      <h2 className="special-offers__title">Special Offers</h2>
      <div className="special-offers__grid">
        {discounted.map((album) => {
          const discountedEth = album.priceEth * (1 - album.discountPercent / 100);
          return (
            <div key={album._id || album.id} className="special-offer-card">
              <span className="special-offer-badge">−{album.discountPercent}%</span>
              <img src={album.coverUrl || album.cover} alt={album.title} className="special-offer-cover" />
              <div className="special-offer-info">
                <p className="special-offer-artist">{album.artist}</p>
                <h3 className="special-offer-name">{album.title}</h3>
                <StockBadge stock={album.stock} />
                <div className="special-offer-pricing">
                  <span className="special-offer-original">{album.priceEth} ETH</span>
                  <span className="special-offer-price">{discountedEth.toFixed(3)} ETH</span>
                </div>
                <button
                  className="btn-connect"
                  onClick={() => navigate(`/album/${album._id || album.id}`)}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SpecialOffers;
