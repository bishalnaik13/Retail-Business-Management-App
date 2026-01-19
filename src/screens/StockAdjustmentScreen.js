import { View, Text, TextInput, Button } from 'react-native';
import { useContext, useState } from 'react';
import { InventoryContext } from '../context/InventoryContext';
export default function StockAdjustmentScreen({ route, navigation }) {
    const { itemId } = route.params;
    const { adjustStock } = useContext(InventoryContext);
    const [change, setChange] = useState('');
    const [reason, setReason] = useState('');
    const handleAdjust = () => {
        const qtyChange = Number(change);
        if (!qtyChange || !reason) {
            alert('Quantity and reason are required');
            return;
        }
        adjustStock(itemId, qtyChange, reason);
        navigation.goBack();
    };
    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Adjust Stock
            </Text>
            <TextInput
                placeholder="Quantity change (e.g. -2 or 5)"
                keyboardType="numeric"
                value={change}
                onChangeText={setChange}
            />
            <TextInput
                placeholder="Reason (damage, loss, correction)"
                value={reason}
                onChangeText={setReason}
            />
            <Button title="Confirm Adjustment" onPress={handleAdjust} />
        </View>
    );
}
