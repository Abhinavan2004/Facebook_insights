import React from 'react';
import FacebookLoginPkg from 'react-facebook-login';
const FacebookLogin = FacebookLoginPkg.default || FacebookLoginPkg;

const FacebookLoginComponent = ({ onLogin }) => {
  const responseFacebook = (response) => {
    console.log("FB Login Response:", response);
    // If we receive an accessToken, the login was successful.
    if (response.accessToken) {
      onLogin(response);
    } else {
      console.error("Login failed or was cancelled.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Connect your Facebook Account</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Grant access to view Page Insights.</p>
      <FacebookLogin
        appId="2206085413130745" 
        autoLoad={false}
        fields="name,email,picture"
        scope="pages_show_list,pages_read_engagement,pages_read_user_content"
        callback={responseFacebook}
        icon="fa-facebook"
      />
    </div>
  );
};

export default FacebookLoginComponent;
