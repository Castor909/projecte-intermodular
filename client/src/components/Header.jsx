import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';

function Header() {
  const { user, logout } = useAuth();
  const [walletState, setWalletState] = useState('idle');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState('');
  const [walletTriedToConnect, setWalletTriedToConnect] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let activeProvider = null;

    async function loadExistingSession(provider) {
      try {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (!isMounted) return;
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletState('connected');
        } else {
          setWalletState('idle');
        }
      } catch {
        if (!isMounted) return;
        setWalletState('error');
        setWalletError('Failed to read wallet state.');
      }
    }

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        setWalletAddress('');
        setWalletState('idle');
        return;
      }

      setWalletAddress(accounts[0]);
      setWalletState('connected');
      setWalletError('');
    }

    function setupProvider() {
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        return;
      }

      if (activeProvider === window.ethereum) {
        return;
      }

      activeProvider = window.ethereum;
      loadExistingSession(activeProvider);
      activeProvider.on('accountsChanged', handleAccountsChanged);
    }

    setupProvider();
    window.addEventListener('ethereum#initialized', setupProvider, { once: true });
    const walletProbeTimeout = window.setTimeout(setupProvider, 700);

    return () => {
      isMounted = false;
      window.clearTimeout(walletProbeTimeout);
      window.removeEventListener('ethereum#initialized', setupProvider);
      if (activeProvider?.removeListener) {
        activeProvider.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  async function connectWallet() {
    setWalletTriedToConnect(true);

    const provider = typeof window !== 'undefined' ? window.ethereum : undefined;

    if (!provider) {
      setWalletState('unavailable');
      setWalletError('MetaMask is not installed.');
      return;
    }

    setWalletState('connecting');
    setWalletError('');

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        setWalletState('idle');
        return;
      }

      setWalletAddress(accounts[0]);
      setWalletState('connected');
    } catch (err) {
      const errorCode = err?.code;
      if (errorCode === 4001) {
        setWalletError('Connection request was rejected.');
      } else {
        setWalletError('Could not connect wallet.');
      }
      setWalletState('error');
    }
  }

  function disconnectWallet() {
    setWalletAddress('');
    setWalletState('idle');
    setWalletError('Disconnected in app. You may still be connected in MetaMask.');
  }

  const walletLabel = useMemo(() => {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const isConnected = walletState === 'connected' && Boolean(walletAddress);

  return (
    <header>
      <div className="logo">VinylEth</div>
      <nav>
        <Link to="/">Catalog</Link>
        <Link to="/cart">Cart</Link>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
      <div className="auth-box">
        {user ? (
          <>
            <Link to="/profile" className="auth-link">Profile</Link>
            <Link to="/orders" className="auth-link">My orders</Link>
            <span className="auth-email">{user.email}</span>
            <button className="btn-secondary auth-btn" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">Log in</Link>
            <Link to="/register" className="btn-connect auth-btn">Register</Link>
          </>
        )}
      </div>
      <div className="wallet-box">
        {isConnected ? (
          <>
            <span className="wallet-badge">{walletLabel}</span>
            <button className="btn-connect" onClick={disconnectWallet}>Disconnect</button>
          </>
        ) : (
          <button
            className="btn-connect"
            onClick={connectWallet}
            disabled={walletState === 'connecting'}
          >
            {walletState === 'connecting' ? 'Connecting...' : 'Connect wallet'}
          </button>
        )}
        {walletState === 'unavailable' && walletTriedToConnect && (
          <span className="wallet-status">MetaMask not found</span>
        )}
        {walletError && walletState !== 'unavailable' && (
          <span className="wallet-status">{walletError}</span>
        )}
      </div>
    </header>
  );
}

export default Header;
