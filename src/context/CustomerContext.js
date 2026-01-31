import { createContext, useState } from 'react';
import Customer from '../models/Customer';

export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState([]);

    /**
   * Add a new customer with credit rules
   */
    const addCustomer = (customerData) => {
        const exists = customers.some(
            (c) => c.phone === customerData.phone
        );

        if (exists) {
            throw new Error('Customer with this phone already exists');
        }
        const newCustomer = new Customer({
            id: Date.now().toString(),
            pendingAmount: 0,
            ...customerData,
        });

        setCustomers((prev) => [...prev, newCustomer]);
    };

    /**
   * Check whether customer can take more credit
   * Business rule: pending + newAmount <= creditLimit
   */
    const canUseCredit = (customerId, invoiceAmount) => {
        const customer = customers.find(
            (c) => c.id === customerId
        );

        if (!customer) return false;

        // No credit limit means no credit allowed
        if (customer.creditLimit === 0) {
            return invoiceAmount === 0;
        }

        return (
            customer.pendingAmount + invoiceAmount <=
            customer.creditLimit
        );
    };

    //Increase pending amount after a credit sale.

    const addPendingAmount = (customerId, amount) => {
        setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
                customer.id === customerId
                    ? {
                        ...customer,
                        pendingAmount: customer.pendingAmount + amount,
                    }
                    : customer
            )
        );
    };

    const getDueDateForCustomer = (customerId, invoiceDate) => {
        const customer = customers.find(c => c.id === customerId);
        if (!customer || customer.creditDays === 0) return null;

        const due = new Date(invoiceDate);
        due.setDate(due.getDate() + customer.creditDays);
        return due.toISOString();
    };


    return (
        <CustomerContext.Provider value={{
            customers,
            addCustomer,
            canUseCredit,
            addPendingAmount,
        }}
        >
            {children}
        </CustomerContext.Provider>
    );

}