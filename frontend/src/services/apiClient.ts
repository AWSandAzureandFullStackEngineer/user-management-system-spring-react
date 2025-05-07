import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Retrieve the API base URL from environment variables
// Ensure VITE_API_BASE_URL is defined in your .env file (e.g., VITE_API_BASE_URL=http://localhost:8080/api/v1)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Creates and configures an Axios instance for API calls.
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log('Starting Request:', config.method?.toUpperCase(), config.url, config.data);
        return config;
    },
    (error: AxiosError) => {
        console.error('Request Error Interceptor:', error);
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('Response Received:', response.status, response.data);
        return response;
    },
    (error: AxiosError) => {
        console.error('Response Error Interceptor:', error.response?.status, error.response?.data, error.message);

        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.error('Unauthorized access - 401. Redirecting to login or refreshing token...');
            } else if (status === 403) {
                console.error('Forbidden access - 403.');
            } else if (status === 404) {
                console.error('Resource not found - 404.');
            }
        } else if (error.request) {
            console.error('Network Error: No response received from server.', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);
export default apiClient;
