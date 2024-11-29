import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CreateRoomButton from '../../Elements/Buttons/CreateRoomButton/CreateRoomButton';
import AlarmButton from '../../Elements/Buttons/AlarmButton/AlarmButton';
import LoginButton from '../../Elements/Buttons/LoginoutButton/LoginoutButton';
import LogoButton from '../../Elements/Buttons/LogoButton/LogoButton';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const [roomName, setRoomName] = useState(null);
    const pathParts = location.pathname.split('/');
    const roomId = (pathParts[1] === 'room' || pathParts[1] === 'observer')
        ? decodeURIComponent(pathParts[2]) : null;

    useEffect(() => {
        const fetchRoomName = async () => {
            if (roomId) {
                try {
                    const response = await fetch(`/api/room/${roomId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch room name');
                    }
                    const data = await response.json();
                    setRoomName(data.roomName);
                } catch (error) {
                    console.error('Error fetching room name:', error);
                    setRoomName('Unknown Room');
                }
            }
        };
        fetchRoomName();
    }, [roomId]);

    return (
        <header className="header">
            <div className="header-top">
                <LogoButton />
                {roomId ? (
                    <div className="room-id-display">
                        Room: {roomName || 'Loading...'}
                    </div>
                ) : (
                    <div className="search-container">
                        <input type="text" placeholder="Search" className="search-input" />
                        <img src="/magnifier.png" alt="Search Icon" className="search-icon" />
                    </div>
                )}
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
