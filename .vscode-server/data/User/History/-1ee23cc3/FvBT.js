import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home/Home.jsx';
import Room from './components/Pages/Room/Room.jsx';
import Login from './components/Pages/Login/Login.jsx';
import Observer from './components/Pages/Observer/Observer.jsx';
import Signup from './components/Pages/Signup/Signup.jsx';
import Header from './components/Shell/Header/Header.jsx';
import LeftSidebar from './components/Shell/LeftSidebar/LeftSidebar.jsx';
import './Layers.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const registerUser = (userId) => {
    socket.emit('registerUser', userId);
};

const getUsernameFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
        return payload.username; // Extract username
    } catch (error) {
        console.error('Failed to parse token:', error);
        return null;
    }
};

const Layers = () => {
    useEffect(() => {
        // 사용자 등록
        const token = localStorage.getItem('token');
        const userId = token ? getUsernameFromToken(token) : null;

        if (userId) {
            registerUser(userId);
            console.log(`사용자 ${userId}가 소켓 서버에 등록되었습니다.`);
        }

        // 초대 메시지 수신
        socket.on('receiveInvite', ({ roomUrl }) => {
            alert(`새로운 초대가 도착했습니다! 링크: ${roomUrl}`);
        });

        // 컴포넌트 언마운트 시 소켓 이벤트 정리
        return () => {
            socket.off('receiveInvite');
        };
    }, []); // 컴포넌트 마운트 시 실행

    return (
        <Router>
            <div className="layers">
                <Header />
                <div className="main-layout">
                    <LeftSidebar />
                    <div className="content">
                        <Routes>
                            {/* 메인 페이지 라우트 */}
                            <Route path="/" element={<Home />} />

                            {/* 참여자와 관전자 라우트 */}
                            <Route
                                path="/room/:roomNumber"
                                element={<Room role="participant" />}
                            />
                            <Route
                                path="/observer/:roomNumber"
                                element={<Observer role="observer" />}
                            />

                            {/* 로그인 및 회원가입 페이지 라우트 */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default Layers;
