import { createContext, useState } from 'react';

import { Dealer } from '../models/Dealer';

export const DealerContext = createContext();

export function DealerProvider({children}){
    const [dealers, setDealers] = useState([]);

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

    return (
        <DealerContext.Provider
        value={{
            dealers,
            addDealer,
            updateDealerPayment,
        }}
        >
            {children}
        </DealerContext.Provider>
    );
}