import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import MainTabs from './src/navigation/MainTabs';
import { InventoryProvider } from './src/context/InventoryContext';
import { CustomerProvider } from './src/context/CustomerContext';

export default function App() {
  return (
    <InventoryProvider>
      <CustomerProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainTabs />
        </NavigationContainer>
      </CustomerProvider>
    </InventoryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
