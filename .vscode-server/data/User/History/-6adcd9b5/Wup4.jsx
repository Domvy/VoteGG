import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginoutModal from '../../../Modals/LoginoutModal/LoginoutModal'
import './LoginoutButton.css'

const LoginoutButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  console.log(token);
  const username = token ? getUsernameFromToken(token) : "";

  const openModal = () => {

  }

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
      (
        <button type="button" onClick={openModal} className="logout-button">
          {username} 님
        </button >
      ) : (
        <button type="button" onClick={handleLoginClick} className="login-button">
          Login
        </button >
      )

  )
}

export default LoginoutButton;

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username; // Extract username
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
}