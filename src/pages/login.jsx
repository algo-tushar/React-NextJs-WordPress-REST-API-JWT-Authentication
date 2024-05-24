import Image from 'next/image';
import { useState } from 'react';
import { FaTimes, FaTimesCircle } from 'react-icons/fa';
import loginBg from '../assets/images/login-bg.jpeg';
import AuthWithGoogle from '../components/AuthWithGoogle';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
	const [errorMessage, setErrorMessage] = useState('');

  	return (
		<section className="border-red-500 min-h-screen flex items-center justify-center w-full lg:w-[800px]">
			<div className="bg-white dark:bg-dark flex flex-col md:flex-row gap-10 p-10 rounded-2xl shadow-lg w-full">
				<div className="md:w-1/2">
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
					
					<LoginForm setErrorMessage={setErrorMessage} />

					<div className="mt-7 grid grid-cols-3 items-center text-gray-500">
						<hr className="border-gray-500" />
						<p className="text-center text-sm">OR</p>
						<hr className="border-gray-500" />
					</div>

					<AuthWithGoogle setErrorMessage={setErrorMessage} />

					<div className="text-sm flex justify-between items-center mt-3">
						<p>If you don&apos;t have an account...</p>
						<a className="py-2 px-5 ml-3 bg-white dark:bg-black border rounded-xl hover:scale-110 duration-300 border-blue-400" href="">Sign up</a>
					</div>
				</div>
				<div className="w-1/2 md:block hidden">
					<Image
						src={loginBg}
						className="rounded-2xl h-full object-cover"
						alt="page img"
						width={360}
						height={550}
						/>
				</div>
			</div>
		</section>
	);
};

export default LoginPage;