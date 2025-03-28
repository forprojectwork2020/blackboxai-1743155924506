import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import { useWallet } from '../context/WalletContext';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';

const SendScreen = ({ navigation, route }) => {
  const { wallet } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedToken = route.params?.token || { symbol: 'TRX', balance: '0' };

  const handleSend = async () => {
    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // TODO: Implement send transaction using TronWeb
      // const tx = await tronWeb.trx.sendTransaction(recipient, amount);
      
      navigation.navigate('Transactions');
    } catch (err) {
      setError('Failed to send transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Send" showBack />
      
      <ScrollView style={styles.content}>
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>
              {selectedToken.balance} {selectedToken.symbol}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Recipient Address"
            value={recipient}
            onChangeText={setRecipient}
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            mode="outlined"
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            style={styles.input}
            right={<TextInput.Affix text={selectedToken.symbol} />}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleSend}
            loading={loading}
            disabled={!recipient || !amount || loading}
            style={styles.button}
          >
            Send {selectedToken.symbol}
          </Button>
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
  balanceCard: {
    margin: SIZES.md,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  form: {
    padding: SIZES.md,
  },
  input: {
    marginBottom: SIZES.md,
  },
  button: {
    marginTop: SIZES.md,
  },
  error: {
    color: COLORS.error,
    marginBottom: SIZES.md,
  },
});

export default SendScreen;