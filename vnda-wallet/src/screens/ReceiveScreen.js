import React from 'react';
import { View, Text, StyleSheet, Share, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useWallet } from '../context/WalletContext';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';

const ReceiveScreen = () => {
  const { wallet } = useWallet();
  const address = wallet?.address || '';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My TRON wallet address: ${address}`,
      });
    } catch (error) {
      console.error('Error sharing address:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setString(address);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error copying address:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Receive" showBack />
      
      <ScrollView style={styles.content}>
        <Card style={styles.qrCard}>
          <Card.Content style={styles.qrContent}>
            <Text style={styles.title}>Your Wallet Address</Text>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={address}
                size={200}
                backgroundColor={COLORS.surface}
                color={COLORS.text}
              />
            </View>

            <Text style={styles.address} numberOfLines={2}>
              {address}
            </Text>

            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleCopy}
                icon="content-copy"
                style={styles.button}
              >
                Copy Address
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleShare}
                icon="share-variant"
                style={styles.button}
              >
                Share Address
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>Important</Text>
            <Text style={styles.infoText}>
              • Only send TRON (TRX) and TRC20 tokens to this address{'\n'}
              • Sending any other types of tokens may result in permanent loss{'\n'}
              • Double check the address before sending
            </Text>
          </Card.Content>
        </Card>
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
  qrCard: {
    margin: SIZES.md,
  },
  qrContent: {
    alignItems: 'center',
    padding: SIZES.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  qrContainer: {
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    marginBottom: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  address: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.lg,
    paddingHorizontal: SIZES.md,
  },
  actions: {
    width: '100%',
    gap: SIZES.md,
  },
  button: {
    width: '100%',
  },
  infoCard: {
    margin: SIZES.md,
    marginTop: 0,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default ReceiveScreen;