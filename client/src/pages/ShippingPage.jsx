import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'vinyleth_shipping';

const EMPTY_FORM = {
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY_FORM, ...JSON.parse(raw) } : EMPTY_FORM;
  } catch {
    return EMPTY_FORM;
  }
}

function ShippingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(loadSaved);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Required';
    if (!form.address.trim()) next.address = 'Required';
    if (!form.city.trim()) next.city = 'Required';
    if (!form.postalCode.trim()) next.postalCode = 'Required';
    if (!form.country.trim()) next.country = 'Required';
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    navigate('/checkout/payment');
  }

  return (
    <div className="shipping-page">
      <nav className="checkout-steps">
        <span className="checkout-step checkout-step--done">Cart</span>
        <span className="checkout-step-sep">›</span>
        <span className="checkout-step checkout-step--active">Shipping</span>
        <span className="checkout-step-sep">›</span>
        <span className="checkout-step">Payment</span>
      </nav>

      <h2>Shipping details</h2>

      <form className="shipping-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            autoComplete="street-address"
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              autoComplete="address-level2"
            />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="postalCode">Postal code</label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={form.postalCode}
              onChange={handleChange}
              autoComplete="postal-code"
            />
            {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            type="text"
            value={form.country}
            onChange={handleChange}
            autoComplete="country-name"
          />
          {errors.country && <span className="field-error">{errors.country}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/cart')}>
            ← Back to cart
          </button>
          <button type="submit" className="btn-connect btn-large">
            Continue to payment →
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShippingPage;
