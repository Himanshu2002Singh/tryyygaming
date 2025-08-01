import { useState } from "react";
import {
  FaStar,
  FaCricketBall,
  FaFootballBall,
  FaTableTennis,
  FaDice,
} from "react-icons/fa";
import { FiClock, FiPlay, FiEdit } from "react-icons/fi";
import { IoMdPlay } from "react-icons/io";
import { MdSportsCricket } from "react-icons/md";
import { IoFootballOutline } from "react-icons/io5";
import Image from "next/image";

function GameCategoryCard() {
  const [activeTab, setActiveTab] = useState("INPLAY");

  const tabs = [
    {
      id: "INPLAY",
      label: "INPLAY",
      image: "inplay.png",
      icon: <IoMdPlay className="mr-1" />,
    },
    {
      id: "CRICKET",
      label: "CRICKET",
      image: "cricketicon.png",
      icon: <MdSportsCricket className="mr-1" />,
    },
    {
      id: "FOOTBALL",
      label: "FOOTBALL",
      image: "football.png",

      icon: <IoFootballOutline className="mr-1" />,
    },
    {
      id: "TENNIS",
      label: "TENNIS",
      image: "tennis.png",
      icon: <FaTableTennis className="mr-1" />,
    },
    // { id: "CASINO", label: "CASINO", icon: <FaDice className="mr-1" /> },
  ];

  const matchData = {
    INPLAY: [
      {
        status: "stumps",
        day: "Day 1",
        team1: "Combined Campuses And Colleges",
        team2: "Jamaica",
        starred: true,
        back: { odds: 0, amount: "0" },
        lay: { odds: 0, amount: "0" },
        videoAvailable: true,
        editable: true,
      },
      {
        status: "in-play",
        team1: "Thailand Women",
        team2: "Bangladesh Women",
        starred: true,
        back: { odds: 0, amount: "0" },
        lay: { odds: 1.01, amount: "11.8k" },
        videoAvailable: true,
        editable: true,
      },
      {
        status: "in-play",
        team1: "Lions",
        team2: "Titans",
        starred: true,
        back: { odds: 0, amount: "1" },
        lay: { odds: 0, amount: "1" },
        videoAvailable: true,
      },
      {
        status: "starts",
        startTime: "7:30pm IST",
        team1: "Royal Challengers Bengaluru",
        team2: "Delhi Capitals",
        starred: true,
        back: { odds: 1.83, amount: "3.8k" },
        lay: { odds: 1.84, amount: "5.5k" },
      },
      {
        status: "tomorrow",
        startTime: "7:30pm IST",
        team1: "Chennai Super Kings",
        team2: "Kolkata Knight Riders",
        starred: true,
        back: { odds: 1.91, amount: "4.57" },
        lay: { odds: 1.93, amount: "16.76" },
      },
    ],
    CRICKET: [
      {
        status: "starts",
        startTime: "7:30pm IST",
        team1: "Kolkata Knight Riders",
        team2: "Delhi Capitals",
        starred: true,
        back: { odds: 1.83, amount: "3.8k" },
        lay: { odds: 1.84, amount: "5.5k" },
      },
      {
        status: "tomorrow",
        startTime: "7:30pm IST",
        team1: "Chennai Super Kings",
        team2: "Kolkata Knight Riders",
        starred: true,
        back: { odds: 1.91, amount: "4.57" },
        lay: { odds: 1.93, amount: "16.76" },
      },
    ],
    FOOTBALL: [
      {
        status: "starts",
        startTime: "7:30pm IST",
        team1: "Manchester City",
        team2: "FC barcelona",
        starred: true,
        back: { odds: 1.83, amount: "3.8k" },
        lay: { odds: 1.84, amount: "5.5k" },
      },
      {
        status: "tomorrow",
        startTime: "7:30pm IST",
        team1: "Real Madrid",
        team2: "Bayern Munich",
        starred: true,
        back: { odds: 1.91, amount: "4.57" },
        lay: { odds: 1.93, amount: "16.76" },
      },
    ],
    TENNIS: [],
    CASINO: [],
  };

  // Default to empty array if the tab doesn't have data
  const currentMatches = matchData[activeTab] || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation Tabs */}
      <div className="overflow-x-auto my-3">
        <div className="flex items-center gap-y-3 gap-x-2 w-max whitespace-nowrap">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="relative rounded-md h-7 mr-0 overflow-hidden"
              style={{ width: "110px" }}
            >
              <button
                className={`
              absolute inset-0
              flex items-center justify-center
              font-bold text-[10px]
              transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }
            `}
                // style={{
                //   clipPath:
                //     "polygon(15px 0, calc(100% - 15px) 0, 100% 100%, 0 100%)",
                // }}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-center gap-1">
                  <Image
                    src={`/${tab.image}`}
                    width={15}
                    height={15}
                    alt={tab.label}
                    // className="object-contain"
                  />
                  <span className="text-[10px] leading-[1] mt-[1px]">
                    {tab.label}
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-lg my-3 mx-0.5 shadow border border-gray-200">
        {/* Table Header */}
        <div className="flex text-[10px] py-3 border-b border-gray-200">
          <div className="w-16 sm:w-24 flex items-center justify-center">
            <FiClock size={16} className="text-black" />
          </div>
          <div className="flex-1 min-w-0 text-left font-medium text-black">
            Teams
          </div>
          <div className="w-24 sm:w-32 flex-shrink-0 flex items-center justify-center font-medium text-black">
            Back
          </div>
          <div className="w-24 sm:w-32 flex-shrink-0 flex items-center justify-center font-medium text-black">
            Lay
          </div>
        </div>

        {/* Match Rows */}
        {currentMatches.length > 0 ? (
          currentMatches.map((match, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center">
                {/* Status Column */}
                <div className="w-16 sm:w-24 px-3 py-1 flex flex-col items-center justify-center">
                  {match.status === "in-play" && (
                    <div className="text-[8px] bg-green-500 w-max text-black py-1 px-2 rounded text-center">
                      In-play
                    </div>
                  )}
                  {match.status === "stumps" && (
                    <div className="text-[8px] bg-orange-400 w-max text-black py-1 px-2 rounded text-center">
                      Stumps
                    </div>
                  )}
                  {match.status === "starts" && (
                    <div className="text-black text-[8px] text-center">
                      Starts at
                      <br />
                      {match.startTime}
                    </div>
                  )}
                  {match.status === "tomorrow" && (
                    <div className="text-[8px] text-black text-center">
                      Tomorrow
                      <br />
                      {match.startTime}
                    </div>
                  )}
                  {match.day && (
                    <div className="text-[8px] text-black mt-1 text-center">
                      {match.day}
                    </div>
                  )}
                </div>

                {/* Teams Column with Video Icon */}
                <div className="flex-1 min-w-0 flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-black text-[10px] truncate max-w-[120px] sm:max-w-none">
                        {match.team1}
                      </span>
                      {match.editable && (
                        <span className="text-yellow-500 ml-2">
                          <FiEdit size={10} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-[10px]">
                      {match.starred && (
                        <span className="text-yellow-500 mr-1">
                          <FaStar />
                        </span>
                      )}
                      {match.team2 && (
                        <div className="text-black truncate max-w-[120px] sm:max-w-none">
                          {match.team2}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Icon */}
                  {match.videoAvailable && (
                    <div className="mr-2">
                      <div className="inline-block bg-transparent rounded p-1">
                        <FiPlay size={10} className="text-black" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Back Odds */}
                <div className="w-24 sm:w-32 flex-shrink-0 px-1">
                  <div className="bg-blue-100 py-3 sm:px-3 px-1 rounded text-center">
                    <div className="font-extrabold text-black text-[10px]">
                      {match.back.odds}
                    </div>
                    <div className="text-[8px] text-black">
                      {match.back.amount}
                    </div>
                  </div>
                </div>

                {/* Lay Odds */}
                <div className="w-24 sm:w-32 flex-shrink-0 px-1">
                  <div className="bg-pink-100 p-3 rounded text-center">
                    <div className="font-extrabold text-black text-[10px]">
                      {match.lay.odds}
                    </div>
                    <div className="text-[8px] text-black">
                      {match.lay.amount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500 text-sm">
            No matches available for this category
          </div>
        )}
      </div>
    </div>
  );
}

export default GameCategoryCard;
