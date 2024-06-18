// pages/index.js
import axios from 'axios';
import React, { useState } from 'react';
import GoogleSignIn from '../components/GoogleSignIn';

const Home = () => {
    const [user, setUser] = useState(null);

    const handleGoogleSignIn = async(token) => {
        try {
            const response = await axios.post('http://localhost/wp1/wp-json/custom/v1/google-signin', {
                id_token: token,
            });
            
            if (response.data.status === 'success') {
                setUser(response.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error signing in with Google', error);
        }
    };

  return (
        <div>
        <h1>Sign in with Google</h1>
        {user ? (
            <div>
            <p>Welcome, {user.user_email}</p>
            </div>
        ) : (
            <GoogleSignIn onSignIn={handleGoogleSignIn} />
        )}
        </div>
  );
};

export default Home;
