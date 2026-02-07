import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DealersScreen from '../screens/DealersScreen';
import DealerHistoryScreen from '../screens/DealerHistoryScreen';
import DealerFormScreen from '../screens/DealerFormScreen';
import DealerPaymentScreen from '../screens/DealerPaymentScreen';

const Stack = createNativeStackNavigator();

export default function DealerStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DealerList"
                component={DealersScreen}
                options={{ title: 'Dealers' }}
            />
            <Stack.Screen
                name="DealerForm"
                component={DealerFormScreen}
                options={{ title: 'Add Dealer' }}
            />
            <Stack.Screen
                name="DealerHistory"
                component={DealerHistoryScreen}
                options={{ title: 'Dealer Details' }}
            />
            <Stack.Screen
                name="DealerPayment"
                component={DealerPaymentScreen}
                options={{ title: 'Pay Dealer' }}
            />
        </Stack.Navigator>
    );
}