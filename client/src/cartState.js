function getItemStock(item) {
  if (Number.isFinite(item.stock)) {
    return Math.max(0, item.stock);
  }
  return Number.POSITIVE_INFINITY;
}

export function addItemToCart(cart, album) {
  const found = cart.find((item) => item._id === album._id);

  if (found) {
    const stock = getItemStock(found);
    if (found.qty >= stock) {
      return {
        cart,
        result: {
          ok: false,
          message: `Only ${stock} units are available for ${found.title}.`,
        },
      };
    }

    return {
      cart: cart.map((item) =>
        item._id === album._id ? { ...item, qty: item.qty + 1 } : item
      ),
      result: { ok: true, message: '' },
    };
  }

  const albumStock = getItemStock(album);
  if (albumStock <= 0) {
    return {
      cart,
      result: {
        ok: false,
        message: `${album.title} is currently out of stock.`,
      },
    };
  }

  return {
    cart: [...cart, { ...album, qty: 1 }],
    result: { ok: true, message: '' },
  };
}

export function increaseCartItemQuantity(cart, id) {
  let blockedMessage = '';
  const nextCart = cart.map((item) => {
    if (item._id !== id) return item;

    const stock = getItemStock(item);
    if (item.qty >= stock) {
      blockedMessage = `Only ${stock} units are available for ${item.title}.`;
      return item;
    }

    return { ...item, qty: item.qty + 1 };
  });

  if (blockedMessage) {
    return { cart, result: { ok: false, message: blockedMessage } };
  }

  return { cart: nextCart, result: { ok: true, message: '' } };
}

export function decreaseCartItemQuantity(cart, id) {
  const nextCart = cart.flatMap((item) => {
    if (item._id !== id) return item;
    if (item.qty <= 1) return [];
    return { ...item, qty: item.qty - 1 };
  });

  return { cart: nextCart, result: { ok: true, message: '' } };
}

export function removeItemFromCart(cart, id) {
  return cart.filter((item) => item._id !== id);
}
