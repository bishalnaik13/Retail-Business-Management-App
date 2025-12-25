import { View, Text, Button, FlatList } from 'react-native';
import { useContext } from 'react';

import { InventoryContext } from '../context/InventoryContext';

export default function InventoryScreen() {
    const {items, addItem} = useContext(InventoryContext);

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
                renderItem={({ item }) => (
                    <View style={{ paddingVertical: 8}}>
                        <Text>{item.name}</Text>
                        <Text>Qty: {item.quantity} {item.unit}</Text>
                    </View>
                )}
            />
        </View>
    );
}