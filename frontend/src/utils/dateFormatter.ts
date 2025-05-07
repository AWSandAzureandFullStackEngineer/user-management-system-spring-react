// src/utils/dateFormatter.ts

/**
 * Formats an ISO date string or Date object into a more readable format.
 * @param dateInput - The date to format (string or Date object).
 * @param options - Optional Intl.DateTimeFormatOptions.
 * @returns A formatted date string, or an empty string if input is invalid.
 */
export const formatDate = (
    dateInput: string | Date | undefined | null,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!dateInput) {
        return '';
    }

    try {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            // timeZoneName: 'short', // Optional: display time zone
            ...options, // Merge with user-provided options
        };
        return new Intl.DateTimeFormat(navigator.language, defaultOptions).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date'; // Or return the original input, or throw error
    }
};

/**
 * Formats an ISO date string or Date object into a short date format (e.g., MM/DD/YYYY).
 * @param dateInput - The date to format.
 * @returns A formatted short date string.
 */
export const formatShortDate = (dateInput: string | Date | undefined | null): string => {
    return formatDate(dateInput, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

// Example usage:
// import { formatDate } from './path/to/dateFormatter';
// const isoString = "2025-05-06T10:20:30Z";
// const readableDate = formatDate(isoString); // "May 6, 2025, 10:20 AM" (depends on locale)
// const shortDate = formatShortDate(new Date()); // "05/06/2025" (depends on locale)
