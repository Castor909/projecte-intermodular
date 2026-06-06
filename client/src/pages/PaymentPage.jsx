import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../useCart';
import { useAuth } from '../useAuth';
import { confirmOrder } from '../api/auth';
import { STORE_WALLET } from '../config/payment';
import { effectivePrice } from '../utils/price';

const SHIPPING_KEY = 'vinyleth_shipping';

function loadShipping() {
  try {
    const raw = localStorage.getItem(SHIPPING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function ethToHexWei(ethAmount) {
  // Use BigInt to avoid float precision loss when converting ETH → wei
  const [integer, decimal = ''] = ethAmount.toFixed(18).split('.');
  const paddedDecimal = decimal.padEnd(18, '0');
  const wei = BigInt(integer) * BigInt('1000000000000000000') + BigInt(paddedDecimal);
  return '0x' + wei.toString(16);
}

function isValidAddress(addr) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

function PaymentPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const [shipping] = useState(loadShipping);
  const [txState, setTxState] = useState('idle'); // idle | waiting | submitted | error
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const total = cart.reduce((sum, item) => sum + effectivePrice(item) * item.qty, 0);

  if (!isValidAddress(STORE_WALLET)) {
    return (
      <div className="payment-page">
        <p className="notice warning">
          Payment is not configured. Set <code>STORE_WALLET</code> in{' '}
          <code>client/src/config/payment.js</code> to a valid Ethereum address.
        </p>
      </div>
    );
  }

  if (cart.length === 0 && txState !== 'submitted') {
    return (
      <div className="payment-page">
        <p>Your cart is empty.{' '}
          <button className="btn-secondary" onClick={() => navigate('/')}>Back to catalog</button>
        </p>
      </div>
    );
  }

  async function handlePay() {
    const provider = typeof window !== 'undefined' ? window.ethereum : undefined;
    if (!provider) {
      setErrorMsg('MetaMask is not installed.');
      setTxState('error');
      return;
    }

    setTxState('waiting');
    setErrorMsg('');

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];
      const value = ethToHexWei(total);

      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from, to: STORE_WALLET, value }],
      });

      setTxHash(hash);
      setTxState('submitted');

      // Decrement stock and save order (best-effort, non-blocking)
      confirmOrder(token, {
        txHash: hash,
        items: cart.map((item) => ({
          albumId: item._id,
          title: item.title,
          artist: item.artist,
          qty: item.qty,
          priceEth: effectivePrice(item),
        })),
        shippingAddress: shipping,
      }).catch(() => {});

      clearCart();
    } catch (err) {
      setErrorMsg(err.code === 4001 ? 'Transaction rejected.' : (err.message || 'Transaction failed.'));
      setTxState('error');
    }
  }

  if (txState === 'submitted') {
    return (
      <div className="payment-page">
        <div className="payment-success">
          <h2>Order placed!</h2>
          <p>Your transaction has been submitted to the network.</p>
          <div className="tx-hash-box">
            <span className="tx-hash-label">Transaction hash</span>
            <code className="tx-hash-value">{txHash}</code>
          </div>
          <button className="btn-connect btn-large" onClick={() => navigate('/')}>
            Back to catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <nav className="checkout-steps">
        <span className="checkout-step checkout-step--done">Cart</span>
        <span className="checkout-step-sep">›</span>
        <span className="checkout-step checkout-step--done">Shipping</span>
        <span className="checkout-step-sep">›</span>
        <span className="checkout-step checkout-step--active">Payment</span>
      </nav>

      <div className="payment-layout">
        <div className="payment-summary">
          <h3>Order summary</h3>
          <ul className="payment-items">
            {cart.map((item) => (
              <li key={item._id} className="payment-item">
                <span>{item.title} × {item.qty}</span>
                <span>
                  {item.discountPercent > 0 && (
                    <s style={{ color: '#999', marginRight: 4, fontSize: '0.85em' }}>{(item.priceEth * item.qty).toFixed(3)} ETH</s>
                  )}
                  {(effectivePrice(item) * item.qty).toFixed(3)} ETH
                </span>
              </li>
            ))}
          </ul>
          <div className="payment-total">
            <b>Total</b>
            <b>{total.toFixed(3)} ETH</b>
          </div>

          {shipping && (
            <div className="payment-shipping-summary">
              <h3>Ship to</h3>
              <p>{shipping.fullName}</p>
              <p>{shipping.address}</p>
              <p>{shipping.city}, {shipping.postalCode}</p>
              <p>{shipping.country}</p>
              <button
                className="btn-secondary"
                style={{ marginTop: 8 }}
                onClick={() => navigate('/checkout/shipping')}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="payment-action">
          <h3>Pay with MetaMask</h3>
          <p className="payment-amount">{total.toFixed(3)} ETH</p>
          {txState === 'error' && <p className="notice warning">{errorMsg}</p>}
          <button
            className="btn-connect btn-large"
            onClick={handlePay}
            disabled={txState === 'waiting'}
          >
            {txState === 'waiting' ? 'Waiting for MetaMask...' : 'Pay now'}
          </button>
          <button
            className="btn-secondary"
            style={{ display: 'block', marginTop: 12 }}
            onClick={() => navigate('/checkout/shipping')}
            disabled={txState === 'waiting'}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
