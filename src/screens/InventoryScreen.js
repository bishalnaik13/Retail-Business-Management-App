import { View, Text, Button, FlatList } from 'react-native';
import { useContext } from 'react';

import { InventoryContext } from '../context/InventoryContext';

export default function InventoryScreen() {
    const { items, addItem, orderListByDealer } = useContext(InventoryContext);

    const handleAddItem = () => {
        addItem({
            name: 'Product A',
            hsn: '25236',
            unit: 'pcs',
            rate: 100,
            quantity: 50,
            minStock: 10,
            dealerId: 'dealer-1',
        });
    };

    return (
        <View style={{ flex: 1, padding: 16, marginVertical: 45 }}>
            <Button title="Add Item" onPress={handleAddItem} />
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isLowStock = item.quantity < item.minStock;
                    return (
                        <View style={{ paddingVertical: 8 }}>
                            <Text>{item.name}</Text>
                            <Text>Qty: {item.quantity} {item.unit}</Text>

                            {isLowStock && (
                                <Text style={{ color: 'red' }}>
                                    Low Stock - Needs Reorder !
                                </Text>
                            )}

                            <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
                                Order List (Dealer-wise)
                            </Text>

                            {Object.keys(orderListByDealer).length === 0 ? (
                                <Text>No items need reordering.</Text>
                            ) : (
                                Object.entries(orderListByDealer).map(([dealerId, items]) => (
                                    <View key={dealerId} style={{ marginTop: 10 }}>
                                        <Text>Dealer: {dealerId}</Text>
                                        {items.map((item) => (
                                            <Text key={item.id}>
                                                • {item.name} (Qty: {item.quantity})
                                            </Text>
                                        ))}
                                    </View>
                                ))
                            )}
                        </View>
                    );
                }}
            />

        </View>
    );
}