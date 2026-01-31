export default class CustomerLedgerEntry {
    constructor({
        id,
        customerId,
        date,
        type,      // 'DEBIT' | 'CREDIT'
        amount,
        reference, // invoice no / payment ref
        note = '',
    }) {
        this.id = id;
        this.customerId = customerId;
        this.date = date;
        this.type = type;
        this.amount = amount;
        this.reference = reference;
        this.note = note;
    }
}
