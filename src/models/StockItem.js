export default class StockItem {
  constructor({
    id,
    name,
    hsn,
    unit,
    rate,
    quantity,
    minStock,
    dealerId,
  }) {
    this.id = id;                 // Unique item identifier
    this.name = name;             // Item name (e.g., PVC Pipe 1 inch)
    this.hsn = hsn;               // HSN code for taxation
    this.unit = unit;             // Unit (pcs, kg, box, etc.)
    this.rate = rate;             // Selling price per unit
    this.quantity = quantity;     // Current stock quantity
    this.minStock = minStock;     // Minimum stock threshold
    this.dealerId = dealerId;     // Supplier reference
  }
}