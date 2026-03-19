import React from 'react';

function Header() {
  return (
    <header>
      <div className="logo">VinylEth</div>
      <nav>
        <a href="#">Catalog</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
      <button className="btn-connect">Connect wallet</button>
    </header>
  );
}

export default Header;
