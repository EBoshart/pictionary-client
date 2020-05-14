import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './rsocket-websocket';
import { fnf, push2 } from './rsocket-websocket';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => push2(1,1,1)}>push</button>
        <button onClick={() => fnf()}>fnf</button>

      </header>
    </div>
  );
}

export default App;
