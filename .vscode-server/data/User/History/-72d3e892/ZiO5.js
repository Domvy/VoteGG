import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage'; // 홈 페이지 컴포넌트
import SessionManager from './components/SessionManager/SessionManager'; // 세션 매니저 컴포넌트
// import './styles/App.css';

const App = () => {
  return (
    <Router>
        sdf
      <div className="App">
        <header className="App-header">
          <h1>OpenVidu Video Conference</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session" element={<SessionManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
