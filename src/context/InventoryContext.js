import { createContext, useState } from 'react';
import StockItem from '../models/StockItem';

export const InventoryContext = createContext();

export function InventoryProvider({ children }){
    const [ items, setItems ] = useState([]);

    const addItem = (itemData) => {
        const newItem = new StockItem({
            id: Date.now().toString(),
            ...itemData,
        });

        setItems((prevItems) => [...prevItems, newItem]);
    };

    return(
        <InventoryContext.Provider value = {{items, addItem}}>
            {children}
        </InventoryContext.Provider>
    );
}