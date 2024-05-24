import axios from 'axios';

const apiUrl = (process.env.NEXT_PUBLIC_WP_REST_API_URL || "https://example.com/wp-json").replace(/\/$/, '');

export const wpApi = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});