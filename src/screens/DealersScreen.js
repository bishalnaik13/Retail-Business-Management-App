import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';

import { DealerContext } from '../context/DealerContext';

export default function DealersScreen({navigation}) {
    const { dealers } = useContext(DealerContext);

    return (
        <View style={{ flex: 1, padding: 16}}>
            <Text style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 20 }}>
                Dealers Payments Overview
                </Text>
                <FlatList
                    data={dealers}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('DealerHistory', {
                                    dealerId: item.id,
                                    dealerName: item.name,
                                })
                            }
                            >
                                <View style={{ paddingVertical: 10 }}>
                                    <Text>{item.name}</Text>
                                    <Text>Total Billed: ₹{item.totalBilled}</Text>
                                    <Text>Paid: ₹{item.paidAmount}</Text>
                                    <Text>Pending : ₹{item.pendingAmount}</Text>
                                </View>
                            </TouchableOpacity>
                    )}
                />
        </View>
    );
}