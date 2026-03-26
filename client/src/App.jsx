import React from 'react';
import { CartProvider } from './CartContext.jsx';
import Router from './Router';

function App() {
  return (
    <CartProvider>
      <Router />
    </CartProvider>
  );
}

export default App;