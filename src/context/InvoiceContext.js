import { createContext, useState } from 'react';

export const InvoiceContext = createContext();

export function InvoiceProvider({children}){
    const [invoices, setInvoices] = useState([]);
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