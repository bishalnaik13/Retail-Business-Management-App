/**
 * StockAdjustment represents a manual stock correction.
 * Used for audit and accountability.
 */
export default class StockAdjustment {
    constructor({
        id,
        itemId,
        change,
        reason,
        date,
    }) {
        this.id = id;           // Unique adjustment ID
        this.itemId = itemId;   // Related stock item
        this.change = change;   // +ve or -ve quantity
        this.reason = reason;   // Damage, loss, correction
        this.date = date;       // Timestamp
    }
}
