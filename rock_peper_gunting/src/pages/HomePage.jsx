
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
		<div className="min-h-screen w-full navbar-bg animated-navbar-bg pb-10 pt-32 px-2">
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col md:flex-row gap-8">
					<div className="flex-1 flex flex-col gap-6">
						<div className="rounded-2xl border-2 border-[#1fa9d6] p-6 bg-[rgba(24,28,47,0.7)] shadow-xl">
							<div className="flex items-center gap-2 mb-4">
								<span className="text-2xl text-[#1fa9d6]">＋</span>
								<span className="text-xl md:text-2xl font-bold text-[#1fa9d6] tracking-widest">CREATE GAME</span>
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
					<div className="flex-1 flex flex-col gap-6">
						<div className="rounded-2xl border-2 border-[#1fa9d6] p-6 bg-[rgba(24,28,47,0.7)] shadow-xl">
							<div className="flex items-center gap-2 mb-4">
								<span className="text-2xl text-[#1fa9d6]">👥</span>
								<span className="text-xl md:text-2xl font-bold text-[#1fa9d6] tracking-widest">AVAILABLE ROOMS</span>
							</div>
							{loading ? (
								<div className="text-center text-gray-300">Loading rooms...</div>
							) : error ? (
								<div className="text-center text-red-500">{error}</div>
							) : rooms.length > 0 ? (
								<div className="flex flex-col gap-4">
									{rooms.map((room) => (
										<CardRoom key={room.id} room={room} />
									))}
								</div>
							) : (
								<div className="rounded-xl border border-[#1fa9d6] bg-[rgba(16,18,26,0.8)] p-6 text-center text-gray-300 text-lg font-light">
									No rooms available. Create a new game to start playing!
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
