import { View, Text, Button, FlatList } from 'react-native';
import { useContext } from 'react';

import { InventoryContext } from '../context/InventoryContext';

export default function InventoryScreen({ navigation }) {
    const { items, addItem, orderListByDealer } = useContext(InventoryContext);


    return (
        <View style={{ flex: 1, padding: 16, marginVertical: 45 }}>
            {items.length === 0 ? (
                <Text style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>
                    No stock items available.
                    {'\n'}Please add items from Inventory Management.
                </Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isLowStock = item.quantity < item.minStock;
                        return (
                            <View style={{ paddingVertical: 8 }}>
                                <Text>{item.name}</Text>
                                <Text>Qty: {item.quantity} {item.unit}</Text>

                                <Button
                                    title="Adjust"
                                    onPress={() =>
                                        navigation.navigate('StockAdjustment', {
                                            itemId: item.id,
                                        })
                                    }
                                />

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
                                {adjustments.length > 0 && (
                                    <>
                                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
                                            Stock Adjustments
                                        </Text>
                                        {adjustments.map((adj) => (
                                            <Text key={adj.id}>
                                                Item: {adj.itemId}, Change: {adj.change}, Reason: {adj.reason}
                                            </Text>
                                        ))}
                                    </>
                                )}

                            </View>
                        );
                    }}
                />
            )}
            <Button
                title="Add New Item"
                onPress={() => navigation.navigate('InventoryForm')}
            />




        </View>
    );
}