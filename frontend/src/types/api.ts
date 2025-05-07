

/**
 * Represents a standardized error response from the API.
 * This could be used by a global API client or error handling utility.
 */
export interface ApiErrorResponse {
    timestamp: string; // ISO 8601 date string
    status: number;    // HTTP status code
    error: string;     // Short error description (e.g., "Bad Request", "Not Found")
    message: string;   // Detailed error message
    path: string;      // The API path that caused the error
    validationErrors?: Record<string, string>; // Optional: For field-specific validation errors
}

/**
 * Represents a generic paginated API response structure.
 */
export interface PaginatedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLast: boolean;
}
