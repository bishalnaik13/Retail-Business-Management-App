import { View, Text } from 'react-native';
import { useContext, useEffect } from 'react';

import { CustomerContext } from '../context/CustomerContext';
import { InvoiceContext } from '../context/InvoiceContext';
import { 
    checkCreditLimitAlerts,
    checkDueDateAlerts,
} from '../utils/alertUtils';


export default function DashboardScreen() {
    const { customers } = useContext(CustomerContext);
    const { invoices } = useContext(InvoiceContext);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Dashboard</Text>
            <Text>Alerts are checked in background (conceptual).</Text>
        </View>
    );
}