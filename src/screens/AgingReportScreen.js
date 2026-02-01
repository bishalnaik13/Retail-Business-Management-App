import { View, Text, FlatList } from 'react-native';
import { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContext';
import { CustomerContext } from '../context/CustomerContext';
import { getAgingBucket } from '../utils/agingUtils';

export default function AgingReportScreen() {
  const { invoices } = useContext(InvoiceContext);
  const { customers } = useContext(CustomerContext);

  const aging = {
    '0-30': [],
    '31-60': [],
    '60+': [],
  };

  invoices.forEach((inv) => {
    if (inv.balanceAmount > 0) {
      const bucket = getAgingBucket(inv);
      if (bucket) aging[bucket].push(inv);
    }
  });

  const renderBucket = (title, data) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: '700', marginBottom: 6 }}>
        {title} Days
      </Text>

      {data.length === 0 ? (
        <Text style={{ color: 'gray' }}>No overdue invoices</Text>
      ) : (
        data.map((inv) => {
          const customer =
            customers.find((c) => c.id === inv.customerId);

          return (
            <View
              key={inv.invoiceNo}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#fff7ed',
                marginBottom: 6,
              }}
            >
              <Text>
                Invoice #{inv.invoiceNo}
              </Text>
              <Text>
                Customer: {customer?.name || 'Unknown'}
              </Text>
              <Text>
                Balance: ₹{inv.balanceAmount}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 16,
          marginBottom: 16,
        }}
      >
        Aging Report
      </Text>

      {renderBucket('0–30', aging['0-30'])}
      {renderBucket('31–60', aging['31-60'])}
      {renderBucket('60+', aging['60+'])}
    </View>
  );
}
