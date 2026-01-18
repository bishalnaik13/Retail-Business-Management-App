/**
 * Payment status enum.
 * Used across invoices and customer settlements.
 */
export const PaymentStatus = Object.freeze({
    PAID: 'PAID',
    PENDING: 'PENDING',
    PARTIAL: 'PARTIAL',
});