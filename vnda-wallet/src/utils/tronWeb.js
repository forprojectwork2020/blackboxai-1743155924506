import TronWeb from 'tronweb';

const TRON_FULL_NODE = 'https://api.trongrid.io';
const TRON_SOLIDITY_NODE = 'https://api.trongrid.io';
const TRON_EVENT_SERVER = 'https://api.trongrid.io';

export const initTronWeb = (privateKey = null) => {
  const tronWeb = new TronWeb(
    TRON_FULL_NODE,
    TRON_SOLIDITY_NODE,
    TRON_EVENT_SERVER,
    privateKey
  );
  return tronWeb;
};

export const generateMnemonic = () => {
  // TronWeb doesn't provide mnemonic generation
  // Using TronWeb's utils to generate a private key instead
  const tronWeb = initTronWeb();
  const account = tronWeb.createAccount();
  return {
    privateKey: account.privateKey,
    address: account.address.base58
  };
};

export const importWallet = async (privateKey) => {
  try {
    const tronWeb = initTronWeb(privateKey);
    const address = tronWeb.address.fromPrivateKey(privateKey);
    return {
      privateKey,
      address
    };
  } catch (error) {
    throw new Error('Invalid private key');
  }
};

export const getBalance = async (address) => {
  try {
    const tronWeb = initTronWeb();
    const balance = await tronWeb.trx.getBalance(address);
    return tronWeb.fromSun(balance);
  } catch (error) {
    throw new Error('Failed to fetch balance');
  }
};

export const getTokenBalance = async (address, contractAddress) => {
  try {
    const tronWeb = initTronWeb();
    const contract = await tronWeb.contract().at(contractAddress);
    const balance = await contract.balanceOf(address).call();
    const decimals = await contract.decimals().call();
    return balance / Math.pow(10, decimals);
  } catch (error) {
    throw new Error('Failed to fetch token balance');
  }
};

export const sendTrx = async (privateKey, toAddress, amount) => {
  try {
    const tronWeb = initTronWeb(privateKey);
    const transaction = await tronWeb.trx.sendTransaction(
      toAddress,
      tronWeb.toSun(amount)
    );
    return transaction;
  } catch (error) {
    throw new Error('Failed to send TRX');
  }
};

export const sendToken = async (privateKey, contractAddress, toAddress, amount, decimals) => {
  try {
    const tronWeb = initTronWeb(privateKey);
    const contract = await tronWeb.contract().at(contractAddress);
    const transaction = await contract.transfer(
      toAddress,
      amount * Math.pow(10, decimals)
    ).send();
    return transaction;
  } catch (error) {
    throw new Error('Failed to send token');
  }
};

export const getTokenInfo = async (contractAddress) => {
  try {
    const tronWeb = initTronWeb();
    const contract = await tronWeb.contract().at(contractAddress);
    
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name().call(),
      contract.symbol().call(),
      contract.decimals().call(),
      contract.totalSupply().call()
    ]);

    return {
      name,
      symbol,
      decimals,
      totalSupply: totalSupply / Math.pow(10, decimals)
    };
  } catch (error) {
    throw new Error('Failed to fetch token information');
  }
};

export const getTransactionInfo = async (txId) => {
  try {
    const tronWeb = initTronWeb();
    const info = await tronWeb.trx.getTransaction(txId);
    return info;
  } catch (error) {
    throw new Error('Failed to fetch transaction information');
  }
};