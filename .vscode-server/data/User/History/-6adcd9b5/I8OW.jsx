import React, { useState } from 'react';

const LoginButton = () => {
  const [showLogout, setShowLogout] = useState(false); // 상태 관리
  const token = localStorage.getItem("token");
  const username = token ? getUsernameFromToken(token) : "";

  const handleUsernameClick = () => {
    setShowLogout(!showLogout); // 클릭 시 상태 변경
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");
    setShowLogout(false); // 로그아웃 후 버튼 숨김
  };

  return token ? (
    <div className="user-info">
      <p
        className={`username ${showLogout ? "active" : ""}`}
        onClick={handleUsernameClick}
      >
        Welcome, {username}
      </p>
      <button
        type="button"
        className={`logout-button ${showLogout ? "visible" : ""}`}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  ) : (
    <button type="button" className="login-button">
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
