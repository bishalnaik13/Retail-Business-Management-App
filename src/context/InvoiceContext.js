import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants/storageKeys';

export const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
    const [invoices, setInvoices] = useState([]);
    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEYS.INVOICES);
                if (stored) {
                    setInvoices(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Failed to load invoices', e);
            }
        };
        loadInvoices();
    }, []);

    useEffect(() => {
        const saveInvoices = async () => {
            try {
                await AsyncStorage.setItem(
                    STORAGE_KEYS.INVOICES,
                    JSON.stringify(invoices)
                );
            } catch (e) {
                console.error('Failed to save invoices', e);
            }
        };
        saveInvoices();
    }, [invoices]);

    const addInvoice = (invoice) => {
        setInvoices((prev) => [...prev, invoice]);
    };
    const getInvoicesByCustomer = (customerId) => {
        return invoices.filter(
            (inv) => inv.customerId === customerId
        );
    };

    return (
        <InvoiceContext.Provider
            value={{
                invoices,
                addInvoice,
                getInvoicesByCustomer,
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
}