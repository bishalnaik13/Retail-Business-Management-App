import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

import StockItem from '../models/StockItem';

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    const [items, setItems] = useState([]);
    const [adjustments, setAdjustments] = useState([]);

    const addItem = (itemData) => {
        const newItem = new StockItem({
            id: Date.now().toString(),
            ...itemData,
        });

        setItems((prevItems) => [...prevItems, newItem]);
    };

    const reduceStockBatch = (invoiceItems) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                const soldItem = invoiceItems.find(
                    (i) => i.id === item.id
                );
                if (soldItem) {
                    return {
                        ...item,
                        quantity: item.quantity - soldItem.billedQty,
                    };
                }
                return item;
            })
        );
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
            } catch (error) {
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
            } catch (error) {
                console.error("Failed to save inventory", error);
            }
        };
        saveInventory();
    }, [items]);

    //Adjust stock manually with mandatory reason.
    const adjustStock = (itemId, change, reason) => {
        if (!reason) {
            throw new Error("Adjustment reason is required");
        }
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        quantity: item.quantity + change,
                    };
                }
                return item;
            })
        );
        setAdjustments((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                itemId,
                change,
                reason,
                date: new Date().toISOString(),
            },
        ]);
    }

    const canReduceStock = (invoiceItems) => {
        for (let invItem of invoiceItems) {
            const stockItem = items.find((i) => i.id === invItem.id);
            if (!stockItem || stockItem.quantity < invItem.billedQty) {
                return false;
            }
        }
        return true;
    };

    return (
        <InventoryContext.Provider
            value={{
                items,
                addItem,
                canReduceStock,
                reduceStockBatch,
                adjustStock,
                adjustments,
                lowStockItems,
                orderListByDealer,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}