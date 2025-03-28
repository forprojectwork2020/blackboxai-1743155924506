import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
  const { wallet } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState('0');
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetchBalances();
  }, [wallet]);

  const fetchBalances = async () => {
    try {
      // TODO: Implement balance fetching using TronWeb
      setBalance('1000');
      setTokens([
        { symbol: 'TRX', name: 'TRON', balance: '1000', value: '0.08' },
        { symbol: 'USDT', name: 'Tether USD', balance: '100', value: '1.00' },
      ]);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalances();
    setRefreshing(false);
  };

  const HeaderRight = () => (
    <TouchableOpacity onPress={() => navigation.navigate('AddCoin')}>
      <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="VNDA Wallet" rightComponent={<HeaderRight />} />
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.balanceCard}>
          <Card.Content style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>${balance}</Text>
            
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Send')}
                style={styles.actionButton}
                icon="arrow-up-circle"
              >
                Send
              </Button>
              
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Receive')}
                style={styles.actionButton}
                icon="arrow-down-circle"
              >
                Receive
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Your Tokens</Text>
        
        {tokens.map((token, index) => (
          <Card
            key={token.symbol}
            style={[styles.tokenCard, index === 0 && styles.firstToken]}
            onPress={() => navigation.navigate('Send', { token })}
          >
            <Card.Content style={styles.tokenContent}>
              <View>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>
              
              <View style={styles.tokenBalanceContainer}>
                <Text style={styles.tokenBalance}>{token.balance}</Text>
                <Text style={styles.tokenValue}>${token.value}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
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
  balanceCard: {
    margin: SIZES.md,
    backgroundColor: COLORS.primary,
  },
  balanceContent: {
    alignItems: 'center',
    padding: SIZES.lg,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SIZES.xs,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: SIZES.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    marginBottom: SIZES.md,
  },
  tokenCard: {
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
  },
  firstToken: {
    marginTop: SIZES.xs,
  },
  tokenContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  tokenName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tokenBalanceContainer: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  tokenValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default HomeScreen;