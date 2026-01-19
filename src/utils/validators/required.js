/**
 * Checks if a value is present (not null, undefined, or empty string).
 */

export function isRequired(value) {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
}