import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

const clientId = '366811059412-ujt8dr37gnjr6ml7q2kf54gk89elhnjo.apps.googleusercontent.com';

const GoogleSignIn = ({ onSignIn }) => {
  const handleLoginSuccess = (response) => {
    const token = response.credential;
    onSignIn(token);
  };

  const handleLoginFailure = (response) => {
    console.error('Google Login Failed', response);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;

