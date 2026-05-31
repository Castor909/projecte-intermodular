import React from 'react';

export function SkeletonCard() {
  return (
    <div className="album-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton--cover" />
      <div className="skeleton skeleton--line skeleton--title" />
      <div className="skeleton skeleton--line skeleton--artist" />
      <div className="skeleton skeleton--line skeleton--price" />
      <div className="skeleton skeleton--btn" />
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="skeleton-detail" aria-hidden="true">
      <div className="skeleton skeleton--cover-lg" />
      <div className="skeleton-detail__info">
        <div className="skeleton skeleton--line skeleton--h2" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
        <div className="skeleton skeleton--line skeleton--price" />
        <div className="skeleton skeleton--btn-lg" />
      </div>
    </div>
  );
}
