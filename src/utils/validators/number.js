/**
 * Checks if value is a valid positive number.
 */

export function isPositiveNumber(value){
    const num = Number(value);
    return !isNaN(num) && num > 0;
}