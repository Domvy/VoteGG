import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  console.log(token);
  const username = token ? getUsernameFromToken(token) : "Unknown User";

  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    (
      !token ?
        (          <button type="button" onClick={handleLoginClick} className="login-button">
          Logout
        </button >
        ) : (
          <button type="button" onClick={handleLoginClick} className="login-button">
            Login
          </button >
        )

    ))
}

export default LoginButton;

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username; // Extract username
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
}