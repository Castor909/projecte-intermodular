import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import { useCart } from './CartContext';

function Router() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/album/:id" element={<AlbumDetailPage onAddToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} onRemove={removeFromCart} onClear={clearCart} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
