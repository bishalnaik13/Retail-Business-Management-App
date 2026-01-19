import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InventoryScreen from '../screens/InventoryScreen';
import InventoryFormScreen from '../screens/InventoryFormScreen';

const Stack = createNativeStackNavigator();

export default function InventoryStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="InventoryList"
                component={InventoryScreen}
                options={{ title: 'Inventory' }}
            />
            <Stack.Screen
                name="InventoryForm"
                component={InventoryFormScreen}
                options={{ title: 'Add Inventory Item' }}
            />
        </Stack.Navigator>
    );
}