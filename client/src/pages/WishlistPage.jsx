import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../useWishlist';
import AlbumCard from '../components/AlbumCard';

function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <h2>Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>No saved albums yet.</p>
          <Link to="/" className="btn-connect">Browse catalog</Link>
        </div>
      ) : (
        <div className="catalog-grid">
          {wishlist.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
