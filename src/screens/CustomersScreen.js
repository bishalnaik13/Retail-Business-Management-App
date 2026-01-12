import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';

import { CustomerContext } from '../context/CustomerContext';

export default function CustomersScreen({ navigation }) {
    const { customers } = useContext(CustomerContext);

    const customersWithPending = customers.filter(
        (c) => c.pendingAmount > 0
    );

    return (
        <View style={{ flex: 1, padding: 16, marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Customers with Pending Payments
            </Text>

            <FlatList
                data={customersWithPending}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('CustomerHistory', {
                                customerId: item.id,
                                customerName: item.name,
                            })
                        }
                    >
                        <View style={{ paddingVertical: 10 }}>
                            <Text>{item.name}</Text>
                            <Text>Phone: {item.phone}</Text>
                            <Text>Pending Amount: ₹{item.pendingAmount}</Text>
                        </View>
                    </TouchableOpacity>
                )}

            />

        </View>
    );
}