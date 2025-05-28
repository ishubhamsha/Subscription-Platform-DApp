import React, { useState } from 'react';
import { Clock, ArrowLeftRight, CheckCircle } from 'lucide-react';
import { useContract } from '../context/ContractContext';
import { useAssets } from '../context/AssetContext';
import { returnAsset } from '../../contract-service';

const MyLeases = () => {
  const { isContractConnected } = useContract();
  const { leases, loading, updateLease, refreshLeases } = useAssets();
  const [returning, setReturning] = useState<{[key: string]: boolean}>({});

  const handleReturnAsset = async (leaseId: number | string) => {
    if (!isContractConnected) {
      alert('Please connect to the contract first');
      return;
    }

    try {
      setReturning({ ...returning, [leaseId]: true });
      
      const result = await returnAsset(leaseId.toString());
      
      if (result.success) {
        alert(`Asset returned successfully! Transaction: ${result.transaction}`);
        // Update the lease status in the UI
        updateLease(leaseId, { status: 'completed' });
        // Refresh leases from the contract
        await refreshLeases();
      } else {
        alert('Failed to return asset');
      }
    } catch (error) {
      console.error('Error returning asset:', error);
      alert('Error returning asset');
    } finally {
      setReturning({ ...returning, [leaseId]: false });
    }
  };

  // Filter leases by status
  const activeLeases = leases.filter(lease => lease.status === 'active');
  const completedLeases = leases.filter(lease => lease.status === 'completed');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Leases</h1>
      
      {!isContractConnected && (
        <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-300 p-4 rounded-lg mb-6">
          <p>Connect your wallet and contract to view your leases.</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-8">
          <p>Loading your leases...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Leases */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Active Leases</h2>
            <div className="space-y-4">
              {activeLeases.length === 0 ? (
                <div className="text-center p-8 bg-secondary-light rounded-lg">
                  <p className="text-gray-400">You don't have any active leases.</p>
                </div>
              ) : (
                activeLeases.map((lease) => (
                  <div 
                    key={lease.id} 
                    className="bg-secondary-light rounded-lg p-6 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{lease.name}</h3>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{lease.startDate} - {lease.endDate}</span>
                        </div>
                        <div className="flex items-center">
                          <ArrowLeftRight className="h-4 w-4 mr-1" />
                          <span>{lease.price} XLM</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button 
                        className={`${returning[lease.id] ? 'bg-gray-600' : 'bg-primary hover:bg-primary-dark'} px-4 py-2 rounded-lg transition-colors`}
                        onClick={() => handleReturnAsset(lease.id)}
                        disabled={returning[lease.id]}
                      >
                        {returning[lease.id] ? 'Returning...' : 'Return Asset'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Leases */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Leases</h2>
            <div className="space-y-4">
              {completedLeases.length === 0 ? (
                <div className="text-center p-8 bg-secondary-light rounded-lg">
                  <p className="text-gray-400">You don't have any completed leases.</p>
                </div>
              ) : (
                completedLeases.map((lease) => (
                  <div 
                    key={lease.id} 
                    className="bg-secondary-light rounded-lg p-6 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{lease.name}</h3>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{lease.startDate} - {lease.endDate}</span>
                        </div>
                        <div className="flex items-center">
                          <ArrowLeftRight className="h-4 w-4 mr-1" />
                          <span>{lease.price} XLM</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span>Completed</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeases;