import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import DashboardScreen from "../screens/DashboardScreen";
//import CustomersScreen from "../screens/CustomersScreen";
import BillingScreen from "../screens/BillingScreen";
import DealersScreen from "../screens/DealersScreen";
import InventoryScreen from "../screens/InventoryScreen";
import MoreScreen from "../screens/MoreScreen";
import CustomerStack from "./CustomerStack";
import DealerStack from "./DealerStack";
import InventoryStack from "./InventoryStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Customers" component={CustomerStack} />
            <Tab.Screen name="Billing" component={BillingScreen} />
            <Tab.Screen name="Dealers" component={DealerStack} />
            <Tab.Screen name="Stock" component={InventoryStack} />
            <Tab.Screen name="More" component={MoreScreen} />
        </Tab.Navigator>
    );
}