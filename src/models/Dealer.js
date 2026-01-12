export default class Dealer {
    constructor({
        id,
        name,
        phone,
        totalBilled = 0,
        totalAmount = 0,
    }) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.totalBilled = totalBilled;
        this.totalAmount = totalAmount;
        this.pendingAmount = this.totalBilled - this.totalAmount;
    }
}