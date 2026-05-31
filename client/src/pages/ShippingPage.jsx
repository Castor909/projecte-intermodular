import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { updateSavedAddress } from '../api/auth';

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
  const { user, token, updateUser } = useAuth();

  const [form, setForm] = useState(() => {
    // User profile address takes priority over localStorage
    if (user?.savedAddress?.fullName) {
      return { ...EMPTY_FORM, ...user.savedAddress };
    }
    return loadSaved();
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) { setErrors(next); return; }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));

    // Persist to user profile if logged in (best-effort)
    if (token) {
      try {
        const updatedUser = await updateSavedAddress(token, form);
        updateUser(updatedUser);
      } catch { /* non-blocking */ }
    }

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
      {user && (
        <p className="shipping-profile-hint">
          Address saved to your account automatically.
        </p>
      )}

      <form className="shipping-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} autoComplete="name" />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" value={form.address} onChange={handleChange} autoComplete="street-address" />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" type="text" value={form.city} onChange={handleChange} autoComplete="address-level2" />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="postalCode">Postal code</label>
            <input id="postalCode" name="postalCode" type="text" value={form.postalCode} onChange={handleChange} autoComplete="postal-code" />
            {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="country">Country</label>
          <input id="country" name="country" type="text" value={form.country} onChange={handleChange} autoComplete="country-name" />
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
