import axios from 'axios';

export const authenticate = async (username, password) => {
    try {
        const response = await axios.post('/api/auth/formlogin', {
            username,
            password,
        });

        return response;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code outside of the 2xx range
            if (error.response.status === 403) {
                throw new Error(error.response.data.message || 'Forbidden. Please check your credentials.');
            } else if (error.response.status === 401) {
                throw new Error('Unauthorized. Please check your username and password.');
            } else {
                throw new Error(`Error: ${error.response.data.message || 'Something went wrong.'}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from the server. Please try again later.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Request error: ${error.message}`);
        }
    }
};