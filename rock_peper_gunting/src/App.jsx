

import React from 'react';
import NavBar from './component/NavBar';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  const userName = localStorage.getItem('userName');
  return (
    <>
      {userName ? (
        <>
          {/* <NavBar />
          <HomePage /> */}
        </>
      ) : (
        <RegisterPage />
      )}
    </>
  );
}

export default App;
