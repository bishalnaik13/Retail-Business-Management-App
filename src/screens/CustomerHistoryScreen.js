import { View, Text, FlatList } from 'react-native';
import { useContext } from 'react';

import { InvoiceContext } from '../context/InvoiceContext';

export default function CustomerHistoryScreen({ route }) {
    const { customerId, customerName } = route.params;
    const { getInvoicesByCustomer } = useContext(InvoiceContext);

    const invoices = getInvoicesByCustomer(customerId);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Billing History: {customerName}
            </Text>

            {invoices.length === 0 ? (
                <Text>No invoices found</Text>
            ) : (
                <FlatList
                    data={invoices}
                    keyExtractor={(item) => item.invoiceNo}
                    renderItem={({ item }) => (
                        <View style={{ paddingVertical: 8 }}>
                            <Text>Invoice: {item.invoiceNo}</Text>
                            <Text>Total: ₹{item.total}</Text>
                            <Text>Due Date: {item.dueDate}</Text>
                            <Text>Status: {item.paymentStatus}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}