import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isMenuOpen, setIsMenuOpen] = useState(false); // 드롭다운 메뉴 상태
  const username = token ? getUsernameFromToken(token) : "";

  const handleLogout = () => {
    localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 제거
    alert("로그아웃 되었습니다.");
    setIsMenuOpen(false); // 메뉴 닫기
    navigate('/'); // 홈으로 리다이렉트
  };

  const handleUsernameClick = () => {
    setIsMenuOpen(!isMenuOpen); // 메뉴 토글
  };

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return token ? (
    <div className="user-menu">
      {/* 사용자 이름 */}
      <p
        className="username"
        onClick={handleUsernameClick}
        style={{ cursor: 'pointer' }}
      >
        Hello! {username}
      </p>

      {/* 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <button type="button" onClick={handleLoginClick} className="login-button">
      Login
    </button>
  );
};

export default LoginButton;

// JWT 토큰에서 사용자 이름 추출
const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload decoding
    return payload.username || 'Unknown User'; // 사용자 이름 추출
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};
