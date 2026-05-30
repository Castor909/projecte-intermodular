import React, { useState } from 'react';

const EMPTY_FORM = {
  title: '',
  artist: '',
  year: '',
  genre: '',
  priceEth: '',
  coverUrl: '',
  stock: '',
  description: '',
  featured: false,
  audioUrl: '',
  label: '',
  country: '',
  vinylFormat: '',
  barcode: '',
};

function toFormValues(album) {
  if (!album) return EMPTY_FORM;
  return {
    title: album.title || '',
    artist: album.artist || '',
    year: album.year !== undefined ? String(album.year) : '',
    genre: album.genre || '',
    priceEth: album.priceEth !== undefined ? String(album.priceEth) : '',
    coverUrl: album.coverUrl || '',
    stock: album.stock !== undefined ? String(album.stock) : '',
    description: album.description || '',
    featured: album.featured || false,
    audioUrl: album.audioUrl || '',
    label: album.label || '',
    country: album.country || '',
    vinylFormat: album.vinylFormat || '',
    barcode: album.barcode || '',
  };
}

function toTracksValues(album) {
  if (!album?.tracks?.length) return [{ title: '', duration: '' }];
  return album.tracks.map((t) => ({ title: t.title || '', duration: t.duration || '' }));
}

function validate(form) {
  const errs = {};
  if (!form.title.trim()) errs.title = 'Required';
  if (!form.artist.trim()) errs.artist = 'Required';
  if (!form.year.trim()) errs.year = 'Required';
  else if (Number.isNaN(Number(form.year))) errs.year = 'Must be a number';
  if (!form.genre.trim()) errs.genre = 'Required';
  if (!form.priceEth.trim()) errs.priceEth = 'Required';
  else if (Number.isNaN(Number(form.priceEth)) || Number(form.priceEth) < 0) errs.priceEth = 'Must be ≥ 0';
  if (!form.coverUrl.trim()) errs.coverUrl = 'Required';
  if (!form.stock.trim()) errs.stock = 'Required';
  else if (Number.isNaN(Number(form.stock)) || Number(form.stock) < 0) errs.stock = 'Must be ≥ 0';
  if (!form.description.trim()) errs.description = 'Required';
  return errs;
}

