import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { useContext, useState } from 'react';
import { InventoryContext } from '../context/InventoryContext';

const REASONS = ['Damage', 'Loss', 'Correction', 'Received'];

export default function StockAdjustmentScreen({ route, navigation }) {
    const { itemId } = route.params;
    const { adjustStock } = useContext(InventoryContext);

    const [mode, setMode] = useState('DECREASE'); // INCREASE | DECREASE
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');

    const handleConfirm = () => {
        const qty = Number(quantity);

        if (!qty || qty <= 0) {
            Alert.alert('Enter a valid quantity');
            return;
        }

        if (!reason) {
            Alert.alert('Select a reason');
            return;
        }

        const finalChange = mode === 'DECREASE' ? -qty : qty;

        Alert.alert(
            'Confirm Stock Adjustment',
            `${mode === 'DECREASE' ? 'Reduce' : 'Increase'} stock by ${qty}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    style: 'destructive',
                    onPress: () => {
                        adjustStock(itemId, finalChange, reason + (note ? `: ${note}` : ''));
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {/* SECTION: ADJUSTMENT TYPE */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Adjustment Type</Text>
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        onPress={() => setMode('DECREASE')}
                        style={[
                            styles.toggle,
                            mode === 'DECREASE' && styles.toggleActiveRed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                mode === 'DECREASE' && styles.toggleTextActive,
                            ]}
                        >
                            Decrease
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setMode('INCREASE')}
                        style={[
                            styles.toggle,
                            mode === 'INCREASE' && styles.toggleActiveGreen,
                        ]}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                mode === 'INCREASE' && styles.toggleTextActive,
                            ]}
                        >
                            Increase
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* SECTION: QUANTITY */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Quantity</Text>

                <TextInput
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    style={styles.input}
                />
            </View>

            {/* SECTION: REASON */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Reason</Text>

                <View style={styles.chipRow}>
                    {REASONS.map((r) => (
                        <TouchableOpacity
                            key={r}
                            onPress={() => setReason(r)}
                            style={[
                                styles.chip,
                                reason === r && styles.chipActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    reason === r && styles.chipTextActive,
                                ]}
                            >
                                {r}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TextInput
                    placeholder="Optional note"
                    value={note}
                    onChangeText={setNote}
                    style={[styles.input, { marginTop: 12 }]}
                />
            </View>

            {/* CONFIRM */}
            <TouchableOpacity
                onPress={handleConfirm}
                style={[
                    styles.confirmButton,
                    mode === 'DECREASE'
                        ? styles.confirmDanger
                        : styles.confirmSuccess,
                ]}
            >
                <Text style={styles.confirmText}>
                    Confirm Adjustment
                </Text>
            </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = {
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 12,
    },
    toggle: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
    },
    toggleActiveRed: {
        backgroundColor: '#fee2e2',
        borderColor: '#dc2626',
    },
    toggleActiveGreen: {
        backgroundColor: '#dcfce7',
        borderColor: '#16a34a',
    },
    toggleText: {
        fontWeight: '600',
        color: '#374151',
    },
    toggleTextActive: {
        color: '#111827',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    chipActive: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
    },
    chipText: {
        color: '#374151',
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#ffffff',
    },
    confirmButton: {
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 8,
    },
    confirmDanger: {
        backgroundColor: '#dc2626',
    },
    confirmSuccess: {
        backgroundColor: '#16a34a',
    },
    confirmText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
    },
};
