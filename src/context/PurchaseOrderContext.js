import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PurchaseOrder from '../models/PurchaseOrder';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { PurchaseOrderStatus } from '../constants/purchaseOrderStatus';

export const PurchaseOrderContext = createContext();

export function PurchaseOrderProvider({ children }) {
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS)
      .then(data => data && setPurchaseOrders(JSON.parse(data)));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.PURCHASE_ORDERS,
      JSON.stringify(purchaseOrders)
    );
  }, [purchaseOrders]);

  const createPurchaseOrder = ({ dealerId, items }) => {
    const po = new PurchaseOrder({
      id: Date.now().toString(),
      dealerId,
      date: new Date().toISOString(),
      items,
      status: PurchaseOrderStatus.ORDERED,
    });

    setPurchaseOrders((prev) => [...prev, po]);
  };

  const getPOsByDealer = (dealerId) =>
    purchaseOrders.filter((po) => po.dealerId === dealerId);

  const receiveGoods = (poId, receivedItems) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId) return po;

        const updatedItems = po.items.map((item) => {
          const received = receivedItems.find(
            (r) => r.itemId === item.itemId
          );

          if (!received) return item;

          return {
            ...item,
            receivedQty:
              item.receivedQty + Math.min(
                received.qty,
                item.orderQty - item.receivedQty
              ),
          };
        });

        const allReceived = updatedItems.every(
          (i) => i.receivedQty >= i.orderQty
        );

        return {
          ...po,
          items: updatedItems,
          status: allReceived
            ? PurchaseOrderStatus.RECEIVED
            : PurchaseOrderStatus.PARTIALLY_RECEIVED,
        };
      })
    );
  };


  return (
    <PurchaseOrderContext.Provider
      value={{
        purchaseOrders,
        createPurchaseOrder,
        getPOsByDealer,
        receiveGoods,
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
}
