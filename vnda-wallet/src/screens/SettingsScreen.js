import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { useWallet } from '../context/WalletContext';
import { COLORS, SIZES, STORAGE_KEYS } from '../constants';
import Header from '../components/Header';

const SettingsScreen = ({ navigation }) => {
  const { wallet } = useWallet();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleToggleBiometric = async () => {
    // TODO: Implement biometric authentication
    setBiometricEnabled(!biometricEnabled);
  };

  const handleShowMnemonic = () => {
    setShowMnemonic(true);
  };

  const handleVerifyPassword = async () => {
    try {
      // TODO: Implement proper password verification
      if (password === '123456') {
        setShowMnemonic(false);
        setPassword('');
        Alert.alert(
          'Recovery Phrase',
          wallet?.mnemonic || 'No recovery phrase found',
          [{ text: 'OK' }]
        );
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Failed to verify password');
    }
  };

  const handleDeleteWallet = async () => {
    Alert.alert(
      'Delete Wallet',
      'Are you sure you want to delete your wallet? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync(STORAGE_KEYS.WALLET);
              navigation.reset({
                index: 0,
                routes: [{ name: 'WalletSetup' }],
              });
            } catch (error) {
              console.error('Error deleting wallet:', error);
              Alert.alert('Error', 'Failed to delete wallet');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Security</List.Subheader>
          
          <List.Item
            title="Biometric Authentication"
            description="Use fingerprint or face ID to secure your wallet"
            left={props => <List.Icon {...props} icon="fingerprint" />}
            right={() => (
              <Switch
                value={biometricEnabled}
                onValueChange={handleToggleBiometric}
              />
            )}
          />
          
          <List.Item
            title="View Recovery Phrase"
            description="Show your 12-word recovery phrase"
            left={props => <List.Icon {...props} icon="key" />}
            onPress={handleShowMnemonic}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => {/* TODO: Implement */}}
          />
          
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {/* TODO: Implement */}}
          />
        </List.Section>

        <View style={styles.deleteSection}>
          <Button
            mode="contained"
            onPress={handleDeleteWallet}
            style={styles.deleteButton}
            buttonColor={COLORS.error}
          >
            Delete Wallet
          </Button>
        </View>

        <Portal>
          <Dialog visible={showMnemonic} onDismiss={() => setShowMnemonic(false)}>
            <Dialog.Title>Enter Password</Dialog.Title>
            <Dialog.Content>
              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry
                error={!!error}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowMnemonic(false)}>Cancel</Button>
              <Button onPress={handleVerifyPassword}>Verify</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  deleteSection: {
    padding: SIZES.xl,
  },
  deleteButton: {
    width: '100%',
  },
  error: {
    color: COLORS.error,
    marginTop: SIZES.xs,
  },
});

export default SettingsScreen;