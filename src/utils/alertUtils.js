//Check for customer credit limit violations.

export function checkCreditLimitAlerts(customers) {
    customers.forEach((customer) => {
        if (customer.pendingAmount > customer.creditLimit) {
            console.log(
                `ALERT: ${customer.name} exceed credit limit. Pending ₹${customer.pendingAmount}`
            );

            //WhatsApp Notification Logic Here
            //At this point, a backend service could trigger
            // a WhatsApp message using the customer's phone number.
        }
    });
}

export function checkDueDateAlerts(invoices) {
    const today = new Date();
    invoices.forEach((invoice) => {
        if (invoice.paymentStatus === 'pending') {
            const dueDate = new Date(invoice.dueDate);
            if (dueDate < today) {
                console.log(
                    `REMINDER: Invoice #${invoice.id} for ${invoice.customerName} is overdue. Due date was ${invoice.dueDate}`
                );
            }
        }
    });
}