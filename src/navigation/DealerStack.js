import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DealersScreen from '../screens/DealersScreen';
import DealerHistoryScreen from '../screens/DealerHistoryScreen';

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
                name="DealerHistory"
                component={DealerHistoryScreen}
                options={{ title: 'Dealer Details' }}
            />
        </Stack.Navigator>
    );
}