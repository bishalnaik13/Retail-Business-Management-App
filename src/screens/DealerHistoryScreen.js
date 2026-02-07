import { View, Text, Button } from 'react-native';
import { useContext } from 'react';

import { DealerContext } from '../context/DealerContext';

export default function DealerHistoryScreen({ route, navigation }) {
    const { dealerId, dealerName } = route.params;
    const { dealers } = useContext(DealerContext);
    const { ledgerEntries, getDealerPendingAmount } = useContext(DealerContext);


    const dealer = dealers.find((d) => d.id === dealerId);
    const entries = ledgerEntries.filter((e) => e.dealerId === dealerId);


    if (!dealer) {
        return (
            <View style={{ flex: 1, padding: 16 }}>
                <Text>Dealer not found</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Dealer Summary: {dealerName}
            </Text>

            <Text style={{ marginTop: 12, fontWeight: '600' }}>
                Ledger
            </Text>

            {entries.length === 0 ? (
                <Text style={{ color: 'gray', marginTop: 6 }}>
                    No purchase or payment records yet
                </Text>
            ) : (
                entries.map((e) => (
                    <View
                        key={e.id}
                        style={{
                            marginTop: 6,
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor: e.type === 'DEBIT' ? '#fee2e2' : '#dcfce7',
                        }}
                    >
                        <Text style={{ fontWeight: '600' }}>
                            {e.type === 'DEBIT' ? 'Purchase' : 'Payment'}: ₹{e.amount}
                        </Text>

                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                            Ref: {e.reference}
                        </Text>

                        <Text style={{ fontSize: 11, color: '#6b7280' }}>
                            {new Date(e.date).toLocaleDateString()}
                        </Text>
                    </View>
                ))
            )}

            <Text
                style={{
                    marginTop: 16,
                    fontWeight: '700',
                    fontSize: 16,
                }}
            >
                Outstanding Liability: ₹{getDealerPendingAmount(dealerId)}
            </Text>

            <View style={{ marginTop: 20 }}>
                <Button
                    title="Record Payment"
                    onPress={() =>
                        navigation.navigate('DealerPayment', {
                            dealerId,
                            dealerName,
                        })
                    }
                    disabled={getDealerPendingAmount(dealerId) <= 0}
                />
            </View>
        </View>
    );
}