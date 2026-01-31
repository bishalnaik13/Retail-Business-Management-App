import { View, Text, FlatList } from 'react-native';
import { useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';

export default function CustomerLedgerScreen({ route }) {
  const { customerId, customerName } = route.params;
  const { ledgerEntries } = useContext(CustomerContext);

  const entries = ledgerEntries.filter(
    (e) => e.customerId === customerId
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', marginBottom: 10 }}>
        Ledger: {customerName}
      </Text>

      {entries.length === 0 ? (
        <Text style={{ color: 'gray' }}>No ledger entries</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                marginBottom: 6,
                backgroundColor:
                  item.type === 'DEBIT' ? '#fee2e2' : '#dcfce7',
                borderRadius: 6,
              }}
            >
              <Text>
                {item.type} ₹{item.amount}
              </Text>
              <Text style={{ fontSize: 12 }}>
                Ref: {item.reference}
              </Text>
              <Text style={{ fontSize: 11, color: 'gray' }}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
