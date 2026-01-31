import { createContext, useState } from 'react';
import Customer from '../models/Customer';

export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState([]);
    const [ledgerEntries, setLedgerEntries] = useState([]);

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
        setCustomers((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                ...customerData,
            },
        ]);
    };

    const addLedgerEntry = ({
        customerId,
        type,
        amount,
        reference,
        note = '',
    }) => {
        setLedgerEntries((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                customerId,
                date: new Date().toISOString(),
                type,
                amount,
                reference,
                note,
            },
        ]);
    };

    const getCustomerPendingAmount = (customerId) => {
        const entries = ledgerEntries.filter(
            (e) => e.customerId === customerId
        );

        return Math.max(
            entries.reduce((balance, e) => {
                if (e.type === 'DEBIT') return balance + e.amount;
                if (e.type === 'CREDIT') return balance - e.amount;
                return balance;
            }, 0),
            0
        );
    };


    /**
   * Check whether customer can take more credit
   * Business rule: pending + newAmount <= creditLimit
   */
    const canUseCredit = (customerId, invoiceAmount) => {
        const customer = customers.find(c => c.id === customerId);

        if (!customer) return false;

        const pending = getCustomerPendingAmount(customerId);

        // No credit limit means no credit allowed
        if (customer.creditLimit === 0) {
            return invoiceAmount === 0;
        }

        return pending + invoiceAmount <= customer.creditLimit;
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
            ledgerEntries,
            addLedgerEntry,
            getCustomerPendingAmount,
            canUseCredit,
        }}
        >
            {children}
        </CustomerContext.Provider>
    );

}