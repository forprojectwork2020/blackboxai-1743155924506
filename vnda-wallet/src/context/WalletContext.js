import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const savedWallet = await SecureStore.getItemAsync(STORAGE_KEYS.WALLET);
      if (savedWallet) {
        setWallet(JSON.parse(savedWallet));
      }
    } catch (err) {
      setError('Failed to load wallet');
      console.error('Error loading wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (mnemonic) => {
    try {
      // TODO: Implement wallet creation using TronWeb
      const newWallet = {
        mnemonic,
        address: '', // Will be generated
        balance: '0',
        tokens: [],
      };
      
      await SecureStore.setItemAsync(STORAGE_KEYS.WALLET, JSON.stringify(newWallet));
      setWallet(newWallet);
      return newWallet;
    } catch (err) {
      setError('Failed to create wallet');
      throw err;
    }
  };

  const importWallet = async (mnemonic) => {
    try {
      // TODO: Implement wallet import using TronWeb
      const importedWallet = {
        mnemonic,
        address: '', // Will be recovered
        balance: '0',
        tokens: [],
      };
      
      await SecureStore.setItemAsync(STORAGE_KEYS.WALLET, JSON.stringify(importedWallet));
      setWallet(importedWallet);
      return importedWallet;
    } catch (err) {
      setError('Failed to import wallet');
      throw err;
    }
  };

  const value = {
    wallet,
    loading,
    error,
    createWallet,
    importWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};