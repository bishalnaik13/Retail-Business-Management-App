import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { PurchaseOrderContext } from '../context/PurchaseOrderContext';
import { DealerContext } from '../context/DealerContext';
import { PurchaseOrderStatus } from '../constants/purchaseOrderStatus';

export default function PurchaseOrderListScreen({ navigation }) {
  const { purchaseOrders } = useContext(PurchaseOrderContext);
  const { dealers } = useContext(DealerContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', marginBottom: 12 }}>
        Purchase Orders
      </Text>

      {purchaseOrders.length === 0 ? (
        <Text style={{ color: 'gray' }}>
          No purchase orders created
        </Text>
      ) : (
        <FlatList
          data={purchaseOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const dealer = dealers.find(
              (d) => d.id === item.dealerId
            );

            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.status !== PurchaseOrderStatus.RECEIVED){
                    navigation.navigate('GoodsReceipt', { po: item });
                  }
                    
                }}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: '#ffffff',
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor:
                    item.status === PurchaseOrderStatus.RECEIVED
                      ? '#16a34a'
                      : '#e5e7eb',
                  opacity:
                    item.status === PurchaseOrderStatus.RECEIVED ? 0.5 : 1,
                }}
              >
                <Text style={{ fontWeight: '600' }}>
                  Dealer: {dealer?.name || 'Unknown'}
                </Text>
                <Text>Status: {item.status}</Text>

                {item.status !== PurchaseOrderStatus.RECEIVED && (
                  <Text style={{ color: '#2563eb', marginTop: 4 }}>
                    Tap to receive goods
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
