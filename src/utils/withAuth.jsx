import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';

export function withAuth(handler) {
    return async (context) => {
        const cookies = parseCookies(context);
        const token = cookies.token;

        if (!token) {
			return {
				redirect: {
					destination: '/login',
					permanent: false,
				},
			};
        }

        try {
			const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
            const userId = decodedToken.data?.user?.id;

            if (!userId) {
                throw new Error('Invalid token: user ID not found');
            }

            context.user = { id: userId, token };


			/*
			// validate the token with the server
			import { wpApi } from './axios';
			const response = await wpApi.post('/jwt-auth/v1/token/validate', null, {
                headers: {
					'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
			*/
			
			return handler(context);
        } catch (error) {
			return {
				redirect: {
					destination: '/login',
					permanent: false,
				},
			};
        }
    };
}