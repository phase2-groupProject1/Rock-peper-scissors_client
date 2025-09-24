import { useState } from "react";
import { useNavigate } from "react-router";
import { ServerSide } from "../../helpers/httpClient";


const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    try {
      // Kirim request register ke server
      const { data } = await ServerSide.post("/users", { username });
      localStorage.setItem('userName', data?.user?.username || username);
      if (data?.user?.id) localStorage.setItem('userId', String(data.user.id));
      navigate("/homepage");
    } catch (err) {
      alert("Register failed: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen min-w-full flex items-center justify-center navbar-bg animated-navbar-bg z-0">
      <div className="w-full max-w-md md:max-w-xl p-6 md:p-10 rounded-2xl border-2 border-[#1fa9d6] shadow-2xl bg-[rgba(24,28,47,0.7)] backdrop-blur-md relative">
        {/* Neon Title */}
        <h1 className="text-center text-2xl md:text-4xl font-extrabold neon-title mb-2 drop-shadow-[0_0_18px_#00eaff] tracking-wider">
          Clash of Hands{" "}
          <span role="img" aria-label="hands">
            ✊🖐✌️
          </span>
        </h1>
        <p className="text-center text-lg md:text-xl text-gray-200 mb-6 font-light tracking-wide">
          Enter the arena and prove your skills
        </p>
        <div className="mb-2 text-[#b2eaff] font-bold text-sm md:text-base tracking-widest">
          GAMER TAG
        </div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-5 px-4 py-2 rounded-md border border-[#1fa9d6] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1fa9d6]"
        />
        <button
          className="w-full py-2 rounded-md bg-gradient-to-r from-[#1fa9d6] to-[#1f6fd6] text-white font-bold text-lg tracking-wider shadow-md mb-6 relative overflow-hidden neon-btn group"
          onClick={handleRegister}
        >
          <span className="relative z-10">ENTER ARENA</span>
          <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 blur-[2px] animate-shine pointer-events-none" />
        </button>
        <div className="flex justify-between items-center gap-2 bg-[rgba(16,18,26,0.8)] rounded-xl p-4 mt-2 border border-[#23243a]">
          <div className="flex flex-col items-center flex-1">
            <span className="text-3xl mb-1">🪨</span>
            <span className="text-xs text-gray-300 tracking-widest">ROCK</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-3xl mb-1">📄</span>
            <span className="text-xs text-gray-300 tracking-widest">PAPER</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-3xl mb-1">✂️</span>
            <span className="text-xs text-gray-300 tracking-widest">
              SCISSORS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
