import React, { useEffect, useState } from 'react';
import { WishlistContext } from './wishlistContextValue';

const KEY = 'vinyleth_wishlist';

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  function isInWishlist(id) {
    return wishlist.some((a) => a._id === id);
  }

  function toggleWishlist(album) {
    setWishlist((prev) =>
      prev.some((a) => a._id === album._id)
        ? prev.filter((a) => a._id !== album._id)
        : [...prev, album]
    );
  }

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
