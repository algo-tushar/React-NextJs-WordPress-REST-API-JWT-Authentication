import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa';
import { wpApi } from '../utils/wpApi';

const UpdateProfile = ({ token, userId }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        nickname: '',
        name: '',
        description: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await wpApi.get(`/wp/v2/users/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const { name, description, meta } = response.data;

                setFormData({
                    first_name: meta.first_name,
                    last_name: meta.last_name,
                    nickname: meta.nickname,
                    name,
                    description
                });
            } catch (error) {
                setErrorMessage('Error fetching user data.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        };

        fetchUserData();
    }, [token, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const generateDisplayNameOptions = () => {
        const { first_name, last_name, nickname } = formData;
        const options = [];
        if (first_name && last_name) {
            options.push(`${first_name} ${last_name}`, `${last_name} ${first_name}`);
        }
        if (first_name) {
            options.push(first_name);
        }
        if (last_name) {
            options.push(last_name);
        }
        if (nickname) {
            options.push(nickname);
        }
        return options;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const { first_name, last_name, nickname, name } = formData;

        if (!first_name || !last_name || !nickname || !name) {
            setErrorMessage('Please fill in all required fields.');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await wpApi.put(`/wp/v2/users/${userId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {successMessage && (
                <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto bg-green-500 text-white p-4 rounded-md shadow-lg transition duration-300 ease-in-out transform translate-y-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaCheck className="w-6 h-6 mr-2" />
                            <p dangerouslySetInnerHTML={{ __html: successMessage }} />
                        </div>
                        <button onClick={() => setSuccessMessage('')} className="text-white ml-3 focus:outline-none">
                            <FaTimesCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
            {errorMessage && (
                <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto bg-red-500 text-white p-4 rounded-md shadow-lg transition duration-300 ease-in-out transform translate-y-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaTimes className="w-6 h-6 mr-2" />
                            <p dangerouslySetInnerHTML={{ __html: errorMessage }} />
                        </div>
                        <button onClick={() => setErrorMessage('')} className="text-white ml-3 focus:outline-none">
                            <FaTimesCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="block dark:text-gray-300">
                        First Name:
                        <input 
                            type="text" 
                            name="first_name" 
                            value={formData.first_name} 
                            onChange={handleChange} 
                            placeholder="Enter your first name..."
                            required
                            className="w-full px-4 py-3 rounded-lg mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                        />
                    </label>
                    <label className="block dark:text-gray-300">
                        Last Name:
                        <input 
                            type="text" 
                            name="last_name" 
                            value={formData.last_name} 
                            onChange={handleChange} 
                            placeholder="Enter your last name..."
                            required
                            className="w-full px-4 py-3 rounded-lg mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                        />
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="block dark:text-gray-300">
                        Nickname:
                        <input 
                            type="text" 
                            name="nickname" 
                            value={formData.nickname} 
                            onChange={handleChange} 
                            placeholder="Enter a nickname..."
                            required
                            className="w-full px-4 py-3 rounded-lg mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                        />
                    </label>
                    <label className="block dark:text-gray-300">
                        Display Name:
                        <select
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Select a display name..."
                            required
                            className="w-full px-4 py-3 rounded-lg mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                        >
                            {generateDisplayNameOptions().map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <label className="block mb-4 dark:text-gray-300">
                    Description:
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows="4" 
                        placeholder="Write yourself here..."
                        className="w-full px-4 py-3 rounded-lg mt-2 bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                    ></textarea>
                </label>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Submitting...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;