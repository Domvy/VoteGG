import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(window.location.origin + '/api/user/login', {
        username,
        password,
      });

      if (response.status === 200) {
        setError('');
        const token = response.data.token;
        localStorage.setItem('token', token);
        alert('로그인 성공');
        navigate('/'); // 로그인 성공 시 메인 페이지로 리디렉션
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleKakaoLogin = () => {
    console.log('Redirecting to Kakao login...'); // 디버깅용
    window.location.href = '/api/user/auth/kakao'; // 서버에서 리디렉션 처리
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <p>아이디와 비밀번호를 입력하세요.</p>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your ID"
            required
          />
        </div>
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}

        <button type="button" onClick={handleLogin} className="login-login-button">
          Login In

        </button>
      </form>

      {/* 소셜 로그인 버튼 */}
      <div className="social-login-container">
        <button className="social-login-button google">G</button>
        <button className="social-login-button kakao" onClick={handleKakaoLogin}>K</button>
        <button className="social-login-button naver">N</button>
      </div>

      <a href="/signup" className="signup-link">
      <h3>아이디가 없다면? 회원가입</h3>
      </a>
    </div>
  );
};

export default Login;
