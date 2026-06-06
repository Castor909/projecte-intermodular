import { useContext } from 'react';
import { WishlistContext } from './wishlistContextValue';

export function useWishlist() {
  return useContext(WishlistContext);
}
