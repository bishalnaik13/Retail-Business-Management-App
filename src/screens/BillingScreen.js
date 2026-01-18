import { View, Text, Button, TextInput, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';

export default function BillingScreen() {
    const { items, reduceStock } = useContext(InventoryContext);

    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState(0);

    // Future enhancement: integrate smart item suggestion and voice input here
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

    const handleConfirmInvoice = () => {
        if(!selectedItem || !quantity){
            Alert.alert("Incomplete", "Please select item and quantity");
            return;
        }
        const qty = Number(quantity);
        const success = reduceStock(selectedItem.id, qty);
        if (!success){
            Alert.alert(
                "Insufficient Stock", "Not enough stock available to complete this sale."
            );
            return;
        }
        Alert.alert("Invoice Created", "Stock updated successfully.");

        setSelectedItem(null);
        setQuantity('');
        setAmount(0);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, padding: 16 }} behavior="padding">
            <Text style={{ fontWeight: 'bold', marginBottom: 10, marginTop: 45 }}>
                Select Item
            </Text>
            {items.length === 0 && (
                <Text style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>
                    No stock items available.
                    {'\n'}Please add items before billing.
                </Text>
            )}
            

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
                    <Button 
                        title = "Confirm Invoice"
                        onPress = {handleConfirmInvoice}
                        />
                </View>
            )}
        </KeyboardAvoidingView>
    );
}