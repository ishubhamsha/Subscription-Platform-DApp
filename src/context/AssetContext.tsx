import React, { createContext, useContext, useState, useEffect } from 'react';
import { useContract } from './ContractContext';
import { getTotalLeases, viewLease } from '../../contract-service';

interface Asset {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
  image: string;
  status: 'available' | 'leased';
}

interface Lease {
  id: number | string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  price: string;
  assetId: number;
}

interface AssetContextType {
  assets: Asset[];
  leases: Lease[];
  addAsset: (asset: Asset) => void;
  addLease: (lease: Lease) => void;
  updateLease: (leaseId: number | string, updates: Partial<Lease>) => void;
  updateAssetStatus: (assetId: number, status: 'available' | 'leased') => void;
  loading: boolean;
  refreshLeases: () => Promise<void>;
}

const AssetContext = createContext<AssetContextType>({
  assets: [],
  leases: [],
  addAsset: () => {},
  addLease: () => {},
  updateLease: () => {},
  updateAssetStatus: () => {},
  loading: false,
  refreshLeases: async () => {},
});

export const useAssets = () => useContext(AssetContext);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isContractConnected } = useContract();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(false);

  const addAsset = (asset: Asset) => {
    setAssets(prev => [...prev, { ...asset, status: 'available' }]);
  };

  const addLease = (lease: Lease) => {
    setLeases(prev => [...prev, lease]);
    // Update asset status to leased
    updateAssetStatus(lease.assetId, 'leased');
  };

  const updateLease = (leaseId: number | string, updates: Partial<Lease>) => {
    setLeases(prev => prev.map(lease => {
      if (lease.id === leaseId) {
        const updatedLease = { ...lease, ...updates };
        // If lease is completed, update asset status back to available
        if (updates.status === 'completed') {
          updateAssetStatus(lease.assetId, 'available');
        }
        return updatedLease;
      }
      return lease;
    }));
  };

  const updateAssetStatus = (assetId: number, status: 'available' | 'leased') => {
    setAssets(prev => prev.map(asset => 
      asset.id === assetId ? { ...asset, status } : asset
    ));
  };

  const refreshLeases = async () => {
    if (!isContractConnected) return;
    
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const totalLeases = await getTotalLeases();
      const updatedLeases = await Promise.all(
        Array.from({ length: totalLeases }, (_, i) => viewLease(i.toString()))
      );
      
      setLeases(updatedLeases.map(lease => ({
        id: lease.id,
        name: lease.details.split(' - ')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: lease.status as 'active' | 'completed',
        price: lease.details.split(' - ')[1],
        assetId: parseInt(lease.id),
      })));

      // Update asset statuses based on leases
      updatedLeases.forEach(lease => {
        const assetId = parseInt(lease.id);
        updateAssetStatus(assetId, lease.status === 'active' ? 'leased' : 'available');
      });
    } catch (error) {
      console.error('Error refreshing leases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isContractConnected) {
      refreshLeases();
    }
  }, [isContractConnected]);

  return (
    <AssetContext.Provider 
      value={{ 
        assets, 
        leases, 
        addAsset, 
        addLease, 
        updateLease,
        updateAssetStatus,
        loading,
        refreshLeases
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}; 