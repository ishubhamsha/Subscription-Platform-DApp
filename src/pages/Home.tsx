import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useContract } from '../context/ContractContext';
import { useAssets } from '../context/AssetContext';
import { leaseAsset } from '../../contract-service';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { connected, publicKey, connectWallet } = useWallet();
  const { contractAddress, isContractConnected, connectContract, connectionError } = useContract();
  const { assets, addLease, refreshLeases } = useAssets();
  const navigate = useNavigate();
  
  const handleLeaseNow = async (assetId: number) => {
    try {
      if (!isContractConnected) {
        alert('Please connect to the contract first');
        return;
      }

      const result = await leaseAsset(assetId.toString());
      if (result.success) {
        alert(`Asset leased successfully! Transaction: ${result.transaction}`);
        
        // Add the new lease to the state
        const asset = assets.find(a => a.id === assetId);
        if (asset) {
          addLease({
            id: result.transaction,
            name: asset.name,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + asset.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active',
            price: asset.price,
            assetId: asset.id,
          });
        }
        
        // Refresh leases from the contract
        await refreshLeases();
        
        // Navigate to My Leases page
        navigate('/my-leases');
      } else {
        alert('Failed to lease asset');
      }
    } catch (error) {
      console.error('Error leasing asset:', error);
      alert('Error leasing asset');
    }
  };
  
  // Filter to only show available assets
  const availableAssets = assets.filter(asset => asset.status === 'available');
  
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Decentralized Asset Leasing</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Lease physical and digital assets using Stellar blockchain technology. 
          Secure, transparent, and efficient.
        </p>
        
        {/* Contract Connection Status */}
        <div className="mt-6 p-4 bg-secondary-light rounded-lg max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-2">Contract Status</h3>
          
          {!connected && (
            <div className="mb-3">
              <p className="text-yellow-400 mb-2">Wallet not connected</p>
              <button 
                onClick={connectWallet}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}
          
          {connected && !isContractConnected && (
            <div className="mb-3">
              <p className="text-yellow-400 mb-2">
                Connected to wallet, but not to contract
                {connectionError && <span className="block text-red-400 mt-1">{connectionError}</span>}
              </p>
              <button 
                onClick={connectContract}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors"
              >
                Connect to Contract
              </button>
            </div>
          )}
          
          {isContractConnected && (
            <div className="text-green-400">
              <p>Connected to contract!</p>
              <p className="text-xs mt-1 break-all">Contract Address: {contractAddress}</p>
              <p className="text-xs mt-1 break-all">Your Wallet: {publicKey}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableAssets.length === 0 ? (
          <div className="col-span-full text-center p-8 bg-secondary-light rounded-lg">
            <p className="text-gray-400">No assets available for lease.</p>
          </div>
        ) : (
          availableAssets.map((asset) => (
            <div key={asset.id} className="bg-secondary-light rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <img 
                src={asset.image} 
                alt={asset.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{asset.name}</h3>
                <p className="text-gray-400 mb-4">{asset.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-primary">
                    <DollarSign className="h-5 w-5 mr-1" />
                    <span>{asset.price} XLM</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{asset.duration} days</span>
                  </div>
                </div>

                <button 
                  className={`w-full ${isContractConnected ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-500 cursor-not-allowed'} text-white py-2 rounded-lg transition-colors`}
                  disabled={!isContractConnected}
                  onClick={() => handleLeaseNow(asset.id)}
                >
                  {isContractConnected ? "Lease Now" : "Connect to Lease"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;