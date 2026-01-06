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

    const lowStockItems = items.filter(
        (item) => item.quantity < item.minStock
    );

    const orderListByDealer = lowStockItems.reduce((acc, item) => {
        if ( !acc[item.dealerId]){
            acc[item.dealerId] = [];
        }
        acc[item.dealerId].push(item);
        return acc;
    },{});

    return(
        <InventoryContext.Provider 
        value = {{
            items, 
            addItem,
            lowStockItems,
            orderListByDealer,
            }}>
            {children}
        </InventoryContext.Provider>
    );
}