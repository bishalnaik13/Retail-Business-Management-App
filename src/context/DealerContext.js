import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEALER_STORAGE_KEY = 'DEALERS_DATA';
const DEALER_LEDGER_KEY = 'DEALER_LEDGER';


import Dealer from '../models/Dealer';
import DealerLedgerEntry from '../models/DealerLedgerEntry';

export const DealerContext = createContext();

export function DealerProvider({ children }) {
    const [dealers, setDealers] = useState([]);
    const [ledgerEntries, setLedgerEntries] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const storedDealers = await AsyncStorage.getItem(DEALER_STORAGE_KEY);
            const storedLedger = await AsyncStorage.getItem(DEALER_LEDGER_KEY);

            if (storedDealers) setDealers(JSON.parse(storedDealers));
            if (storedLedger) setLedgerEntries(JSON.parse(storedLedger));
        };

        loadData();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(
            DEALER_STORAGE_KEY,
            JSON.stringify(dealers)
        );
    }, [dealers]);

    useEffect(() => {
        AsyncStorage.setItem(
            DEALER_LEDGER_KEY,
            JSON.stringify(ledgerEntries)
        );
    }, [ledgerEntries]);



    const addDealer = (dealerData) => {
        const newDealer = new Dealer({
            id: Date.now().toString(),
            ...dealerData,
        });
        setDealers((prev) => [...prev, newDealer]);
    };

    //Update dealer payment after a purchase or payment
    const updateDealerPayment = (dealerId, billedAmount = 0, paidAmount = 0) => {
        setDealers((prevDealers) =>
            prevDealers.map((dealer) => {
                if (dealer.id === dealerId) {
                    const totalBilled = dealer.totalBilled + billedAmount;
                    const totalPaid = dealer.paidAmount + paidAmount;

                    return {
                        ...dealer,
                        totalBilled,
                        paidAmount: totalPaid,
                        pendingAmount: totalBilled - totalPaid,
                    };
                }
                return dealer;
            })
        );
    };

    //Add ledger entry helper
    const addDealerLedgerEntry = ({
        dealerId,
        type,
        amount,
        reference,
        note = '',
    }) => {
        setLedgerEntries((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                dealerId,
                date: new Date().toISOString(),
                type,
                amount,
                reference,
                note,
            },
        ]);
    };

    //Derive dealer pending from ledger
    const getDealerPendingAmount = (dealerId) => {
        const entries = ledgerEntries.filter(
            (e) => e.dealerId === dealerId
        );

        let balance = 0;

        entries.forEach((e) => {
            if (e.type === 'DEBIT') balance += e.amount;
            if (e.type === 'CREDIT') balance -= e.amount;
        });

        return Math.max(balance, 0);
    };


    return (
        <DealerContext.Provider
            value={{
                dealers,
                addDealer,
                updateDealerPayment,
                ledgerEntries,
                addDealerLedgerEntry,
                getDealerPendingAmount,
            }}
        >
            {children}
        </DealerContext.Provider>
    );
}