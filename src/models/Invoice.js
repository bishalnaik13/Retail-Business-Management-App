

export default class Invoice {
    constructor({
        invoiceNo,
        date,
        dueDate,
        customerId,
        items,
        subtotal,
        tax,
        total,
        paymentStatus,
    }) {
        this.invoiceNo = invoiceNo;
        this.date = date;
        this.dueDate = this.dueDate;
        this.customerId = customerId;
        this.items = items;
        this.subtotal = subtotal;
        this.tax = tax;
        this.total = total;
        this.paymentStatus = paymentStatus; 
    }
}