import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="logo">VinylEth</div>
      <nav>
        <Link to="/">Catalog</Link>
        <Link to="/cart">Cart</Link>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
      <button className="btn-connect">Connect wallet</button>
    </header>
  );
}

export default Header;
