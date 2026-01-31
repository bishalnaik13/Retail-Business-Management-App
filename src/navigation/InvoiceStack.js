import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InvoiceListScreen from '../screens/InvoiceListScreen';
import InvoiceDetailScreen from '../screens/InvoiceDetailScreen';
import InvoicePaymentScreen from '../screens/InvoicePaymentScreen';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InvoiceList" 
        component={InvoiceListScreen}
        options={{ title: 'Invoices' }} 
        />
      <Stack.Screen 
        name="InvoiceDetail" 
        component={InvoiceDetailScreen} 
        options={{ title: 'Invoice Details' }}
        />
      <Stack.Screen 
        name="InvoicePayment" 
        component={InvoicePaymentScreen}
        options={{title: 'Record Payment'}} 
        />
    </Stack.Navigator>
  );
}
