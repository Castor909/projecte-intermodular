import React, { useState } from 'react';
import { useAuth } from '../useAuth';
import { updateSavedAddress, changePassword } from '../api/auth';

const EMPTY_ADDRESS = { fullName: '', address: '', city: '', postalCode: '', country: '' };
const SHIPPING_KEY = 'vinyleth_shipping';

function ProfilePage() {
  const { user, token, updateUser } = useAuth();

  const [addrForm, setAddrForm] = useState(() => ({ ...EMPTY_ADDRESS, ...(user?.savedAddress || {}) }));
  const [addrErrors, setAddrErrors] = useState({});
  const [addrStatus, setAddrStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [addrError, setAddrError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwStatus, setPwStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [pwError, setPwError] = useState('');

  function handleAddrChange(e) {
    const { name, value } = e.target;
    setAddrForm((prev) => ({ ...prev, [name]: value }));
    if (addrErrors[name]) setAddrErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validateAddr() {
    const errs = {};
    if (!addrForm.fullName.trim()) errs.fullName = 'Required';
    if (!addrForm.address.trim()) errs.address = 'Required';
    if (!addrForm.city.trim()) errs.city = 'Required';
    if (!addrForm.postalCode.trim()) errs.postalCode = 'Required';
    if (!addrForm.country.trim()) errs.country = 'Required';
    return errs;
  }

  async function handleAddrSubmit(e) {
    e.preventDefault();
    const errs = validateAddr();
    if (Object.keys(errs).length > 0) { setAddrErrors(errs); return; }

    setAddrStatus('saving');
    setAddrError('');
    try {
      const updatedUser = await updateSavedAddress(token, addrForm);
      updateUser(updatedUser);
      localStorage.setItem(SHIPPING_KEY, JSON.stringify(addrForm));
      setAddrStatus('saved');
    } catch (err) {
      setAddrError(err.message);
      setAddrStatus('error');
    }
  }

  function handlePwChange(e) {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    if (pwErrors[name]) setPwErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validatePw() {
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Required';
    if (!pwForm.newPassword) errs.newPassword = 'Required';
    else if (pwForm.newPassword.length < 6) errs.newPassword = 'At least 6 characters';
    if (!pwForm.confirmPassword) errs.confirmPassword = 'Required';
    else if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  async function handlePwSubmit(e) {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }

    setPwStatus('saving');
    setPwError('');
    try {
      await changePassword(token, pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwStatus('saved');
    } catch (err) {
      setPwError(err.message);
      setPwStatus('error');
    }
  }

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <section className="profile-section">
        <h3>Account</h3>
        <div className="profile-email">
          <span className="profile-email__label">Email</span>
          <span className="profile-email__value">{user?.email}</span>
        </div>
      </section>

      <section className="profile-section">
        <h3>Delivery address</h3>
        <form className="shipping-form" onSubmit={handleAddrSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" type="text" value={addrForm.fullName} onChange={handleAddrChange} autoComplete="name" />
            {addrErrors.fullName && <span className="field-error">{addrErrors.fullName}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" type="text" value={addrForm.address} onChange={handleAddrChange} autoComplete="street-address" />
            {addrErrors.address && <span className="field-error">{addrErrors.address}</span>}
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" value={addrForm.city} onChange={handleAddrChange} autoComplete="address-level2" />
              {addrErrors.city && <span className="field-error">{addrErrors.city}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="postalCode">Postal code</label>
              <input id="postalCode" name="postalCode" type="text" value={addrForm.postalCode} onChange={handleAddrChange} autoComplete="postal-code" />
              {addrErrors.postalCode && <span className="field-error">{addrErrors.postalCode}</span>}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" type="text" value={addrForm.country} onChange={handleAddrChange} autoComplete="country-name" />
            {addrErrors.country && <span className="field-error">{addrErrors.country}</span>}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-connect" disabled={addrStatus === 'saving'}>
              {addrStatus === 'saving' ? 'Saving…' : 'Save address'}
            </button>
          </div>
          {addrStatus === 'saved' && <p className="notice success">Address saved.</p>}
          {addrStatus === 'error' && <p className="notice warning">{addrError}</p>}
        </form>
      </section>

      <section className="profile-section">
        <h3>Change password</h3>
        <form className="shipping-form" onSubmit={handlePwSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="currentPassword">Current password</label>
            <input id="currentPassword" name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} autoComplete="current-password" />
            {pwErrors.currentPassword && <span className="field-error">{pwErrors.currentPassword}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="newPassword">New password</label>
            <input id="newPassword" name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} autoComplete="new-password" />
            {pwErrors.newPassword && <span className="field-error">{pwErrors.newPassword}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePwChange} autoComplete="new-password" />
            {pwErrors.confirmPassword && <span className="field-error">{pwErrors.confirmPassword}</span>}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-connect" disabled={pwStatus === 'saving'}>
              {pwStatus === 'saving' ? 'Saving…' : 'Change password'}
            </button>
          </div>
          {pwStatus === 'saved' && <p className="notice success">Password changed successfully.</p>}
          {pwStatus === 'error' && <p className="notice warning">{pwError}</p>}
        </form>
      </section>
    </div>
  );
}

export default ProfilePage;
