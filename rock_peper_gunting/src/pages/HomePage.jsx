
import React from "react";

const HomePage = () => {
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
								<button className="w-full border-2 border-[#1fa9d6] rounded-lg py-3 px-4 text-[#1fa9d6] font-bold text-lg flex items-center gap-2 hover:bg-[#1fa9d6]/10 transition">
									<span className="text-xl">👥</span> MULTIPLAYER DUEL
								</button>
								<button className="w-full border-2 border-[#1fa9d6] rounded-lg py-3 px-4 text-[#1fa9d6] font-bold text-lg flex items-center gap-2 hover:bg-[#1fa9d6]/10 transition">
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
							<div className="rounded-xl border border-[#1fa9d6] bg-[rgba(16,18,26,0.8)] p-6 text-center text-gray-300 text-lg font-light">
								No rooms available. Create a new game to start playing!
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
