import { useRouter } from 'next/router';
import { useState } from 'react';
import { authenticate } from '../utils/auth';

const LoginForm = ({ setErrorMessage }) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        setIsSubmitting(true);

        try {
            const result = await authenticate(username, password);

            if (result.data.success) {
                router.push('/profile'); // Redirect to the profile after logging in
            } else {
                setErrorMessage('Authentication failed. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (err) {
            setErrorMessage(err.message);
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-sm mt-4 mb-6">If you have an account, please login</p>
            
            <form onSubmit={handleSubmit}>
                <label className="block dark:text-gray-300 mb-4">
                    Username or Email:
                    <input 
                        type="text" 
                        name="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username or email..."
                        required
                        className="w-full px-4 py-3 rounded-lg mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <label className="block dark:text-gray-300 mb-3">
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password..."
                        required
                        className="w-full px-4 py-3 rounded-lg mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <div className="text-right">
                    <a href="#" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Submitting...' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;