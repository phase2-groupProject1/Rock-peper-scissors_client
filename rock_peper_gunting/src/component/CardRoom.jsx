import React from "react";
import { useNavigate } from "react-router-dom";
import { ServerSide } from "../../helpers/httpClient";

const CardRoom = ({ room }) => {
	const navigate = useNavigate();

	const handleJoinRoom = async () => {
		const username = prompt("Please enter your username to join the room:");
		if (!username) {
			alert("Username is required to join a room.");
			return;
		}

		try {
			const userResponse = await ServerSide.post("/users", {
				username: username,
			});
			const userId = userResponse.data.user.id;

			await ServerSide.post(`/rooms/${room.room_code}/join`, {
				user_id: userId,
			});

			navigate(`/game/${room.room_code}`);
		} catch (error) {
			console.error("Error joining room:", error);
			alert("Failed to join the room. The username might already be taken, or the room is full.");
		}
	};

			return (
				<div className="rounded-xl border border-[#1fa9d6] bg-[rgba(16,18,26,0.8)] p-4 text-white min-h-[72px] w-full">
					<div className="grid grid-cols-3 items-center w-full gap-2 min-h-[40px]">
						<div className="col-span-2 min-w-0">
							<h3 className="font-bold text-lg truncate">Room {room.room_code}</h3>
							<p className="text-sm text-gray-400">{room.players ? room.players.length : 0}/2 Players</p>
						</div>
						<div className="flex justify-end">
							<button
								onClick={handleJoinRoom}
								className="bg-[#1fa9d6] hover:bg-[#1fa9d6]/80 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 min-w-[110px]"
								disabled={room.players && room.players.length >= 2}
							>
								{room.players && room.players.length >= 2 ? "Full" : "Join Room"}
							</button>
						</div>
					</div>
				</div>
			);
};

export default CardRoom;
