import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showLogout, setShowLogout] = useState(false); // 로그아웃 버튼 표시 여부 상태
  const username = token ? getUsernameFromToken(token) : "";

  const handleLogout = () => {
    localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 제거
    alert("로그아웃 되었습니다.");
    navigate('/'); // 로그인 페이지 또는 홈으로 리다이렉트
  };

  const handleUsernameClick = () => {
    setShowLogout(!showLogout); // 클릭 시 로그아웃 버튼 표시 여부 토글
  };

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  return token ? (
    <div className="user-info">
      <p
        className="username"
        onClick={handleUsernameClick}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        Welcome, {username}
      </p>
      {showLogout && (
        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
          style={{ marginTop: "10px" }}
        >
          Logout
        </button>
      )}
    </div>
  ) : (
    <button type="button" onClick={handleLoginClick} className="login-button">
      Login
    </button>
  );
};

export default LoginButton;

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username || 'Unknown User'; // Extract username or fallback
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};
