import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';

const TransactionItem = ({ transaction }) => {
  const isIncoming = transaction.type === 'incoming';
  
  return (
    <Card style={styles.transactionCard}>
      <Card.Content style={styles.transactionContent}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isIncoming ? 'arrow-down-circle' : 'arrow-up-circle'}
            size={24}
            color={isIncoming ? COLORS.success : COLORS.primary}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.transactionType}>
            {isIncoming ? 'Received' : 'Sent'}
          </Text>
          <Text style={styles.transactionDate}>
            {new Date(transaction.timestamp).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[
            styles.transactionAmount,
            { color: isIncoming ? COLORS.success : COLORS.text }
          ]}>
            {isIncoming ? '+' : '-'} {transaction.amount} {transaction.token}
          </Text>
          <Text style={styles.transactionValue}>
            ${transaction.value}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const TransactionsScreen = () => {
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [wallet]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // TODO: Implement transaction fetching using TronWeb
      const mockTransactions = [
        {
          id: '1',
          type: 'incoming',
          amount: '100',
          token: 'TRX',
          value: '8.00',
          timestamp: Date.now() - 3600000,
        },
        {
          id: '2',
          type: 'outgoing',
          amount: '50',
          token: 'USDT',
          value: '50.00',
          timestamp: Date.now() - 7200000,
        },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time" size={48} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>No transactions yet</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Transactions" />
      
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.md,
    flexGrow: 1,
  },
  transactionCard: {
    marginBottom: SIZES.md,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  detailsContainer: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SIZES.md,
  },
});

export default TransactionsScreen;