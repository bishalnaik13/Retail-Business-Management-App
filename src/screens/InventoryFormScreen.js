import { View, Text, TextInput, Button } from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';
import { DealerContext } from '../context/DealerContext';
import { UNITS } from '../constants/units';
import { 
    isRequired,
    isPositiveNumber,
} from '../utils/validators';

export default function InventoryFormScreen({ navigation }) {
    const { addItem } = useContext(InventoryContext);
    const { dealers } = useContext(DealerContext);

    const [name, setName] = useState('');
    const [hsn, setHsn] = useState('');
    const [unit, setUnit] = useState(UNITS[0]);
    const [rate, setRate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [minStock, setMinStock] = useState('');
    const [dealerId, setDealerId] = useState('');

    const handleSave = () => {
        if (!isRequired(name)){
            alert('Item name is required.');
            return;
        }
        if (!isPositiveNumber(rate) || !isPositiveNumber(quantity)){
            alert('Rate and Quantity must be positive numbers.');
            return;
        }
        if (!dealerId){
            alert('Please select a dealer.');
            return;
        }
        addItem({
            name,
            hsn,
            unit,
            rate: Number(rate),
            quantity: Number(quantity),
            minStock: Number(minStock) || 0,
            dealerId,
        });
        navigation.goBack();
    };

    return (
        <View style={{ padding: 16}}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10}}>
                Add Inventory Item
            </Text>
            <TextInput
                placeholder="Item Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                placeholder="HSN Code"
                value={hsn}
                onChangeText={setHsn}
            />
            <TextInput
                placeholder="Rate"
                keyboardType="numeric"
                value={rate}
                onChangeText={setRate}
            />
            <TextInput
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
            />
            <TextInput
                placeholder="Minimum Stock"
                keyboardType="numeric"
                value={minStock}
                onChangeText={setMinStock}
            />
            <Text style={{ marginTop: 10 }}>Unit</Text>
            {UNITS.map((u) => (
                <Button
                    key={u}
                    title={u}
                    onPress={() => setUnit(u)}
                    color={unit === u ? 'green' : undefined}
                />
            ))}
            <Text style={{ marginTop: 10 }}>Dealer</Text>
            {dealers.length === 0 ? (
                <Text style={{ color: 'gray' }}>
                    No dealers available. Add dealer first.
                </Text>
            ) : (
                dealers.map((dealer) => (
                    <Button
                        key={dealer.id}
                        title={dealer.name}
                        onPress={() => setDealerId(dealer.id)}
                        color={dealerId === dealer.id ? 'green' : undefined}
                    />
                ))
            )}
            <Button title="Save Item" onPress={handleSave} />
        </View>
    )
}