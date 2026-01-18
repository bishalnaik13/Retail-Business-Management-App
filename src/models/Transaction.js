export default class Transaction {
    constructor({
        id,
        date,
        amount,
        type,
        reference,
    }) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        //type should be one of TransactionType enum values.
        this.type = type;   
        this.reference = reference;
    }
}