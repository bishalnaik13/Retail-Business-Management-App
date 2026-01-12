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
        this.type = type;   
        this.reference = reference;
    }
}