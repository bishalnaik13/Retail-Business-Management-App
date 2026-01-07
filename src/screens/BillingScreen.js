import { View, Text, Button, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';

export default function BillingScreen() {
    const { items } = useContext(InventoryContext);

    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState(0);

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setQuantity('');
        setAmount(0);
    };

    const handleQuantityChange = (value) => {
        const qty = Number(value);
        setQuantity(value);

        if (selectedItem && qty > 0) {
            setAmount(qty * selectedItem.rate);
        } else {
            setAmount(0);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, padding: 16 }} behavior="padding">
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Select Item
            </Text>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Button
                        title={`${item.name}(₹${item.rate})`}
                        onPress={() => handleSelectItem(item)}
                    />
                )}
            />
            {selectedItem && (
                <View style={{ marginTop: 20 }}>
                    <Text>Selected Item: {selectedItem.name}</Text>

                    <TextInput
                        placeholder="Enter Quantity"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        style={{
                            borderWidth: 1,
                            padding: 8,
                            marginVertical: 10,
                        }}
                    />
                    <Text>Amount: ₹{amount.toString()}</Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}