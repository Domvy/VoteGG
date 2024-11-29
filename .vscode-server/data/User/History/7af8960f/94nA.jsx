import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CreateRoomButton from '../CreateRoomButton/CreateRoomButton';
import './Header.css';
import AlarmButton from '../AlarmButton/AlarmButton';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const roomId = pathParts[1] === 'room' ? pathParts[2] : null;

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* Link 내부에 이미지 추가 */}
        <Link to="/" className="logo-link">
          <img
            src="/mainlogo2.png" // 로고 이미지 경로
            alt="Agora Logo"
            className="logo-image"
          />
        </Link>
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
          <img src="/magnifier.png" alt="Search Icon" className="search-icon" />
        </div>
        <div className="right">
          <AlarmButton />
          <CreateRoomButton />
          <button onClick={handleLoginClick} className="login-button">
            로그인
          </button>
          {/* <img src="/bell.png" alt="Search Icon" className="bell-icon" /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
