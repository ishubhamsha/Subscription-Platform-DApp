import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { 
  CONTRACT_ADDRESS, 
  connectToContract,
  checkWalletConnection
// @ts-ignore
} from '../../contract-service';

interface ContractContextType {
  contractAddress: string;
  isContractConnected: boolean;
  connectContract: () => Promise<boolean>;
  connectionError: string | null;
}

const ContractContext = createContext<ContractContextType>({
  contractAddress: '',
  isContractConnected: false,
  connectContract: async () => false,
  connectionError: null
});

export const useContract = () => useContext(ContractContext);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected: walletConnected } = useWallet();
  const [isContractConnected, setIsContractConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connectContract = async (): Promise<boolean> => {
    try {
      if (!walletConnected) {
        setConnectionError('Wallet must be connected first');
        return false;
      }

      const isConnected = await connectToContract();
      setIsContractConnected(isConnected);
      
      if (!isConnected) {
        setConnectionError('Failed to connect to contract');
        return false;
      }
      
      setConnectionError(null);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error connecting to contract';
      setConnectionError(errorMessage);
      return false;
    }
  };

  // Try to connect to contract when wallet is connected
  useEffect(() => {
    if (walletConnected) {
      connectContract();
    } else {
      setIsContractConnected(false);
    }
  }, [walletConnected]);

  return (
    <ContractContext.Provider 
      value={{ 
        contractAddress: CONTRACT_ADDRESS, 
        isContractConnected, 
        connectContract,
        connectionError
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}; 