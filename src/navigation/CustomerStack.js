import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomersScreen from '../screens/CustomersScreen';
import CustomerHistoryScreen from '../screens/CustomerHistoryScreen';

const Stack = createNativeStackNavigator();

export default function CustomerStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CustomerList"
                component={CustomersScreen}
                options={{ title: 'Customers' }}
            />
            <Stack.Screen
                name="CustomerHistory"
                component={CustomerHistoryScreen}
                options={{ title: 'Billing History' }}
            />
        </Stack.Navigator>
    );
}