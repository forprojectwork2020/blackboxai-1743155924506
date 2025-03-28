import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, List } from 'react-native-paper';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';
import { useWallet } from '../context/WalletContext';
import { getTokenInfo } from '../utils/tronWeb';

const AddCoinScreen = ({ navigation }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  const popularTokens = [
    {
      symbol: 'USDT',
      name: 'Tether USD',
      contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      contractAddress: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    },
    {
      symbol: 'WIN',
      name: 'WINK',
      contractAddress: 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7',
    },
  ];

  const { addToken } = useWallet();

  const handleSearch = async () => {
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const tokenInfo = await getTokenInfo(contractAddress.trim());
      setTokenInfo({
        ...tokenInfo,
        contractAddress: contractAddress.trim()
      });
    } catch (err) {
      setError('Failed to fetch token information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToken = async (token) => {
    try {
      setLoading(true);
      await addToken(token.contractAddress);
      navigation.goBack();
    } catch (err) {
      setError('Failed to add token');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Token" showBack />
      
      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <TextInput
            mode="outlined"
            label="Contract Address"
            value={contractAddress}
            onChangeText={text => {
              setContractAddress(text);
              setError('');
              setTokenInfo(null);
            }}
            style={styles.input}
            autoCapitalize="none"
          />

          <Button
            mode="contained"
            onPress={handleSearch}
            loading={loading}
            disabled={!contractAddress.trim() || loading}
            style={styles.searchButton}
          >
            Search
          </Button>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {tokenInfo && (
          <View style={styles.tokenInfoSection}>
            <Text style={styles.sectionTitle}>Token Information</Text>
            
            <List.Item
              title={tokenInfo.name}
              description={`Symbol: ${tokenInfo.symbol}`}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleAddToken(tokenInfo)}
                  loading={loading}
                >
                  Add
                </Button>
              )}
            />
          </View>
        )}

        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Tokens</Text>
          
          {popularTokens.map((token) => (
            <List.Item
              key={token.contractAddress}
              title={token.name}
              description={`Symbol: ${token.symbol}`}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleAddToken(token)}
                  loading={loading}
                >
                  Add
                </Button>
              )}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: SIZES.md,
  },
  input: {
    marginBottom: SIZES.md,
  },
  searchButton: {
    marginBottom: SIZES.md,
  },
  error: {
    color: COLORS.error,
    marginBottom: SIZES.md,
  },
  tokenInfoSection: {
    marginBottom: SIZES.xl,
  },
  popularSection: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
  },
});

export default AddCoinScreen;