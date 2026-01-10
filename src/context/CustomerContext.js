import { createContext, useState } from 'react';
import Customer from '../models/Customer';

export const CustomerContext = createContext();

export function CustomerProvider({ children}){
    const [customers, setCustomers] = useState([]);
    const addCustomer = (customerData) => {
        const newCustomer = new Customer({
            id: DataTransfer.now().toString(),
            ...customerData,
        });
        setCustomers((prev) => [...prev, newCustomer]);
    };

    //Increase pending amount after a credit sale.

    const addPendingAmount = (customerId, amount) => {
        setCustomers((prevCustomers) => 
            prevCustomers.map((customer) => 
                customer.id === customerId
                    ?{
                        ...customer,
                        pendingAmount: customer.pendingAmount + amount,
                    }
                    : customer
                )
            );
    };

    return (
        <CustomerContext.Provider value={{
            customers,
            addCustomer,
            addPendingAmount,
        }}
        >
            {children}
        </CustomerContext.Provider>
    );
    
}