import React, { useEffect, useState } from 'react';
import { CartContext } from './cartContextValue';
import {
  addItemToCart,
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
  removeItemFromCart,
} from './cartState';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [cartNotice, setCartNotice] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function notify(message) {
    setCartNotice(message);
  }

  function clearCartNotice() {
    setCartNotice('');
  }

  function addToCart(album) {
    const operation = addItemToCart(cart, album);
    setCart(operation.cart);

    if (!operation.result.ok) {
      notify(operation.result.message);
      return operation.result;
    }

    clearCartNotice();
    return { ok: true, message: '' };
  }

  function removeFromCart(id) {
    setCart((prev) => removeItemFromCart(prev, id));
    clearCartNotice();
  }

  function increaseQuantity(id) {
    const operation = increaseCartItemQuantity(cart, id);
    setCart(operation.cart);

    if (!operation.result.ok) {
      notify(operation.result.message);
      return operation.result;
    }

    clearCartNotice();
    return { ok: true, message: '' };
  }

  function decreaseQuantity(id) {
    const operation = decreaseCartItemQuantity(cart, id);
    setCart(operation.cart);
    clearCartNotice();
  }

  function clearCart() {
    setCart([]);
    clearCartNotice();
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartNotice,
        clearCartNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
