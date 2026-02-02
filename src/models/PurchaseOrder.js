export default class PurchaseOrder {
  constructor({
    id,
    dealerId,
    date,
    items, // [{ itemId, name, orderQty }]
    status = 'DRAFT', // DRAFT | ORDERED | RECEIVED
  }) {
    this.id = id;
    this.dealerId = dealerId;
    this.date = date;
    this.items = items;
    this.status = status;
  }
}
