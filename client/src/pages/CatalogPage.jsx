import React, { useEffect, useState } from 'react';
import FeaturedAlbum from '../components/FeaturedAlbum';
import SpecialOffers from '../components/SpecialOffers';
import AlbumCard from '../components/AlbumCard';
import { fetchAlbums } from '../api/albums';

function sortAlbums(albums, sortMode) {
  const sorted = [...albums];

  switch (sortMode) {
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'price-asc':
      sorted.sort((a, b) => a.priceEth - b.priceEth);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.priceEth - a.priceEth);
      break;
    case 'year-desc':
      sorted.sort((a, b) => b.year - a.year);
      break;
    case 'year-asc':
      sorted.sort((a, b) => a.year - b.year);
      break;
    case 'stock-desc':
      sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));
      break;
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return sorted;
}

function CatalogPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortMode, setSortMode] = useState('featured');

  useEffect(() => {
    fetchAlbums()
      .then((data) => {
        const transformed = data.map((album) => ({
          ...album,
          cover: album.coverUrl || album.cover,
          price: album.priceEth ? `${album.priceEth} ETH` : album.price,
        }));
        setAlbums(transformed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const genres = [...new Set(albums.map((album) => album.genre))].sort((a, b) => a.localeCompare(b));

  const visibleAlbums = sortAlbums(
    albums.filter((album) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [album.title, album.artist, album.genre]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedSearch));
      const matchesGenre = genreFilter === 'all' || album.genre === genreFilter;

      return matchesSearch && matchesGenre;
    }),
    sortMode
  );

  if (loading) return <div style={{ padding: 40 }}>Loading albums...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (albums.length === 0) return <div style={{ padding: 40 }}>No albums found.</div>;

  return (
    <>
      <FeaturedAlbum album={albums[0]} />
      <SpecialOffers albums={albums} />
      <section className="catalog-toolbar-section">
        <div className="catalog-toolbar">
          <div className="catalog-toolbar__group">
            <label htmlFor="catalog-search">Search</label>
            <input
              id="catalog-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Title, artist, or genre"
            />
          </div>

          <div className="catalog-toolbar__group">
            <label htmlFor="catalog-genre">Genre</label>
            <select
              id="catalog-genre"
              value={genreFilter}
              onChange={(event) => setGenreFilter(event.target.value)}
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
              onChange={(event) => setSortMode(event.target.value)}
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
          <p>{visibleAlbums.length} result{visibleAlbums.length === 1 ? '' : 's'}</p>
        </div>

        {visibleAlbums.length === 0 ? (
          <div className="catalog-empty-state">
            <h3>No matches found</h3>
            <p>Try a different search term, genre, or sort order.</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {visibleAlbums.map((album) => (
              <AlbumCard key={album._id || album.id} album={album} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default CatalogPage;
