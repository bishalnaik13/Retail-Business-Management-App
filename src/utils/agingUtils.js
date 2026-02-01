/**
 * Returns aging bucket for an invoice based on due date.
 */
export const getAgingBucket = (invoice) => {
  if (invoice.balanceAmount <= 0) return null;

  const today = new Date();
  const due = new Date(invoice.dueDate);

  const diffInDays = Math.floor(
    (today - due) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays <= 0) return '0-30';
  if (diffInDays <= 30) return '0-30';
  if (diffInDays <= 60) return '31-60';
  return '60+';
};
