import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useWallet } from '../context/WalletContext';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';

const WalletSetupScreen = ({ navigation }) => {
  const [mode, setMode] = useState('select'); // 'select', 'create', 'import'
  const [mnemonic, setMnemonic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createWallet, importWallet } = useWallet();

  const handleCreateWallet = async () => {
    try {
      setLoading(true);
      setError('');
      // TODO: Generate mnemonic using TronWeb
      const generatedMnemonic = 'test test test test test test test test test test test test';
      await createWallet(generatedMnemonic);
      navigation.replace('MainApp');
    } catch (err) {
      setError('Failed to create wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportWallet = async () => {
    try {
      setLoading(true);
      setError('');
      await importWallet(mnemonic);
      navigation.replace('MainApp');
    } catch (err) {
      setError('Failed to import wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderSelectMode = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to VNDA Wallet</Text>
      <Text style={styles.subtitle}>Secure TRC20 Wallet</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => setMode('create')}
          style={styles.button}
        >
          Create New Wallet
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => setMode('import')}
          style={styles.button}
        >
          Import Existing Wallet
        </Button>
      </View>
    </View>
  );

  const renderCreateWallet = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Wallet</Text>
      <Text style={styles.description}>
        We'll generate a secure wallet for you. Make sure to save your recovery phrase!
      </Text>
      
      <Button
        mode="contained"
        onPress={handleCreateWallet}
        loading={loading}
        style={styles.button}
      >
        Generate Wallet
      </Button>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button
        mode="text"
        onPress={() => setMode('select')}
        style={styles.button}
      >
        Go Back
      </Button>
    </ScrollView>
  );

  const renderImportWallet = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Import Wallet</Text>
      <Text style={styles.description}>
        Enter your 12-word recovery phrase to restore your wallet
      </Text>
      
      <TextInput
        mode="outlined"
        label="Recovery Phrase"
        value={mnemonic}
        onChangeText={setMnemonic}
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleImportWallet}
        loading={loading}
        disabled={!mnemonic.trim()}
        style={styles.button}
      >
        Import Wallet
      </Button>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button
        mode="text"
        onPress={() => setMode('select')}
        style={styles.button}
      >
        Go Back
      </Button>
    </ScrollView>
  );

  const renderContent = () => {
    switch (mode) {
      case 'create':
        return renderCreateWallet();
      case 'import':
        return renderImportWallet();
      default:
        return renderSelectMode();
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="VNDA Wallet" />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SIZES.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xl,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: SIZES.md,
  },
  button: {
    width: '100%',
    marginVertical: SIZES.xs,
  },
  input: {
    width: '100%',
    marginBottom: SIZES.md,
  },
  error: {
    color: COLORS.error,
    marginTop: SIZES.md,
    textAlign: 'center',
  },
});

export default WalletSetupScreen;