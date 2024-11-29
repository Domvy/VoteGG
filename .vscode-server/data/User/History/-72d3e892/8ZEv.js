import React from 'react';
import SessionManager from './components/SessionManager/SessionManager';
import './styles/App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>OpenVidu Video Conference</h1>
      </header>
      <main>
        <SessionManager />
      </main>
    </div>
  );
};

export default App;
