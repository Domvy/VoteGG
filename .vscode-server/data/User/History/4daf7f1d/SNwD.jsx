import React from 'react';

const LoginButton = ({ onClick, buttonText }) => {
  return (
    <button type="button" onClick={onClick} className="login-login-button">
      Login
    </button>
  );
};

export default LoginButton;