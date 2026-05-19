import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import Header from './components/Header';
import { useCart } from './useCart';

function Router() {
  const {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartNotice,
    clearCartNotice,
  } = useCart();
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route
          path="/album/:id"
          element={<AlbumDetailPage onAddToCart={addToCart} cartNotice={cartNotice} onClearNotice={clearCartNotice} />}
        />
        <Route
          path="/cart"
          element={(
            <CartPage
              cart={cart}
              onRemove={removeFromCart}
              onIncreaseQty={increaseQuantity}
              onDecreaseQty={decreaseQuantity}
              onClear={clearCart}
              cartNotice={cartNotice}
              onClearNotice={clearCartNotice}
            />
          )}
        />
        <Route path="/checkout/shipping" element={<ShippingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
