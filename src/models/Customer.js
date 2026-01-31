
export default class Customer {
    constructor({
        id,
        name, 
        phone,
        creditLimit = 0,
        creditDays = 0,
        pendingAmount = 0,
    }){
        this.id = id;
        this.name = name;
        this.phone = phone;

        this.creditLimit = creditLimit;
        this.creditDays = creditDays;
        
        this.pendingAmount = pendingAmount;
    }
}