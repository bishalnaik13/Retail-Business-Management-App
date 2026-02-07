export default class DealerLedgerEntry {
  constructor({
    id,
    dealerId,
    date,
    type,      // 'DEBIT' | 'CREDIT'
    amount,
    reference, // PO ID / payment ref
    note = '',
  }) {
    this.id = id;
    this.dealerId = dealerId;
    this.date = date;
    this.type = type;
    this.amount = amount;
    this.reference = reference;
    this.note = note;
  }
}
