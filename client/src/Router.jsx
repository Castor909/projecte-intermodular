import React from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import { useCart } from './useCart';

function ConditionalHeader() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Header />;
}

function AdminGuard({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

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
      <ConditionalHeader />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard><AdminPage /></AdminGuard>} />
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
        <Route path="/checkout/payment" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
