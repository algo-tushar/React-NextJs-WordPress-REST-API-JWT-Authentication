import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { wpApi } from '../../../utils/wpApi';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { token } = req.body; // Assuming you send Google token in request body

            // Exchange Google token for JWT token from your backend
            const response = await wpApi.post('/google-jwt-auth/v1/token', {
                google_token: token,
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
            res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}