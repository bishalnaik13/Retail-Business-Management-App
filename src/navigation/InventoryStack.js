import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InventoryScreen from '../screens/InventoryScreen';
import InventoryFormScreen from '../screens/InventoryFormScreen';
import StockAdjustmentScreen from '../screens/StockAdjustmentScreen';
import CreatePurchaseOrderScreen from '../screens/CreatePurchaseOrderScreen';
import GoodsReceiptScreen from '../screens/GoodsReceiptScreen';
import PurchaseOrderListScreen from '../screens/PurchaseOrderListScreen';

const Stack = createNativeStackNavigator();

export default function InventoryStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="InventoryList"
                component={InventoryScreen}
                options={({ navigation }) => ({
                    title: 'Inventory',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('InventoryForm')}
                            style={{ marginRight: 12 }}
                        >
                            <Text style={{ color: '#2563eb', fontWeight: '700' }}>
                                + Add
                            </Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="InventoryForm"
                component={InventoryFormScreen}
                options={{ title: 'Add Inventory Item' }}
            />
            <Stack.Screen
                name="StockAdjustment"
                component={StockAdjustmentScreen}
                options={{ title: 'Adjust Stock' }}
            />
            <Stack.Screen
                name="CreatePurchaseOrder"
                component={CreatePurchaseOrderScreen}
                options={{ title: 'Purchase Orders' }}
            />
            <Stack.Screen
                name="PurchaseOrderList"
                component={PurchaseOrderListScreen}
                options={{ title: 'Purchase Orders' }}
            />
            <Stack.Screen
                name="GoodsReceipt"
                component={GoodsReceiptScreen}
                options={{ title: 'Goods Receipt' }}
            />


        </Stack.Navigator>
    );
}