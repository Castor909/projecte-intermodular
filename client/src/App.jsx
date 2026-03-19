import React from 'react';
import { CartProvider } from './CartContext';
import Router from './Router';

function App() {
  return (
    <CartProvider>
      <Router />
    </CartProvider>
  );
}

export default App;