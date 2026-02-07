import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useContext } from 'react';

import { DealerContext } from '../context/DealerContext';

export default function DealersScreen({ navigation }) {
    const { dealers } = useContext(DealerContext);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Button
                title="Add Dealer"
                onPress={() => navigation.navigate('DealerForm')}
            />
            <Text style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 20 }}>
                Dealers Payments Overview
            </Text>
            {dealers.length === 0 && (
                <Text style={{ marginTop: 20, color: 'gray', textAlign: 'center' }}>
                    No dealers added yet
                </Text>
            )}
            <FlatList
                data={dealers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('DealerHistory', {
                                dealerId: item.id,
                                dealerName: item.name,
                            })
                        }
                        style={{
                            backgroundColor: '#ffffff',
                            padding: 14,
                            borderRadius: 10,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                        }}
                    >
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>
                            {item.name}
                        </Text>

                        <Text style={{ color: '#6b7280', marginTop: 4 }}>
                            Pending: ₹{item.pendingAmount ?? 0}
                        </Text>

                        <Text style={{ fontSize: 12, color: '#2563eb', marginTop: 6 }}>
                            Tap to view ledger →
                        </Text>
                    </TouchableOpacity>
                )}
            />
            

        </View>
    );
}