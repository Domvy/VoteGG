import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  console.log(token);
  const username = token ? getUsernameFromToken(token) : "";

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");

    // 로그인 페이지 또는 홈으로 리다이렉트
    navigate('/');
  };


  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    token ?
      (<div>
        <p>Hello! {username} </p>
        {/* <button type="button" onClick={handleLogout} className="login-button">
          Logout
        </button > */}
      </div>

      ) : (
        <button type="button" onClick={handleLoginClick} className="login-button">
          Login
        </button >
      )

  )
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