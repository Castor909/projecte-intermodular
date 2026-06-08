import React, { useEffect, useRef, useState } from 'react';
import FeaturedAlbum from '../components/FeaturedAlbum';
import SpecialOffers from '../components/SpecialOffers';
import AlbumCard from '../components/AlbumCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { SkeletonCard } from '../components/SkeletonCard';
import { fetchAlbums, fetchGenres } from '../api/albums';
import { useDebounce } from '../useDebounce';

const LIMIT = 5;

function transformAlbum(album) {
  return {
    ...album,
    cover: album.coverUrl || album.cover,
    price: album.priceEth ? `${album.priceEth} ETH` : album.price,
  };
}

function CatalogPage() {
  const [albums, setAlbums] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadedPage, setLoadedPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortMode, setSortMode] = useState('featured');

  const debouncedSearch = useDebounce(searchTerm, 1000);
  const abortRef = useRef(null);

  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setAlbums([]);
    setLoadedPage(1);

    const params = {
      page: 1,
      limit: LIMIT,
      sort: sortMode,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(genreFilter !== 'all' && { genre: genreFilter }),
    };

    fetchAlbums(params)
      .then((data) => {
        if (controller.signal.aborted) return;
        setAlbums(data.albums.map(transformAlbum));
        setTotal(data.total);
        setTotalPages(data.pages);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err.message);
        setLoading(false);
      });
  }, [debouncedSearch, genreFilter, sortMode]);

  function loadMore() {
    const nextPage = loadedPage + 1;
    setLoadingMore(true);

    const params = {
      page: nextPage,
      limit: LIMIT,
      sort: sortMode,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(genreFilter !== 'all' && { genre: genreFilter }),
    };

    fetchAlbums(params)
      .then((data) => {
        setAlbums((prev) => [...prev, ...data.albums.map(transformAlbum)]);
        setLoadedPage(nextPage);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  }

  const hasMore = loadedPage < totalPages;

  if (loading) {
    return (
      <>
        <FeaturedAlbum />
        <SpecialOffers />
        <section className="catalog-toolbar-section">
          <div className="catalog-summary"><h2>New Arrivals</h2></div>
          <div className="catalog-grid">
            {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        </section>
      </>
    );
  }

  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <FeaturedAlbum />
      <SpecialOffers />
      <section className="catalog-toolbar-section">
        <div className="catalog-toolbar">
          <div className="catalog-toolbar__group">
            <label htmlFor="catalog-search">Search</label>
            <input
              id="catalog-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Title, artist, or genre"
            />
          </div>

          <div className="catalog-toolbar__group">
            <label htmlFor="catalog-genre">Genre</label>
            <select
              id="catalog-genre"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="all">All genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="catalog-toolbar__group">
            <label htmlFor="catalog-sort">Sort by</label>
            <select
              id="catalog-sort"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="featured">Featured first</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="price-asc">Price low-high</option>
              <option value="price-desc">Price high-low</option>
              <option value="year-desc">Newest first</option>
              <option value="year-asc">Oldest first</option>
              <option value="stock-desc">Stock high-low</option>
            </select>
          </div>
        </div>

        <div className="catalog-summary">
          <h2>New Arrivals</h2>
          <p>{total} result{total === 1 ? '' : 's'}</p>
        </div>

        {albums.length === 0 ? (
          <div className="catalog-empty-state">
            <h3>No matches found</h3>
            <p>Try a different search term, genre, or sort order.</p>
          </div>
        ) : (
          <>
            <div className="catalog-grid">
              {albums.map((album) => (
                <AlbumCard key={album._id || album.id} album={album} />
              ))}
              {loadingMore && Array.from({ length: 4 }, (_, i) => <SkeletonCard key={`more-${i}`} />)}
            </div>

            {hasMore && !loadingMore && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button className="btn-connect" onClick={loadMore}>
                  Load more ({albums.length} of {total})
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <RecentlyViewed />
    </>
  );
}

export default CatalogPage;
