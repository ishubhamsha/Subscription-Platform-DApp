import React, { useState } from 'react';
import { Package, DollarSign, Clock, FileText } from 'lucide-react';
import { useContract } from '../context/ContractContext';
import { useAssets } from '../context/AssetContext';
import { createLease } from '../../contract-service';
import { useNavigate } from 'react-router-dom';

interface AssetFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
}

const ListAsset = () => {
  const { isContractConnected } = useContract();
  const { addAsset, refreshLeases } = useAssets();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isContractConnected) {
      alert('Please connect to the contract first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call contract to create a lease
      const result = await createLease(formData);
      
      if (result.success) {
        // Add the new asset to the state with available status
        addAsset({
          id: parseInt(result.id),
          name: formData.name,
          description: formData.description,
          price: formData.price,
          duration: parseInt(formData.duration),
          image: formData.image,
          status: 'available'
        });
        
        alert(`Asset listed successfully! Lease ID: ${result.id}`);
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          duration: '',
          image: '',
        });
        // Refresh leases from the contract
        await refreshLeases();
        // Navigate to My Leases page
        navigate('/my-leases');
      } else {
        alert('Failed to list asset');
      }
    } catch (error) {
      console.error('Error listing asset:', error);
      alert('Error listing asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">List New Asset</h1>
      
      {!isContractConnected && (
        <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-300 p-4 rounded-lg mb-6">
          <p>Connect your wallet and contract to list assets.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary-light p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center mb-1">
                <Package className="h-4 w-4 mr-2" />
                <span>Asset Name</span>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-secondary border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="Enter asset name"
                required
                disabled={!isContractConnected || isSubmitting}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center mb-1">
                <FileText className="h-4 w-4 mr-2" />
                <span>Description</span>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-secondary border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="Describe your asset"
                rows={4}
                required
                disabled={!isContractConnected || isSubmitting}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center mb-1">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Price (XLM)</span>
                </div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-secondary border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  disabled={!isContractConnected || isSubmitting}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Duration (days)</span>
                </div>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-secondary border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="1"
                  min="1"
                  required
                  disabled={!isContractConnected || isSubmitting}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <span>Image URL</span>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-secondary border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="https://example.com/image.jpg"
                required
                disabled={!isContractConnected || isSubmitting}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full ${(!isContractConnected || isSubmitting) ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} text-white py-3 rounded-lg transition-colors font-medium`}
          disabled={!isContractConnected || isSubmitting}
        >
          {isSubmitting ? 'Listing Asset...' : 'List Asset'}
        </button>
      </form>
    </div>
  );
};

export default ListAsset;