import { createContext, useState } from "react";

import Transaction from '../models/Transaction';

export const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [cashTransactions ,setCashTransactions] = useState([]);
    const [onlineTransactions ,setOnlineTransactions] = useState([]);

    const addTransaction = ({ amount, type, reference }) => {
        const transaction = new Transaction({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            amount,
            type,
            reference,
        });
        if (type === 'cash') {
            setCashTransactions((prev) => [...prev, transaction]);
        } else {
            setOnlineTransactions((prev) => [...prev, transaction]);
        }
    };

    const getCashTotal = () => 
        cashTransactions.reduce((sum, t) => sum + t.amount, 0);
    const getOnlineTotal = () => 
        onlineTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <TransactionContext.Provider
            value={{
                cashTransactions,
                onlineTransactions,
                addTransaction,
                getCashTotal,
                getOnlineTotal,
            }}
            >
            {children}
        </TransactionContext.Provider>

        );
}