import { createContext, useState } from 'react';
import PurchaseOrder from '../models/PurchaseOrder';

export const PurchaseOrderContext = createContext();

export function PurchaseOrderProvider({ children }) {
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const createPurchaseOrder = ({ dealerId, items }) => {
    const po = new PurchaseOrder({
      id: Date.now().toString(),
      dealerId,
      date: new Date().toISOString(),
      items,
    });

    setPurchaseOrders((prev) => [...prev, po]);
  };

  const getPOsByDealer = (dealerId) =>
    purchaseOrders.filter((po) => po.dealerId === dealerId);

  return (
    <PurchaseOrderContext.Provider
      value={{
        purchaseOrders,
        createPurchaseOrder,
        getPOsByDealer,
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
}
