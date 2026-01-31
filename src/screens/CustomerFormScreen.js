import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import {
    isRequired,
    isValidPhone,
    isPositiveNumber,
} from '../utils/validators';

export default function CustomerFormScreen({ navigation }) {
    const { addCustomer } = useContext(CustomerContext);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [creditLimit, setCreditLimit] = useState('');
    const [creditDays, setCreditDays] = useState('');

    const handleSave = () => {
        if (!isRequired(name)) {
            alert('Customer name is required');
            return;
        }

        if (!isValidPhone(phone)) {
            alert('Enter valid phone number');
            return;
        }

        if (
            creditLimit &&
            !isPositiveNumber(creditLimit)
        ) {
            alert('Invalid credit limit');
            return;
        }

        if (
            creditDays &&
            !isPositiveNumber(creditDays)
        ) {
            alert('Invalid credit days');
            return;
        }

        try {
            addCustomer({
                name,
                phone,
                creditLimit: Number(creditLimit) || 0,
                creditDays: Number(creditDays) || 0,
            });
            navigation.goBack();
        } catch (e) {
            alert(e.message);
        }

    };



    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: '700', marginBottom: 10 }}>
                Add Customer
            </Text>

            <TextInput
                placeholder="Customer Name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <TextInput
                placeholder="Phone Number"
                keyboardType="numeric"
                value={phone}
                onChangeText={setPhone}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Text style={{ fontWeight: '600', marginTop: 20, marginBottom: 6 }}>
                Credit Settings (Optional)
            </Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
                Leave empty for cash-only customers
            </Text>

            <TextInput
                placeholder="Credit Limit (₹)"
                keyboardType="numeric"
                value={creditLimit}
                onChangeText={setCreditLimit}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <TextInput
                placeholder="Credit Days"
                keyboardType="numeric"
                value={creditDays}
                onChangeText={setCreditDays}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <TouchableOpacity
                onPress={handleSave}
                style={{
                    marginTop: 16,
                    paddingVertical: 14,
                    borderRadius: 10,
                    backgroundColor: '#2563eb',
                }}
            >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>
                    Save Customer
                </Text>
            </TouchableOpacity>

        </View>
    );
}
