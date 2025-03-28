import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

// Import screens (will create these next)
import HomeScreen from '../screens/HomeScreen';
import WalletSetupScreen from '../screens/WalletSetupScreen';
import SendScreen from '../screens/SendScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddCoinScreen from '../screens/AddCoinScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Send':
              iconName = focused ? 'arrow-up-circle' : 'arrow-up-circle-outline';
              break;
            case 'Receive':
              iconName = focused ? 'arrow-down-circle' : 'arrow-down-circle-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          borderTopColor: COLORS.border,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Send" component={SendScreen} />
      <Tab.Screen name="Receive" component={ReceiveScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="WalletSetup" component={WalletSetupScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="AddCoin" component={AddCoinScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;