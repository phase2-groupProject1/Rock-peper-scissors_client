import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServerSide } from "../../helpers/httpClient";
import CardRoom from "../component/CardRoom";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
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
                {!loading &&
                  !error &&
                  rooms.length > 0 &&
                  rooms.map((room) => <CardRoom key={room.id} room={room} />)}
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
