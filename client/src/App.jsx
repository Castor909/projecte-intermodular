import React from 'react';
import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { WishlistProvider } from './WishlistContext.jsx';
import Router from './Router';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;