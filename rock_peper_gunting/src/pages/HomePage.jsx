import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ServerSide } from "../../helpers/httpClient";
import CardRoom from "../component/CardRoom";
import { io } from "socket.io-client";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await ServerSide.get("/rooms");
      setRooms(data.rooms);
    } catch (err) {
      setError(err.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Start with a fetch for SSR/initial paint
    fetchRooms();

    // Connect socket for realtime room updates
    const socket = io("https://rps.ikaros.web.id", { transports: ["websocket"], autoConnect: true });
    socketRef.current = socket;
    socket.on("connect", () => {
      socket.emit("rooms_request");
    });
    socket.on("rooms_update", (payload) => {
      if (Array.isArray(payload?.rooms)) {
        // Map payload: { room, players, status } into our UI rooms shape
        setRooms((prev) => {
          const prevByCode = new Map(prev.map((r) => [r.room_code || r.room, r]));
          const incomingByCode = new Map(payload.rooms.map((ri) => [ri.room, ri]));

          // Update existing rooms with incoming occupancy/status
          const updated = prev.map((r) => {
            const code = r.room_code || r.room;
            const inc = incomingByCode.get(code);
            if (!inc) return r; // keep as-is if no realtime info yet
            return {
              ...r,
              room_code: code,
              players: Array.isArray(r.players)
                ? Array.from({ length: inc.players || 0 })
                : (typeof r.players === 'number')
                ? (inc.players || 0)
                : Array.from({ length: inc.players || 0 }),
              status: inc.status || r.status,
            };
          });

          // Add any new rooms that only exist in realtime payload (e.g., created elsewhere and already joined)
          incomingByCode.forEach((ri, code) => {
            if (!prevByCode.has(code)) {
              updated.push({ room_code: code, players: Array.from({ length: ri.players || 0 }), status: ri.status });
            }
          });

          return updated;
        });
      }
    });
    socket.on("disconnect", () => {
      // fallback to polling when disconnected
    });

    // Keep a light polling as a fallback every 10s
    const interval = setInterval(fetchRooms, 10000);

    return () => {
      clearInterval(interval);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const handleCreateMultiplayerDuel = async () => {
    try {
      const { data } = await ServerSide.post("/rooms");
      const roomCode = data.room.room_code;
      navigate(`/game/${roomCode}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create a new room. Please try again.");
    }
  };

  const handleVsAiOpponent = async () => {
    try {
      const { data } = await ServerSide.post("/rooms");
      const roomCode = data.room.room_code;
      navigate(`/game/ai/${roomCode}`);
    } catch (error) {
      console.error("Error creating AI game room:", error);
      alert("Failed to create a new AI game. Please try again.");
    }
  };

  const handleJoinByCode = (ai = false) => {
    if (!joinCode.trim()) return alert("Please enter a room code");
    const username = localStorage.getItem("userName");
    if (!username) return navigate("/");
    navigate(ai ? `/game/ai/${joinCode.trim()}` : `/game/${joinCode.trim()}`);
  };

  return (
    <div className="fixed inset-0 min-h-screen min-w-full navbar-bg animated-navbar-bg pb-10 pt-32 px-2 z-0">
      <div className="w-full h-full flex flex-col justify-center">
        <div className="flex flex-col md:flex-row gap-8 h-full min-h-[500px]">
          <div className="flex-1 flex flex-col gap-6 justify-center">
            <div className="rounded-2xl border-2 border-[#1fa9d6] p-6 bg-[rgba(24,28,47,0.7)] shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl text-[#1fa9d6]">＋</span>
                <span className="text-xl md:text-2xl font-bold text-[#1fa9d6] tracking-widest">
                  CREATE GAME
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleCreateMultiplayerDuel}
                  className="w-full border-2 border-[#1fa9d6] rounded-lg py-3 px-4 text-[#1fa9d6] font-bold text-lg flex items-center gap-2 hover:bg-[#1fa9d6]/10 transition"
                >
                  <span className="text-xl">👥</span> MULTIPLAYER DUEL
                </button>
                <button
                  onClick={handleVsAiOpponent}
                  className="w-full border-2 border-[#1fa9d6] rounded-lg py-3 px-4 text-[#1fa9d6] font-bold text-lg flex items-center gap-2 hover:bg-[#1fa9d6]/10 transition"
                >
                  <span className="text-xl">🎮</span> VS AI OPPONENT
                </button>
                <div className="h-px bg-[#1fa9d6]/30 my-2" />
                <div className="flex flex-col gap-2">
                  <div className="text-[#8ad4ff] font-semibold">Join by Code</div>
                  <div className="flex gap-2">
                    <input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="ROOM CODE"
                      className="flex-1 px-3 py-2 rounded-lg border border-[#1fa9d6] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1fa9d6]"
                    />
                    <button onClick={() => handleJoinByCode(false)} className="border-2 border-[#1fa9d6] text-[#1fa9d6] px-3 py-2 rounded-lg hover:bg-[#1fa9d6]/10">
                      Join PvP
                    </button>
                    <button onClick={() => handleJoinByCode(true)} className="border-2 border-[#1fa9d6] text-[#1fa9d6] px-3 py-2 rounded-lg hover:bg-[#1fa9d6]/10">
                      Join AI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Rooms */}
          <div className="flex-1 flex flex-col gap-6 justify-center md:basis-1/2 max-w-full">
            <div className="rounded-2xl border-2 border-[#1fa9d6] p-6 bg-[rgba(24,28,47,0.7)] shadow-xl h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl text-[#1fa9d6]">👥</span>
                <span className="text-xl md:text-2xl font-bold text-[#1fa9d6] tracking-widest">
                  AVAILABLE ROOMS
                </span>
              </div>
              <div className="relative transition-all duration-300 min-h-[200px] max-h-[400px] overflow-y-auto flex flex-col gap-4 flex-1">
                {/* Error state */}
                {error && !loading && (
                  <div className="text-center text-red-500 bg-transparent p-6">
                    {error}
                  </div>
                )}
                {/* Room list */}
                {!loading && !error && rooms.length > 0 &&
                  rooms.map((room) => (
                    <CardRoom key={room.room_code || room.id} room={room} />
                  ))}
                {/* Empty state */}
                {!loading && !error && rooms.length === 0 && (
                  <div className="rounded-xl border border-[#1fa9d6] bg-[rgba(16,18,26,0.8)] p-6 text-center text-gray-300 text-lg font-light">
                    No rooms available. Create a new game to start playing!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
