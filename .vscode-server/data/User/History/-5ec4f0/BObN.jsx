import React from 'react';
import { useLocation } from 'react-router-dom';
import CreateRoomButton from '../../Elements/Buttons/CreateRoomButton/CreateRoomButton';
import AlarmButton from '../../Elements/Buttons/AlarmButton/AlarmButton';
import LoginButton from '../../Elements/Buttons/LoginoutButton/LoginoutButton';
import LogoButton from '../../Elements/Buttons/LogoButton/LogoButton';
import Search from './Search/Search';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const roomId = (pathParts[1] === 'room' || pathParts[1] === 'observer')
    ? decodeURIComponent(pathParts[2]) : null;

  return (
    <header className="header">
      <div className="header-top">
        <LogoButton />
        <Search />
        <div className="right">
          <AlarmButton />
          <CreateRoomButton />
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
