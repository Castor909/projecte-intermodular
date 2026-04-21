import assert from 'node:assert/strict';
import {
  addItemToCart,
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
  removeItemFromCart,
} from '../src/cartState.js';

function sampleAlbum(overrides = {}) {
  return {
    _id: 'album-1',
    title: 'Dark Side of the Moon',
    stock: 2,
    priceEth: 0.05,
    ...overrides,
  };
}

function run() {
  const album = sampleAlbum();

  let cart = [];
  let op = addItemToCart(cart, album);
  assert.equal(op.result.ok, true);
  assert.equal(op.cart.length, 1);
  assert.equal(op.cart[0].qty, 1);
  cart = op.cart;

  op = addItemToCart(cart, album);
  assert.equal(op.result.ok, true);
  assert.equal(op.cart[0].qty, 2);
  cart = op.cart;

  op = addItemToCart(cart, album);
  assert.equal(op.result.ok, false);
  assert.equal(op.result.message, 'Only 2 units are available for Dark Side of the Moon.');
  assert.equal(op.cart[0].qty, 2);

  op = increaseCartItemQuantity(cart, album._id);
  assert.equal(op.result.ok, false);
  assert.equal(op.result.message, 'Only 2 units are available for Dark Side of the Moon.');
  assert.equal(op.cart[0].qty, 2);

  op = decreaseCartItemQuantity(cart, album._id);
  assert.equal(op.result.ok, true);
  assert.equal(op.cart[0].qty, 1);
  cart = op.cart;

  op = decreaseCartItemQuantity(cart, album._id);
  assert.equal(op.result.ok, true);
  assert.equal(op.cart.length, 0);
  cart = op.cart;

  op = addItemToCart(cart, sampleAlbum({ _id: 'album-2', title: 'Out', stock: 0 }));
  assert.equal(op.result.ok, false);
  assert.equal(op.result.message, 'Out is currently out of stock.');
  assert.equal(op.cart.length, 0);

  const cartWithTwo = [
    { ...sampleAlbum(), qty: 1 },
    { ...sampleAlbum({ _id: 'album-3', title: 'Rumours' }), qty: 1 },
  ];
  const removed = removeItemFromCart(cartWithTwo, 'album-3');
  assert.equal(removed.length, 1);
  assert.equal(removed[0]._id, 'album-1');

  console.log('Cart state transition checks passed.');
}

run();
