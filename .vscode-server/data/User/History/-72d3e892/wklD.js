import React from 'react';
import './App.css';
import OpenviduFinal from './components/openvidu/OpenviduFinal';

function App() {
    return (
        <div className="app">
            {/* 다른 컴포넌트들과 함께 OpenviduFinal을 포함 */}
            <OpenviduFinal />
        </div>
    );
}

export default App;
