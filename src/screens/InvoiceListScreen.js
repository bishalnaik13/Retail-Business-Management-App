import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContext';

export default function InvoiceListScreen({ navigation }) {
  const { invoices } = useContext(InvoiceContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', marginBottom: 10 }}>
        Invoice History
      </Text>

      {invoices.length === 0 ? (
        <Text style={{ color: 'gray' }}>No invoices created yet</Text>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.invoiceNo}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('InvoiceDetail', { invoice: item })
              }
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#f9fafb',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontWeight: '600' }}>
                Invoice #{item.invoiceNo}
              </Text>
              <Text>Total: ₹{item.total}</Text>
              <Text>Status: {item.paymentStatus}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
