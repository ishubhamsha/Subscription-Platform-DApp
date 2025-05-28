import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Home, List, Package } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
  const { connected, connectWallet, publicKey } = useWallet();

  return (
    <nav className="bg-secondary-light py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">StellarLease</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-primary transition-colors">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link to="/my-leases" className="flex items-center space-x-1 hover:text-primary transition-colors">
              <List className="h-5 w-5" />
              <span>My Leases</span>
            </Link>
            
            <Link to="/list-asset" className="flex items-center space-x-1 hover:text-primary transition-colors">
              <Package className="h-5 w-5" />
              <span>List Asset</span>
            </Link>
            
            <button
              onClick={connectWallet}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg transition-colors"
            >
              <Wallet className="h-5 w-5" />
              <span>
                {connected
                  ? `${publicKey?.slice(0, 6)}...${publicKey?.slice(-4)}`
                  : 'Connect Wallet'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;