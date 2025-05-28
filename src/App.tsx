import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyLeases from './pages/MyLeases';
import ListAsset from './pages/ListAsset';
import { WalletProvider } from './context/WalletContext';
import { ContractProvider } from './context/ContractContext';
import { AssetProvider } from './context/AssetContext';

function App() {
  return (
    <WalletProvider>
      <ContractProvider>
        <AssetProvider>
          <Router>
            <div className="min-h-screen bg-secondary text-gray-100">
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/my-leases" element={<MyLeases />} />
                  <Route path="/list-asset" element={<ListAsset />} />
                </Routes>
              </div>
            </div>
          </Router>
        </AssetProvider>
      </ContractProvider>
    </WalletProvider>
  );
}

export default App;