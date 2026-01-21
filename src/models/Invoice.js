

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
        paidAmount = 0,
    }) {
        this.invoiceNo = invoiceNo;
        this.date = date;
        this.dueDate = dueDate;
        this.customerId = customerId;
        this.items = items;
        this.subtotal = subtotal;
        this.tax = tax;
        this.total = total;
        this.paidAmount = paidAmount;
        this.balanceAmount = Math.max(total - paidAmount, 0);
        //paymentStatus should be one of PaymentStatus enum values.
        this.paymentStatus = paymentStatus; 
    }
}