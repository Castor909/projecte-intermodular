import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="not-found-page">
      <p className="not-found-code">404</p>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-sub">The record you're looking for isn't in the catalog.</p>
      <button className="btn-connect" onClick={() => navigate('/')}>
        ← Back to catalog
      </button>
    </div>
  );
}

export default NotFoundPage;
