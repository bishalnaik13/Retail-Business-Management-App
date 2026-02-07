import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';
import { PurchaseOrderContext } from '../context/PurchaseOrderContext';
import { DealerContext } from '../context/DealerContext';

export default function CreatePurchaseOrderScreen({ navigation }) {
    const { orderListByDealer } = useContext(InventoryContext);
    const { createPurchaseOrder } = useContext(PurchaseOrderContext);
    const { dealers } = useContext(DealerContext);

    const [drafts, setDrafts] = useState(() => {
        const initial = {};
        Object.keys(orderListByDealer).forEach((dealerId) => {
            initial[dealerId] = orderListByDealer[dealerId].map((item) => ({
                itemId: item.id,
                name: item.name,
                suggestedQty: Math.max(item.minStock - item.quantity, 1),
                orderQty: Math.max(item.minStock - item.quantity, 1),
                rate: Number(item.rate),
            }));

        });
        return initial;
    });

    const updateQty = (dealerId, itemId, qty) => {
        setDrafts((prev) => ({
            ...prev,
            [dealerId]: prev[dealerId].map((i) =>
                i.itemId === itemId
                    ? { ...i, orderQty: Number(qty) || 0 }
                    : i
            ),
        }));
    };

    const handleCreatePO = (dealerId) => {
        createPurchaseOrder({
            dealerId,
            items: drafts[dealerId].filter((i) => i.orderQty > 0),
        });

        navigation.navigate('PurchaseOrderList');
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <Text style={styles.pageTitle}>Create Purchase Orders</Text>

            {Object.keys(orderListByDealer).length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.muted}>
                        No low-stock items at the moment 🎉
                    </Text>
                </View>
            )}

            {Object.keys(orderListByDealer).map((dealerId) => {
                const dealer = dealers.find((d) => d.id === dealerId);

                return (
                    <View key={dealerId} style={styles.card}>
                        <Text style={styles.sectionTitle}>
                            {dealer?.name || 'Unknown Dealer'}
                        </Text>

                        {drafts[dealerId].map((item) => (
                            <View key={item.itemId} style={styles.itemRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.muted}>
                                        Suggested: {item.suggestedQty}
                                    </Text>
                                </View>

                                <TextInput
                                    keyboardType="numeric"
                                    value={String(item.orderQty)}
                                    onChangeText={(val) =>
                                        updateQty(dealerId, item.itemId, val)
                                    }
                                    style={styles.qtyInput}
                                />
                            </View>
                        ))}

                        <TouchableOpacity
                            onPress={() => handleCreatePO(dealerId)}
                            style={styles.createButton}
                        >
                            <Text style={styles.createButtonText}>
                                Create PO
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = {
    pageTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
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
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemName: {
        fontWeight: '600',
    },
    muted: {
        fontSize: 12,
        color: '#6b7280',
    },
    qtyInput: {
        width: 70,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingVertical: 8,
        textAlign: 'center',
        fontSize: 14,
    },
    createButton: {
        marginTop: 12,
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        borderRadius: 10,
    },
    createButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
};
