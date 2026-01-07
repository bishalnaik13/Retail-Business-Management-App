import { createContext, useState } from 'react';
import StockItem from '../models/StockItem';

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    const [items, setItems] = useState([]);

    const addItem = (itemData) => {
        const newItem = new StockItem({
            id: Date.now().toString(),
            ...itemData,
        });

        setItems((prevItems) => [...prevItems, newItem]);
    };

    const reduceStock = (itemId, soldQty) => {
        let isStockAvailable = true;
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId) {
                    if (item.quantity < soldQty) {
                        isStockAvailable = false;
                        return item;
                    }
                    return {
                        ...item,
                        quantity: item.quantity - soldQty,
                    };
                }
                return item;
            })
        );
        return isStockAvailable;
    };


    const lowStockItems = items.filter(
        (item) => item.quantity < item.minStock
    );

    const orderListByDealer = lowStockItems.reduce((acc, item) => {
        if (!acc[item.dealerId]) {
            acc[item.dealerId] = [];
        }
        acc[item.dealerId].push(item);
        return acc;
    }, {});

    return (
        <InventoryContext.Provider
            value={{
                items,
                addItem,
                reduceStock,
                lowStockItems,
                orderListByDealer,
            }}>
            {children}
        </InventoryContext.Provider>
    );
}