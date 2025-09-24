import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NavBar = () => {
  const navigate = useNavigate();
  const { userName, logout } = useAuth();

  return (
  <nav className="fixed top-0 left-0 w-full z-50 bg-transparent flex flex-col px-8 h-24 pb-2">
      <div className="relative flex items-center w-full h-full">
        <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide select-none neon-title fade-in float">
          Clash of Hands
          <span className="emoji-bounce" role="img" aria-label="hands">
            {" "}
            ✊
          </span>
          <span
            className="emoji-bounce"
            style={{ animationDelay: "0.15s" }}
            role="img"
            aria-label="hands"
          >
            {" "}
            🖐
          </span>
          <span
            className="emoji-bounce"
            style={{ animationDelay: "0.3s" }}
            role="img"
            aria-label="hands"
          >
            {" "}
            ✌️
          </span>
        </div>
        <button
          className="logout-btn px-12 py-2 text-base md:text-lg rounded-full flex items-center justify-center font-bold min-w-[120px] absolute right-0 top-1/2 -translate-y-1/2"
          title="Logout"
          onClick={() => { logout(); navigate('/'); }}
        >
          LOGOUT
        </button>
      </div>
      {userName && (
        <div className="greeting fade-in">
          Welcome, <span className="username">{userName}</span>!
        </div>
      )}
    </nav>
  );
};

export default NavBar;
