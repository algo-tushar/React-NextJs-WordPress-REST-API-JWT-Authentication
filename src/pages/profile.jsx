import { useState } from 'react';
import UpdateProfile from '../components/UpdateProfile';
import { withAuth } from '../utils/withAuth';

const ProfilePage = ({ user }) => {
    const [token, setToken] = useState(user.token);
    const [userId, setUserId] = useState(user.id);

    if (!token || !userId) {
        return <div>Failed to load profile</div>;
    }

    return (
        <section className="border-red-500 min-h-screen flex items-center justify-center w-full lg:w-[800px]">
			<div className="bg-white dark:bg-dark p-10 rounded-2xl shadow-lg w-full">
                <UpdateProfile token={token} userId={userId} />
            </div>
        </section>
    );
};


export const getServerSideProps = withAuth(async (context) => {
    return {
        props: {
            user: context.user,
        },
        notFound: false,
    };
});

export default ProfilePage;