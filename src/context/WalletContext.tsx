import React, { createContext, useContext, useState, useEffect } from 'react';
import { isConnected, getPublicKey } from '@stellar/freighter-api';

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connectWallet: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const checkConnection = async () => {
    const connected = await isConnected();
    setConnected(connected);
    if (connected) {
      const key = await getPublicKey();
      setPublicKey(key);
    }
  };

  const connectWallet = async () => {
    try {
      await checkConnection();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ connected, publicKey, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};