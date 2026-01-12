import { View, Text } from 'react-native';
import { useContext } from 'react';

import { DealerContext } from '../context/DealerContext';

export default function DealerHistoryScreen({ route }) {
    const { dealerId, dealerName } = route.params;
    const { dealers } = useContext(DealerContext);

    const dealer = dealers.find((d) => d.id === dealerId);

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
            <Text>Total Billed: ₹{dealer.totalBilled}</Text>
            <Text>Paid Amount: ₹{dealer.paidAmount}</Text>
            <Text>Pending Amount: ₹{dealer.pendingAmount}</Text>
            <Text style={{ marginTop:10, fontStyle: 'italic'}}>
                Detailed purchase and payment history will be added here soon.
            </Text>
        </View>
    );
}