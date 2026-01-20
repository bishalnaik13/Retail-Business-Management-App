import { View, Text } from 'react-native';

export default function InvoiceDetailScreen({ route }) {
  const { invoice } = route.params;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 16 }}>
        Invoice #{invoice.invoiceNo}
      </Text>

      <Text>Date: {invoice.date}</Text>
      <Text>Due Date: {invoice.dueDate}</Text>
      <Text>Status: {invoice.paymentStatus}</Text>

      <Text style={{ marginTop: 12, fontWeight: '600' }}>Items</Text>
      {invoice.items.map((item) => (
        <Text key={item.id}>
          {item.name} × {item.billedQty} = ₹
          {item.billedQty * item.rate - item.itemDiscount}
        </Text>
      ))}

      <Text style={{ marginTop: 12 }}>
        Subtotal: ₹{invoice.subtotal}
      </Text>
      <Text>Tax: ₹{invoice.tax}</Text>
      <Text style={{ fontWeight: '700' }}>
        Total: ₹{invoice.total}
      </Text>
    </View>
  );
}
