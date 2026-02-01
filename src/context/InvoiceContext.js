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
                    const parsed = JSON.parse(stored);
                    const normalized = parsed.map(normalizeInvoice);
                    setInvoices(normalized);
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
        setInvoices((prev) => [...prev, normalizeInvoice(invoice)]);
    };
    const getInvoicesByCustomer = (customerId) => {
        return invoices.filter(
            (inv) => inv.customerId === customerId
        );
    };
    const updateInvoicePayment = (invoiceNo, amount) => {
        setInvoices((prev) =>
            prev.map((inv) => {
                if (inv.invoiceNo === invoiceNo) {
                    const currentPaid = Number(inv.paidAmount) || 0;
                    const newPaid = currentPaid + amount;

                    const balance = Math.max(inv.total - newPaid, 0);

                    let status = inv.paymentStatus;
                    if (balance === 0) status = 'PAID';
                    else if (newPaid > 0) status = 'PARTIAL';

                    return {
                        ...inv,
                        paidAmount: newPaid,
                        balanceAmount: balance,
                        paymentStatus: status,
                    };
                }
                return inv;
            })
        );
    };
    const normalizeInvoice = (invoice) => {
        const paidAmount = Number(invoice.paidAmount) || 0;
        const total = Number(invoice.total) || 0;

        return {
            ...invoice,
            paidAmount,
            balanceAmount:
                typeof invoice.balanceAmount === 'number'
                    ? invoice.balanceAmount
                    : Math.max(total - paidAmount, 0),
        };
    };
    /**
 * Settles a customer payment across invoices (oldest first).
 */
    const settleCustomerPayment = (customerId, amount) => {
        let remaining = amount;

        setInvoices((prevInvoices) =>
            prevInvoices.map((inv) => {
                if (
                    inv.customerId !== customerId ||
                    inv.balanceAmount === 0 ||
                    remaining === 0
                ) {
                    return inv;
                }

                const settleAmount = Math.min(inv.balanceAmount, remaining);
                const newPaid = inv.paidAmount + settleAmount;
                const newBalance = inv.total - newPaid;

                remaining -= settleAmount;

                let status = inv.paymentStatus;
                if (newBalance === 0) status = 'PAID';
                else status = 'PARTIAL';

                return {
                    ...inv,
                    paidAmount: newPaid,
                    balanceAmount: newBalance,
                    paymentStatus: status,
                };
            })
        );
    };



    return (
        <InvoiceContext.Provider
            value={{
                invoices,
                addInvoice,
                getInvoicesByCustomer,
                updateInvoicePayment,
                settleCustomerPayment,
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
}