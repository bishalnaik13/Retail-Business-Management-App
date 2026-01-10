
export default class Customer {
    constructor({
        id,
        name, 
        phone,
        creditLimit,
        pendingAmount = 0,
    }){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.creditLimit = creditLimit;
        this.pendingAmount = pendingAmount;
    }
}