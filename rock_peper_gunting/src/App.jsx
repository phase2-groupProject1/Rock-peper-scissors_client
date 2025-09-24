import React from "react";
import NavBar from "./component/NavBar";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import GameplayPage from "./pages/GameplayPage";
import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

function App() {
  const userName = localStorage.getItem("userName");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route
          element={
            <div>
              <NavBar />
              <Outlet />
            </div>
          }
        >
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/game/:roomCode" element={<GameplayPage />} />
          <Route path="/game/ai/:roomCode" element={<GameplayPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
