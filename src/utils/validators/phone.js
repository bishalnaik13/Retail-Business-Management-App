/**
 * Basic phone number validation (India-friendly).
 */
export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}
