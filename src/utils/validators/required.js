/**
 * Checks if a value is present (not null, undefined, or empty string).
 */

export function isRequired(value) {
    return value !== null && value !== undefined && value !== '';
}