import { View, Text, Button, ScrollView } from 'react-native';
import { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContext';
import { TransactionContext } from '../context/TransactionContext';


export default function InvoiceDetailScreen({ navigation, route }) {
  const { invoice: routeInvoice } = route.params;
  const { invoices } = useContext(InvoiceContext);

  const invoice =
    invoices.find((inv) => inv.invoiceNo === routeInvoice.invoiceNo) ||
    routeInvoice;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PAID':
        return { color: '#16a34a' }; // green
      case 'PARTIAL':
        return { color: '#f59e0b' }; // amber
      default:
        return { color: '#dc2626' }; // red
    }
  };

  const { cashTransactions, onlineTransactions } =
    useContext(TransactionContext);

  const paymentHistory = [
    ...cashTransactions,
    ...onlineTransactions,
  ].filter((t) => t.reference === invoice.invoiceNo);

  const isOverdue =
    invoice.balanceAmount > 0 &&
    new Date(invoice.dueDate) < new Date();

  const formatMoney = (value) =>
    `₹${Number(value || 0).toFixed(2)}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();




  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>

        {/* Invoice Header */}
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: isOverdue ? 2 : 0,
            borderColor: isOverdue ? '#dc2626' : 'transparent',

          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Invoice #{invoice.invoiceNo}
          </Text>

          {isOverdue && (
            <Text style={{ color: '#dc2626', fontWeight: '700' }}>
              OVERDUE
            </Text>
          )}


          <Text style={{ marginTop: 4, color: '#6b7280' }}>
            Date: {formatDate(invoice.date)}
          </Text>

          <Text style={{ marginTop: 2, color: '#6b7280' }}>
            Due: {formatDate(invoice.dueDate)}
          </Text>

          <Text
            style={[
              { marginTop: 8, fontWeight: '700' },
              getStatusStyle(invoice.paymentStatus),
            ]}
          >
            {invoice.paymentStatus}
          </Text>
        </View>

        {/* Payment Summary */}
        <View
          style={{
            backgroundColor: '#eef2ff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ color: '#6b7280' }}>Paid</Text>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
              {formatMoney(invoice.paidAmount)}
            </Text>
          </View>

          <View>
            <Text style={{ color: '#6b7280' }}>Balance</Text>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
              {formatMoney(invoice.balanceAmount)}
            </Text>
          </View>

          <View>
            <Text style={{ color: '#6b7280' }}>Total</Text>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
              {formatMoney(invoice.total)}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>
            Items
          </Text>

          {invoice.items.map((item) => {
            const base = item.billedQty * item.rate;
            const amount = base - item.itemDiscount;

            return (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              >
                <View>
                  <Text style={{ fontWeight: '600' }}>{item.name}</Text>

                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    {item.billedQty} × ₹{item.rate} = {formatMoney(base)}
                  </Text>

                  {item.itemDiscount > 0 && (
                    <Text style={{ fontSize: 12, color: '#dc2626' }}>
                      Discount: -{formatMoney(item.itemDiscount)}
                    </Text>
                  )}
                </View>


                <Text style={{ fontWeight: '600' }}>
                  {formatMoney(amount)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Payment History */}
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>
            Payment History
          </Text>

          {paymentHistory.length === 0 ? (
            <Text style={{ color: '#6b7280' }}>
              No payments recorded yet
            </Text>
          ) : (
            paymentHistory.map((p) => (
              <View
                key={p.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Text>
                  {p.type} • ₹{p.amount}
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>
                  {new Date(p.date).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>


        {/* Totals */}
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text>Subtotal: ₹{invoice.subtotal}</Text>
          <Text>Tax: ₹{invoice.tax}</Text>

          <Text style={{ fontWeight: '700', marginTop: 6 }}>
            Grand Total: ₹{formatMoney(invoice.total)}
          </Text>
        </View>

      </ScrollView>

      {/* Action */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: '#111827',
        }}
      >
        <Button
          title={
            invoice.balanceAmount > 0
              ? 'Record Payment'
              : 'Invoice Fully Paid ✔'
          }
          disabled={invoice.balanceAmount === 0}
          onPress={() =>
            navigation.navigate('InvoicePayment', { invoice })
          }
        />


      </View>

    </View>

  );
}
