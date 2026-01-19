import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

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

    useEffect(() => {
        const loadInventory = async () => {
            try {
                const storedItems = await AsyncStorage.getItem(STORAGE_KEYS.INVENTORY);
                if (storedItems) {
                    setItems(JSON.parse(storedItems));
                }
            }catch (error) {
                console.error("Failed to load inventory", error);
            }
        };
        loadInventory();
    }, [])

    useEffect(() => {
        const saveInventory = async () => {
            try {
                await AsyncStorage.setItem(
                    STORAGE_KEYS.INVENTORY,
                    JSON.stringify(items)
                );
            }catch (error){
                console.error("Failed to save inventory", error);
            }
        };
        saveInventory();
    }, [items]);

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