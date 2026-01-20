import { View, Text, Button, TextInput, FlatList, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';

export default function BillingScreen() {
    const { items } = useContext(InventoryContext);

    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [invoiceItems, setInvoiceItems] = useState([]);

    // Future enhancement: integrate smart item suggestion and voice input here
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setQuantity('');
    };



    const handleAddItem = () => {
        if (!selectedItem) {
            Alert.alert('Select an item');
            return;
        }

        const qty = Number(quantity);

        if (!qty || qty <= 0) {
            Alert.alert('Invalid quantity');
            return;
        }

        if (qty > selectedItem.quantity) {
            Alert.alert('Insufficient stock');
            return;
        }

        const alreadyAdded = invoiceItems.find(
            (item) => item.id === selectedItem.id
        );

        if (alreadyAdded) {
            Alert.alert('Item already added to invoice');
            return;
        }

        setInvoiceItems((prev) => [
            ...prev,
            {
                ...selectedItem,
                billedQty: qty,
                lineTotal: qty * selectedItem.rate,
            },
        ]);

        setSelectedItem(null);
        setQuantity('');
    };

    const subtotal = invoiceItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
    );

    const handleRemoveItem = (itemId) => {
        setInvoiceItems((prev) =>
            prev.filter((i) => i.id !== itemId)
        );
    };



    return (
        <KeyboardAvoidingView style={{ flex: 1, padding: 16 }} behavior="padding">
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 25 }}>
                Items
            </Text>
            {items.length === 0 && (
                <Text style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>
                    No stock items available.
                    {'\n'}Please add items before billing.
                </Text>
            )}



            {items.length > 0 && (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleSelectItem(item)}
                            style={{
                                padding: 12,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                marginBottom: 8,
                                backgroundColor:
                                    selectedItem?.id === item.id ? '#eef6ff' : '#fff',
                            }}
                        >
                            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                            <Text style={{ color: 'gray' }}>
                                ₹{item.rate} | Stock: {item.quantity}
                            </Text>
                        </TouchableOpacity>
                    )}

                />
            )}

            {selectedItem && (
                <View style={{ marginTop: 20 }}>
                    <Text>Selected Item: {selectedItem.name}</Text>

                    <TextInput
                        placeholder="Enter Quantity"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                        maxLength={5}
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 6,
                            marginVertical: 10,
                        }}
                    />

                    <Text style={{ fontSize: 12, color: 'gray' }}>
                        Max available: {selectedItem.quantity}
                    </Text>

                    <Button
                        title="Add to Invoice"
                        onPress={handleAddItem}
                        disabled={!quantity}
                    />
                </View>
            )}

            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Invoice Items</Text>
                {invoiceItems.length === 0 ? (
                    <Text style={{ color: 'gray' }}>No items added</Text>
                ) : (
                    invoiceItems.map((item) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingVertical: 8,
                                borderBottomWidth: 1,
                                borderColor: '#eee',
                            }}
                        >
                            <View>
                                <Text style={{ fontWeight: '500' }}>{item.name}</Text>
                                <Text style={{ color: 'gray', fontSize: 12 }}>
                                    {item.billedQty} × ₹{item.rate}
                                </Text>
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontWeight: '600' }}>₹{item.lineTotal}</Text>
                                <Text
                                    style={{ color: 'red', marginTop: 4 }}
                                    onPress={() => handleRemoveItem(item.id)}
                                >
                                    Remove
                                </Text>
                            </View>
                        </View>

                    ))
                )}
                <View
                    style={{
                        marginTop: 15,
                        padding: 12,
                        backgroundColor: '#f6f6f6',
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Subtotal: ₹{subtotal}
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}