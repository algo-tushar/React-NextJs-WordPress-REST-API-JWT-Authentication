import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import googleIcon from '../assets/images/googleIcon.svg';

const AuthWithGoogle = ({ setErrorMessage }) => {
    const router = useRouter();

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            setErrorMessage('');
            
            try {
                const result = await axios.post('/api/auth/googlelogin', {
                    token: response.access_token,
                });
                
                if (result.data.success) {
                    router.push('/profile'); // Redirect to the profile after logging in
                } else {
                    setErrorMessage('Authentication failed. Please try again.');
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(''), 3000);
            }
        },
        onError: () => {
            setErrorMessage('Login Failed');
            setTimeout(() => setErrorMessage(''), 3000);
        },
    });

    return (
        <button 
            onClick={() => login()} 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 flex items-center justify-center rounded-lg px-5 py-3 w-full mt-6">
            <span className="mr-2">
                <Image src={googleIcon} alt="Google" height={20} width={20} />
            </span>
            <span className="text-gray-700 dark:text-white text-base">Sign in with Google</span>
        </button>
    );  
};

export default AuthWithGoogle;