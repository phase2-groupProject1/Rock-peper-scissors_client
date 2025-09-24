import React from "react";
import NavBar from "./component/NavBar";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
