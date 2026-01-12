import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import MainTabs from './src/navigation/MainTabs';
import { InventoryProvider } from './src/context/InventoryContext';
import { CustomerProvider } from './src/context/CustomerContext';
import { InvoiceProvider } from './src/context/InvoiceContext';
import { DealerProvider } from './src/context/DealerContext';
import { TransactionProvider } from './src/context/TransactionContext';

export default function App() {
  return (
    <InventoryProvider>
      <CustomerProvider>
        <DealerProvider>
          <InvoiceProvider>
            <TransactionProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <MainTabs />
              </NavigationContainer>
            </TransactionProvider>
          </InvoiceProvider>
        </DealerProvider>
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
