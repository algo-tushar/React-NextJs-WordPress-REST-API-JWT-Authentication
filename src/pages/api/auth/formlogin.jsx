import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { wpApi } from '../../../utils/wpApi';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, password } = req.body;

            const response = await wpApi.post('/jwt-auth/v1/token', {
                username,
                password,
            });

            const jwtToken = response.data.token;

            // Decode the JWT token 
            const decodedToken = jwt.decode(jwtToken);
            const expiresAt = decodedToken.exp; // This is jwt token expiring time
            const userId = decodedToken.data.user.id; // This is the user ID

            if ( parseInt(userId) <= 0 ) {
                res.status(401).json({ success: false, message: 'Authentication failed. Invalid UserId' });
            } else {
                // Calculate maxAge in seconds
                const maxAge = expiresAt - Math.floor(Date.now() / 1000);

                res.setHeader('Set-Cookie', cookie.serialize('token', jwtToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge, // Use calculated maxAge
                    sameSite: 'strict',
                    path: '/',
                }));

                res.status(200).json({ success: true });
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                res.status(error.response?.status).json({ success: false, message: `${error.response.data.message || 'Something went wrong.'}` });
            } else if (error.request) {
                // The request was made but no response was received
                res.status(503).json({ success: false, message: 'No response from the server. Please try again later' });
            }
            else {
                // Something happened in setting up the request that triggered an Error
                res.status(401).json({ success: false, message: `Request error: ${error.message}` });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}