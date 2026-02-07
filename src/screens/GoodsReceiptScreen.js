import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useContext, useState } from 'react';

import { PurchaseOrderContext } from '../context/PurchaseOrderContext';
import { InventoryContext } from '../context/InventoryContext';
import { DealerContext } from '../context/DealerContext';

export default function GoodsReceiptScreen({ route, navigation }) {
    const { po } = route.params;
    const { receiveGoods } = useContext(PurchaseOrderContext);
    const { increaseStockBatch } = useContext(InventoryContext);
    const { addDealerLedgerEntry } = useContext(DealerContext);


    const [received, setReceived] = useState(
        po.items.map((i) => ({
            itemId: i.itemId,
            name: i.name,
            qty: '',
            remaining: i.orderQty - i.receivedQty,
        }))
    );

    const updateQty = (itemId, val) => {
        setReceived((prev) =>
            prev.map((i) =>
                i.itemId === itemId
                    ? { ...i, qty: val.replace(/[^0-9]/g, '') }
                    : i
            )
        );
    };

    const handleReceive = () => {
        const entered = received
            .map((r) => ({ ...r, qty: Number(r.qty) || 0 }))
            .filter((r) => r.qty > 0);

        if (entered.length === 0) {
            alert('No quantities entered');
            return;
        }

        const invalid = entered.some(
            (r) => r.qty > r.remaining || r.qty < 0
        );

        if (invalid) {
            alert('Invalid received quantity');
            return;
        }

        const totalReceivedValue = entered.reduce(
            (sum, r) => {
                const poItem = po.items.find(
                    (i) => i.itemId === r.itemId
                );
                return sum + r.qty * (poItem?.rate || 0);
            },
            0
        );

        receiveGoods(po.id, entered);
        increaseStockBatch(entered);

        addDealerLedgerEntry({
            dealerId: po.dealerId,
            type: 'DEBIT',
            amount: totalReceivedValue,
            reference: po.id,
            note: 'Goods received',
        });


        alert('Goods received successfully');
        navigation.goBack();
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                {/* Header */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: '700' }}>
                        Goods Receipt
                    </Text>
                    <Text style={{ color: '#6b7280', marginTop: 4 }}>
                        PO #{po.id}
                    </Text>
                </View>

                {/* Items */}
                {received.map((item) => (
                    <View
                        key={item.itemId}
                        style={{
                            backgroundColor: '#ffffff',
                            padding: 14,
                            borderRadius: 12,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontWeight: '600' }}>
                            {item.name}
                        </Text>

                        <Text
                            style={{
                                fontSize: 12,
                                color: '#6b7280',
                                marginTop: 4,
                            }}
                        >
                            Remaining: {item.remaining}
                        </Text>

                        <TextInput
                            placeholder="Enter received qty"
                            keyboardType="numeric"
                            value={item.qty}
                            onChangeText={(val) =>
                                updateQty(item.itemId, val)
                            }
                            style={{
                                marginTop: 10,
                                borderWidth: 1,
                                borderColor: '#e5e7eb',
                                borderRadius: 8,
                                padding: 10,
                                width: 120,
                                textAlign: 'center',
                            }}
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Action */}
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
                <TouchableOpacity
                    onPress={handleReceive}
                    style={{
                        backgroundColor: '#22c55e',
                        paddingVertical: 14,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            fontWeight: '700',
                        }}
                    >
                        Confirm Goods Receipt
                    </Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
}
