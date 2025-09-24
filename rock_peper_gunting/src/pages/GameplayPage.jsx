import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// Simple icons mapping
const emoji = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

export default function GameplayPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  const isAIMode = location.pathname.includes("/ai/");

  const playerName = useMemo(
    () => localStorage.getItem("userName") || `Player-${Math.random().toString(36).slice(2, 6)}`,
    []
  );
  const userId = useMemo(() => {
    const v = localStorage.getItem("userId");
    return v ? Number(v) : null;
  }, []);

  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState(isAIMode ? "Choose your move" : "Waiting for opponent to join...");
  const [myMove, setMyMove] = useState(null);
  const [lastRound, setLastRound] = useState(null); // { players:[], result, message }
  const [error, setError] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    // Guard: require player name from register
    if (!playerName) {
      navigate("/", { replace: true });
      return;
    }

    const socket = io("https://rps.ikaros.web.id", {
      transports: ["websocket"],
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
  // Join the room right away; server accepts roomCode key
  socket.emit("join_room", { roomCode, playerName, userId });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setJoined(false);
      setStatus("Disconnected. Reconnecting...");
    });

    socket.on("joined_room", (payload) => {
      setJoined(true);
      // For PvP we stay in waiting state until a round result arrives
      setStatus(isAIMode ? "Choose your move" : "Waiting for opponent to join...");
    });

    socket.on("round_result", (payload) => {
      setLastRound(payload);
      setStatus(payload.message || (payload.result === "draw" ? "Draw" : "Round finished"));
      setMyMove(null);
    });

    socket.on("error", (payload) => {
      setError(payload?.message || "Socket error");
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [roomCode, playerName, isAIMode, navigate]);

  const submitMove = (move) => {
    if (!socketRef.current) return;
    setMyMove(move);
    setError(null);
    if (isAIMode) {
      setStatus("AI is thinking...");
      // Send both names, some servers prefer player_move key
      socketRef.current.emit("play_ai", { roomCode, playerName, userId, move, player_move: move });
    } else {
      setStatus("Waiting for opponent's move...");
      socketRef.current.emit("player_move", { move });
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen min-w-full navbar-bg animated-navbar-bg pb-10 pt-24 px-4 z-0">
      <div className="max-w-5xl mx-auto">
        {/* Header / Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8ad4ff]">{isAIMode ? "VS AI" : "PVP"} • Room</div>
            <h1 className="text-2xl md:text-3xl font-extrabold neon-title drop-shadow-[0_0_18px_#00eaff]">
              Room {roomCode}
            </h1>
          </div>
          <button
            onClick={() => navigate("/homepage")}
            className="border-2 border-[#1fa9d6] text-[#1fa9d6] px-4 py-2 rounded-lg hover:bg-[#1fa9d6]/10"
          >
            Back to Lobby
          </button>
        </div>

        {/* Connection and status */}
        <div className="rounded-2xl border-2 border-[#1fa9d6] p-4 bg-[rgba(24,28,47,0.7)] shadow-xl mb-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-gray-200">{connected ? "Connected" : "Disconnected"}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-200">Player: <span className="font-semibold">{playerName}</span></span>
            <span className="text-gray-500">•</span>
            <span className="text-[#8ad4ff] font-semibold">{status}</span>
          </div>
          {error && (
            <div className="mt-2 text-red-400 text-sm">{error}</div>
          )}
        </div>

        {/* Last round result */}
        {lastRound && (
          <div className="rounded-2xl border border-[#1fa9d6]/60 p-4 bg-[rgba(16,18,26,0.8)] mb-6">
            <div className="text-[#8ad4ff] font-bold mb-2">Last Round</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="flex flex-col items-center">
                <div className="text-gray-400 text-sm">Player 1</div>
                <div className="text-lg font-semibold text-white">
                  {lastRound.players?.[0]?.name || "?"}
                </div>
                <div className="text-4xl">{emoji[lastRound.players?.[0]?.move] || "❔"}</div>
              </div>
              <div className="text-center text-[#8ad4ff] font-bold">VS</div>
              <div className="flex flex-col items-center">
                <div className="text-gray-400 text-sm">Player 2</div>
                <div className="text-lg font-semibold text-white">
                  {lastRound.players?.[1]?.name || (isAIMode ? "AI" : "?")}
                </div>
                <div className="text-4xl">{emoji[lastRound.players?.[1]?.move] || (isAIMode ? "🤖" : "❔")}</div>
              </div>
            </div>
            <div className="mt-3 text-center text-white">
              {lastRound.result === "draw" ? "It's a draw!" : lastRound.message}
            </div>
            {/* {isAIMode && lastRound?.ai?.insights && (
              <div className="mt-2 text-center text-gray-400 text-sm">AI insights: {String(lastRound.ai.insights)}</div>
            )} */}
          </div>
        )}

        {/* Move selector */}
        <div className="rounded-2xl border-2 border-[#1fa9d6] p-6 bg-[rgba(24,28,47,0.7)] shadow-xl">
          <div className="text-center text-[#8ad4ff] font-bold mb-4">Choose Your Move</div>
          <div className="grid grid-cols-3 gap-4">
            {(["rock", "paper", "scissors"]).map((m) => (
              <button
                key={m}
                disabled={!connected || !joined || !!myMove}
                onClick={() => submitMove(m)}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition ${
                  myMove === m
                    ? "border-white/80 bg-white/10"
                    : "border-[#1fa9d6] hover:bg-[#1fa9d6]/10"
                }`}
              >
                <span className="text-5xl">{emoji[m]}</span>
                <span className="text-[#8ad4ff] font-semibold uppercase tracking-widest">{m}</span>
              </button>
            ))}
          </div>

          {myMove && (
            <div className="mt-4 text-center text-gray-200">
              You picked <span className="font-bold uppercase">{myMove}</span>. {isAIMode ? "Waiting AI..." : "Waiting opponent..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