function AdminAlbumForm({ initialAlbum, onSave, onCancel, saving, saveError }) {
  const [form, setForm] = useState(() => toFormValues(initialAlbum));
  const [tracks, setTracks] = useState(() => toTracksValues(initialAlbum));
  const [errors, setErrors] = useState({});
  const [coverError, setCoverError] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'coverUrl') setCoverError(false);
  }

  function handleTrackChange(index, field, value) {
    setTracks((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }

  function addTrack() {
    setTracks((prev) => [...prev, { title: '', duration: '' }]);
  }

  function removeTrack(index) {
    setTracks((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      title: form.title.trim(),
      artist: form.artist.trim(),
      year: Number(form.year),
      genre: form.genre.trim(),
      priceEth: Number(form.priceEth),
      coverUrl: form.coverUrl.trim(),
      stock: Number(form.stock),
      description: form.description.trim(),
      featured: form.featured,
    };

    if (form.audioUrl.trim()) payload.audioUrl = form.audioUrl.trim();
    if (form.label.trim()) payload.label = form.label.trim();
    if (form.country.trim()) payload.country = form.country.trim();
    if (form.vinylFormat.trim()) payload.vinylFormat = form.vinylFormat.trim();
    if (form.barcode.trim()) payload.barcode = form.barcode.trim();

    const filled = tracks.filter((t) => t.title.trim());
    payload.tracks = filled.map((t) => ({
      title: t.title.trim(),
      ...(t.duration.trim() && { duration: t.duration.trim() }),
    }));

    onSave(payload);
  }

  const isEditing = Boolean(initialAlbum);

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <h2 className="admin-form__title">{isEditing ? 'Edit Album' : 'Add New Album'}</h2>

      {saveError && <p className="notice warning">{saveError}</p>}

      {/* Basic Info */}
      <section className="admin-form__section">
        <h3>Basic Info</h3>
        <div className="admin-form__row">
          <div className="form-field">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>
          <div className="form-field">
            <label>Artist *</label>
            <input name="artist" value={form.artist} onChange={handleChange} />
            {errors.artist && <span className="field-error">{errors.artist}</span>}
          </div>
        </div>
        <div className="admin-form__row admin-form__row--4">
          <div className="form-field">
            <label>Year *</label>
            <input name="year" type="number" value={form.year} onChange={handleChange} />
            {errors.year && <span className="field-error">{errors.year}</span>}
          </div>
          <div className="form-field">
            <label>Genre *</label>
            <input name="genre" value={form.genre} onChange={handleChange} />
            {errors.genre && <span className="field-error">{errors.genre}</span>}
          </div>
          <div className="form-field">
            <label>Price (ETH) *</label>
            <input name="priceEth" type="number" step="0.001" min="0" value={form.priceEth} onChange={handleChange} />
            {errors.priceEth && <span className="field-error">{errors.priceEth}</span>}
          </div>
          <div className="form-field">
            <label>Stock *</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
            {errors.stock && <span className="field-error">{errors.stock}</span>}
          </div>
        </div>
        <div className="form-field">
          <label className="admin-checkbox-label">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
            Featured (appears in Special Offers)
          </label>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>
      </section>

      {/* Media */}
      <section className="admin-form__section">
        <h3>Media</h3>
        <div className="admin-form__cover-row">
          <div className="form-field" style={{ flex: 1 }}>
            <label>Cover URL *</label>
            <input name="coverUrl" value={form.coverUrl} onChange={handleChange} placeholder="https://..." />
            {errors.coverUrl && <span className="field-error">{errors.coverUrl}</span>}
          </div>
          {form.coverUrl && !coverError && (
            <img
              src={form.coverUrl}
              alt="preview"
              className="admin-cover-preview"
              onError={() => setCoverError(true)}
            />
          )}
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Audio preview URL</label>
          <input name="audioUrl" value={form.audioUrl} onChange={handleChange} placeholder="https://..." />
        </div>
      </section>

      {/* Vinyl Specs */}
      <section className="admin-form__section">
        <h3>Vinyl Specs <span className="admin-section-hint">(optional)</span></h3>
        <div className="admin-form__row admin-form__row--4">
          <div className="form-field">
            <label>Label</label>
            <input name="label" value={form.label} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Country</label>
            <input name="country" value={form.country} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Format</label>
            <input name="vinylFormat" value={form.vinylFormat} onChange={handleChange} placeholder='12" Vinyl' />
          </div>
          <div className="form-field">
            <label>Barcode</label>
            <input name="barcode" value={form.barcode} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* Tracklist */}
      <section className="admin-form__section">
        <h3>Tracklist <span className="admin-section-hint">(optional)</span></h3>
        {tracks.map((track, i) => (
          <div key={i} className="admin-track-row">
            <span className="admin-track-num">{i + 1}.</span>
            <input
              value={track.title}
              onChange={(e) => handleTrackChange(i, 'title', e.target.value)}
              placeholder="Track title"
              className="admin-track-title"
            />
            <input
              value={track.duration}
              onChange={(e) => handleTrackChange(i, 'duration', e.target.value)}
              placeholder="3:45"
              className="admin-track-duration"
            />
            <button
              type="button"
              className="btn-secondary admin-btn-small"
              onClick={() => removeTrack(i)}
              aria-label="Remove track"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={addTrack} style={{ marginTop: 8 }}>
          + Add track
        </button>
      </section>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-connect" disabled={saving} style={{ padding: '12px 28px' }}>
          {saving ? 'Saving...' : (isEditing ? 'Save changes' : 'Add Album')}
        </button>
      </div>
    </form>
  );
}

export default AdminAlbumForm;
