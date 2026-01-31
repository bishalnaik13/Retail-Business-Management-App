import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';

import { CustomerContext } from '../context/CustomerContext';

export default function CustomersScreen({ navigation }) {
    const { customers, getCustomerPendingAmount } = useContext(CustomerContext);

    const customersWithPending = customers.filter(
        (c) => getCustomerPendingAmount(c.id) > 0
    );

    return (
        <View style={{ flex: 1, padding: 16, marginTop: 20 }}>
            {customersWithPending.length === 0 && (
                <Text style={{ color: 'gray', marginTop: 20, textAlign: 'center' }}>
                    No pending customer payments 🎉
                </Text>
            )}


            <FlatList
                data={customersWithPending}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('CustomerLedger', {
                                customerId: item.id,
                                customerName: item.name,
                            })
                        }
                    >
                        <View
                            style={{
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: '#f9fafb',
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                            <Text style={{ color: '#6b7280' }}>{item.phone}</Text>
                            <Text style={{ color: '#dc2626', marginTop: 4 }}>
                                Pending: ₹{getCustomerPendingAmount(item.id)}
                            </Text>

                        </View>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    backgroundColor: '#2563eb',
                    padding: 16,
                    borderRadius: 999,
                }}
                onPress={() => navigation.navigate('CustomerForm')}
            >
                <Text style={{ color: '#fff', fontWeight: '700' }}> ＋ </Text>
            </TouchableOpacity>
        </View>
    );
}