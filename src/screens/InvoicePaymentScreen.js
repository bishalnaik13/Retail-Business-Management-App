import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useContext, useState } from 'react';

import { InvoiceContext } from '../context/InvoiceContext';
import { TransactionContext } from '../context/TransactionContext';
import { CustomerContext } from '../context/CustomerContext';
import { TransactionType } from '../constants/transactionType';

export default function InvoicePaymentScreen({ route, navigation }) {
    const { invoice } = route.params;

    const paidAmount = Number(invoice.paidAmount) || 0;
    const balanceAmount =
        typeof invoice.balanceAmount === 'number'
            ? invoice.balanceAmount
            : Math.max(invoice.total - paidAmount, 0);

    const { updateInvoicePayment } = useContext(InvoiceContext);
    const { addTransaction } = useContext(TransactionContext);

    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState(TransactionType.CASH);
    const { addLedgerEntry } = useContext(CustomerContext);


    const handlePayment = () => {
        const payAmount = Number(amount);

        if (!payAmount || payAmount <= 0) {
            Alert.alert('Enter valid amount');
            return;
        }

        if (payAmount > balanceAmount) {
            Alert.alert('Amount exceeds balance');
            return;
        }

        Alert.alert(
            'Confirm Payment',
            `Record ₹${payAmount} as ${mode} payment?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        updateInvoicePayment(invoice.invoiceNo, payAmount);
                        if (invoice.customerId) {
                            addLedgerEntry({
                                customerId: invoice.customerId,
                                type: 'CREDIT',
                                amount: payAmount,
                                reference: invoice.invoiceNo,
                                note: `Payment received (${mode})`,
                            });
                        }
                        addTransaction({
                            amount: payAmount,
                            type: mode,
                            reference: invoice.invoiceNo,
                        });
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const formatMoney = (value) =>
        `₹${Number(value || 0).toFixed(2)}`;

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                {/* Invoice Header */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 12,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: '700' }}>
                        Invoice #{invoice.invoiceNo}
                    </Text>

                    <Text style={{ color: '#6b7280', marginTop: 4 }}>
                        Total: {formatMoney(invoice.total)}
                    </Text>
                </View>

                {/* Payment Summary */}
                <View
                    style={{
                        backgroundColor: '#eef2ff',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <Text style={{ color: '#6b7280' }}>Paid</Text>
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>
                            {formatMoney(paidAmount)}
                        </Text>
                    </View>

                    <View>
                        <Text style={{ color: '#6b7280' }}>Balance</Text>
                        <Text
                            style={{
                                fontWeight: '700',
                                fontSize: 16,
                                color: balanceAmount > 0 ? '#dc2626' : '#16a34a',
                            }}
                        >
                            {formatMoney(balanceAmount)}
                        </Text>
                    </View>
                </View>

                {/* Payment Amount */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 12,
                    }}
                >
                    <Text style={{ fontWeight: '700', marginBottom: 6 }}>
                        Payment Amount
                    </Text>

                    <TextInput
                        placeholder={`Max ${formatMoney(balanceAmount)}`}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        style={{
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            padding: 12,
                            borderRadius: 8,
                            fontSize: 16,
                        }}
                    />

                    <Text
                        style={{
                            marginTop: 6,
                            color: '#2563eb',
                            fontWeight: '600',
                        }}
                        onPress={() => setAmount(String(balanceAmount))}
                    >
                        Pay Full Amount
                    </Text>
                </View>

                {/* Payment Mode */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        padding: 16,
                        borderRadius: 12,
                    }}
                >
                    <Text style={{ fontWeight: '700', marginBottom: 8 }}>
                        Payment Mode
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: '#e5e7eb',
                            borderRadius: 999,
                            padding: 4,
                        }}
                    >
                        <Text
                            onPress={() => setMode(TransactionType.CASH)}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                paddingVertical: 10,
                                borderRadius: 999,
                                backgroundColor:
                                    mode === TransactionType.CASH ? '#2563eb' : 'transparent',
                                color:
                                    mode === TransactionType.CASH ? '#ffffff' : '#374151',
                                fontWeight: '600',
                            }}
                        >
                            Cash
                        </Text>

                        <Text
                            onPress={() => setMode(TransactionType.ONLINE)}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                paddingVertical: 10,
                                borderRadius: 999,
                                backgroundColor:
                                    mode === TransactionType.ONLINE ? '#2563eb' : 'transparent',
                                color:
                                    mode === TransactionType.ONLINE ? '#ffffff' : '#374151',
                                fontWeight: '600',
                            }}
                        >
                            Online
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Action */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 16,
                    backgroundColor: '#111827',
                }}
            >
                <Button
                    title={`Confirm ₹${amount || 0} Payment`}
                    onPress={handlePayment}
                    disabled={!amount || Number(amount) <= 0}
                />
            </View>
        </View>
    );
}
