import React from "react";
import { useNavigate } from "react-router-dom";

const CardRoom = ({ room }) => {
	const navigate = useNavigate();

	const handleJoinRoom = async () => {
			const username = localStorage.getItem("userName");
			if (!username) return navigate("/");
			navigate(`/game/${room.room_code}`);
	};

			return (
				<div className="rounded-xl border border-[#1fa9d6] bg-[rgba(16,18,26,0.8)] p-4 text-white min-h-[72px] w-full">
								<div className="grid grid-cols-3 items-center w-full gap-2 min-h-[40px]">
						<div className="col-span-2 min-w-0">
							<h3 className="font-bold text-lg truncate">Room {room.room_code}</h3>
														<p className="text-sm text-gray-400">
															{Array.isArray(room.players) ? room.players.length : (typeof room.players === 'number' ? room.players : 0)}/2 Players
															{" "}
															<span className="ml-2 px-2 py-0.5 text-xs rounded-full border border-[#1fa9d6]/50 text-[#8ad4ff]">
																{room.status || ((Array.isArray(room.players) ? room.players.length : (typeof room.players === 'number' ? room.players : 0)) >= 2 ? "playing" : "waiting")}
															</span>
														</p>
						</div>
						<div className="flex justify-end">
							<button
								onClick={handleJoinRoom}
								className="bg-[#1fa9d6] hover:bg-[#1fa9d6]/80 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 min-w-[110px]"
								disabled={(Array.isArray(room.players) ? room.players.length : (typeof room.players === 'number' ? room.players : 0)) >= 2}
							>
								{(Array.isArray(room.players) ? room.players.length : (typeof room.players === 'number' ? room.players : 0)) >= 2 ? "Full" : "Join Room"}
							</button>
						</div>
					</div>
				</div>
			);
};

export default CardRoom;
