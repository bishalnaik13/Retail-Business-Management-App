import { PurchaseOrderStatus } from '../constants/purchaseOrderStatus';
export default class PurchaseOrder {
  constructor({
    id,
    dealerId,
    date,
    items, // [{ itemId, name, orderQty, receivedQty }]
    status = PurchaseOrderStatus.ORDERED, // ORDERED | PARTIALLY_RECEIVED | RECEIVED
  }) {
    this.id = id;
    this.dealerId = dealerId;
    this.date = date;
    this.items = items.map((i) => ({
      itemId: i.itemId,
      name: i.name,
      orderQty: i.orderQty,
      receivedQty: i.receivedQty || 0,
      rate: Number(i.rate) || 0, // 👈 REQUIRED
    }));

    this.status = status;
  }
}
