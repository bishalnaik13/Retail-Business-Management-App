import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';
import { DealerContext } from '../context/DealerContext';


export default function InventoryScreen({ navigation }) {
    const { items, addItem, orderListByDealer, adjustments } = useContext(InventoryContext);
    const [searchText, setSearchText] = useState('');
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);


    const { dealers } = useContext(DealerContext);

    const getDealerName = (id) =>
        dealers.find((d) => d.id === id)?.name || 'Unknown Dealer';


    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.hsn && item.hsn.includes(searchText));
        const matchesLowStock = showLowStockOnly
            ? item.quantity < item.minStock
            : true;
        return matchesSearch && matchesLowStock;
    });

    const ActionButton = ({ label, onPress, variant = 'primary' }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: variant === 'primary' ? '#2563eb' : '#e5e7eb',
                marginTop: 10,
            }}
        >
            <Text
                style={{
                    color: variant === 'primary' ? '#fff' : '#111827',
                    textAlign: 'center',
                    fontWeight: '600',
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 16, marginVertical: 10 }}>
            <View style={styles.card}>
                <TextInput
                    placeholder="Search by item name or HSN"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 6,
                        marginBottom: 10,
                    }}
                />

                <ActionButton
                    label={
                        showLowStockOnly ? 'Show All Items' : 'Show Low Stock Only'
                    }
                    onPress={() => setShowLowStockOnly((prev) => !prev)}
                />
            </View>

            {filteredItems.length === 0 ? (
                <Text style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>
                    No matching inventory items found.
                </Text>
            ) : (

                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isLowStock = item.quantity < item.minStock;
                        return (
                            <View style={styles.itemCard}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.title}>{item.name}</Text>

                                    {isLowStock && (
                                        <Text style={styles.lowStockBadge}>LOW</Text>
                                    )}
                                </View>

                                <Text style={styles.muted}>
                                    Stock: {item.quantity} {item.unit}
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('StockAdjustment', { itemId: item.id })
                                    }
                                    style={{ marginTop: 6 }}
                                >
                                    <Text style={{ color: '#2563eb', fontWeight: '600' }}>
                                        Adjust stock
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        );
                    }}
                />
            )}

            {/* Order List Section */}
            <View style={[styles.card, { marginTop: 24 }]}>
                <Text style={styles.sectionTitle}>
                    Order List (Dealer-wise)
                </Text>


                {Object.keys(orderListByDealer).length === 0 ? (
                    <Text style={{ color: 'gray', marginTop: 8 }}>
                        No items need reordering.
                    </Text>
                ) : (
                    <>
                        <View style={styles.orderCard}>
                            <Text style={styles.sectionTitle}>⚠ Reorder Required</Text>

                            <Text style={styles.muted}>
                                {Object.values(orderListByDealer).flat().length} item(s) need reordering
                            </Text>

                            <TouchableOpacity
                                onPress={() => setShowOrderDetails((prev) => !prev)}
                                style={{ marginTop: 10 }}
                            >
                                <Text style={{ color: '#2563eb', fontWeight: '600' }}>
                                    {showOrderDetails ? 'Hide details' : 'Review & Create PO'}
                                </Text>
                            </TouchableOpacity>

                            {showOrderDetails && (
                                <>
                                    {Object.entries(orderListByDealer).map(([dealerId, items]) => (
                                        <View key={dealerId} style={{ marginTop: 12 }}>
                                            <Text style={{ fontWeight: '700' }}>
                                                {getDealerName(dealerId)}
                                            </Text>

                                            {items.map((item) => (
                                                <Text key={item.id} style={styles.muted}>
                                                    • {item.name} (Current: {item.quantity})
                                                </Text>
                                            ))}
                                        </View>
                                    ))}

                                    <ActionButton
                                        label="Create Purchase Orders"
                                        onPress={() => navigation.navigate('CreatePurchaseOrder')}
                                    />
                                </>
                            )}
                        </View>


                    </>
                )}
            </View>

        </View >
    );
}

const styles = {
    card: {
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    title: {
        fontWeight: '700',
        fontSize: 15,
    },
    muted: {
        color: '#6b7280',
        fontSize: 12,
    },
    itemCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
    },
    lowStockBadge: {
        color: '#dc2626',
        fontSize: 11,
        fontWeight: '700',
    },

    sectionTitle: {
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 8,
    },
    orderCard: {
        backgroundColor: '#fff7ed',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },

};
