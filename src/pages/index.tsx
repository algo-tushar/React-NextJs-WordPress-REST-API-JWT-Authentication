import HomePage from '../components/HomePage';

const Home = () => {
	return (
		<section className="border-red-500 min-h-screen flex items-center justify-center w-full lg:w-[800px]">
			<div className="bg-white dark:bg-dark p-10 rounded-2xl shadow-lg w-full">
				<HomePage />
			</div>
		</section>
	);
};

export default Home;