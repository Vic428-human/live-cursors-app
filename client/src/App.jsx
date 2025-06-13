import React, { useState } from 'react';
import './App.css'
import { Login } from './components/Login';
import { Home } from '../Home';



function App() {
  const [username, setUsername] = useState('');

  if (username) {
    return (
      <Home username={username}/>
    );
  }

  const handleLogin = (username) => {
    setUsername(username);
  };     

  return (
    <div className="app-container">
      <Login onSubmit={handleLogin} />
    </div>
  )

  // return (
  //   <>
  //     <Login onSubmit={setUsername}/>
  //   </>
  // )
}

export default App
