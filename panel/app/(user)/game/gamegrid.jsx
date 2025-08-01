"use client";
import React, { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import GameCategoryCard from "./gamecardtable";

const games = [
  {
    id: 1,
    name: "Aviator",
    image: "gameimages/4.gif",
    category: "Aviator",
    firstRow: true,
  },
  {
    id: 2,
    name: "Mines",
    image: "gameimages/3.gif",
    category: "Mines",
    firstRow: true,
  },
  {
    id: 3,
    name: "Fun Games",
    image: "gameimages/2.gif",
    category: "Fun Games",
    firstRow: true,
  },
  {
    id: 4,
    name: "Color Prediction",
    image: "gameimages/1.gif",
    category: "Color Prediction",
    firstRow: true,
  },
  {
    id: 5,
    name: "Dream Wheel",
    image: "gameimages/5.webp",
    category: "Dream Wheel",
  },
  {
    id: 6,
    name: "Football Studio Dice",
    image: "gameimages/6.webp",
    category: "Football",
  },
  {
    id: 7,
    name: "6 Player Poker",
    image: "gameimages/7.webp",
    category: "Poker",
  },
  {
    id: 8,
    name: "Cricket 20-20",
    image: "gameimages/8.webp",
    category: "Cricket",
  },
  {
    id: 9,
    name: "Football Studio Dice",
    image: "gameimages/9.webp",
    category: "Football",
  },
  {
    id: 10,
    name: "6 Player Poker",
    image: "gameimages/10.webp",
    category: "Poker",
  },
  {
    id: 11,
    name: "Cricket 20-20",
    image: "gameimages/11.webp",
    category: "Cricket",
  },
  {
    id: 12,
    name: "Cricket 20-20",
    image: "gameimages/12.webp",
    category: "Cricket",
  },
  {
    id: 13,
    name: "Football Studio Dice",
    image: "gameimages/13.webp",
    category: "Football",
  },
  {
    id: 14,
    name: "6 Player Poker",
    image: "gameimages/14.webp",
    category: "Poker",
  },
  {
    id: 15,
    name: "Cricket 20-20",
    image: "gameimages/15.webp",
    category: "Cricket",
  },
  {
    id: 16,
    name: "Cricket 20-20",
    image: "gameimages/16.webp",
    category: "Cricket",
  },

  {
    id: 17,
    name: "Football Studio Dice",
    image: "gameimages/17.webp",
    category: "Football",
  },
  {
    id: 18,
    name: "6 Player Poker",
    image: "gameimages/18.webp",
    category: "Poker",
  },
  {
    id: 19,
    name: "Cricket 20-20",
    image: "gameimages/19.webp",
    category: "Cricket",
  },
  {
    id: 20,
    name: "Basketball Shootout",
    image: "gameimages/20.webp",
    category: "Basketball",
  },
  {
    id: 21,
    name: "Roulette Spin",
    image: "gameimages/21.webp",
    category: "Casino",
  },
  {
    id: 22,
    name: "Virtual Tennis",
    image: "gameimages/22.webp",
    category: "Tennis",
  },
  {
    id: 23,
    name: "Blackjack 21",
    image: "gameimages/23.webp",
    category: "Casino",
  },
  {
    id: 24,
    name: "Penalty Shootout",
    image: "gameimages/24.webp",
    category: "Football",
  },
  {
    id: 25,
    name: "Baccarat Deluxe",
    image: "gameimages/25.webp",
    category: "Casino",
  },
  {
    id: 26,
    name: "Carrom Clash",
    image: "gameimages/26.webp",
    category: "Board",
  },
  {
    id: 27,
    name: "Speed Chess",
    image: "gameimages/27.webp",
    category: "Board",
  },
  {
    id: 28,
    name: "Rummy Kings",
    image: "gameimages/28.webp",
    category: "Card",
  },
  {
    id: 29,
    name: "Horse Racing Derby",
    image: "gameimages/29.webp",
    category: "Racing",
  },
  {
    id: 30,
    name: "Darts Challenge",
    image: "gameimages/30.webp",
    category: "Arcade",
  },
  {
    id: 31,
    name: "Snooker Championship",
    image: "gameimages/31.webp",
    category: "Billiards",
  },
  {
    id: 32,
    name: "Texas Hold'em Poker",
    image: "gameimages/32.webp",
    category: "Poker",
  },
  {
    id: 33,
    name: "Fantasy Football",
    image: "gameimages/33.webp",
    category: "Football",
  },
  {
    id: 34,
    name: "Beach Volleyball",
    image: "gameimages/34.webp",
    category: "Volleyball",
  },
  {
    id: 35,
    name: "Table Tennis Pro",
    image: "gameimages/35.webp",
    category: "Tennis",
  },
  {
    id: 36,
    name: "Dragon Slot Machine",
    image: "gameimages/36.webp",
    category: "Casino",
  },
  {
    id: 37,
    name: "Ludo Supreme",
    image: "gameimages/37.webp",
    category: "Board",
  },
  // {
  //   id: 38,
  //   name: "Cricket Super Over",
  //   image: "gameimages/38.webp",
  //   category: "Cricket",
  // },
  {
    id: 39,
    name: "Kabaddi Clash",
    image: "gameimages/39.webp",
    category: "Kabaddi",
  },
  {
    id: 40,
    name: "Ice Hockey Stars",
    image: "gameimages/40.webp",
    category: "Hockey",
  },
  {
    id: 41,
    name: "Pool 8 Ball",
    image: "gameimages/41.webp",
    category: "Billiards",
  },
  {
    id: 42,
    name: "Cycling Race",
    image: "gameimages/42.webp",
    category: "Racing",
  },
  {
    id: 43,
    name: "MMA Fight Night",
    image: "gameimages/43.webp",
    category: "MMA",
  },
  {
    id: 44,
    name: "Badminton Duel",
    image: "gameimages/44.webp",
    category: "Badminton",
  },
  {
    id: 45,
    name: "Archery Master",
    image: "gameimages/45.webp",
    category: "Arcade",
  },
  {
    id: 46,
    name: "Sudoku Grandmaster",
    image: "gameimages/46.webp",
    category: "Puzzle",
  },
  // {
  //   id: 47,
  //   name: "Word Search Mania",
  //   image: "gameimages/47.webp",
  //   category: "Puzzle",
  // },
  {
    id: 48,
    name: "Checkers Elite",
    image: "gameimages/48.webp",
    category: "Board",
  },
  {
    id: 49,
    name: "Moto GP Challenge",
    image: "gameimages/49.webp",
    category: "Racing",
  },
  {
    id: 50,
    name: "Tic Tac Toe Xtreme",
    image: "gameimages/50.webp",
    category: "Puzzle",
  },
  {
    id: 51,
    name: "Monopoly Tycoon",
    image: "gameimages/51.webp",
    category: "Board",
  },
  {
    id: 52,
    name: "Ultimate Frisbee",
    image: "gameimages/52.webp",
    category: "Sports",
  },
  {
    id: 53,
    name: "Bingo Madness",
    image: "gameimages/53.webp",
    category: "Card",
  },
  {
    id: 54,
    name: "Bowling King",
    image: "gameimages/54.webp",
    category: "Bowling",
  },
  {
    id: 55,
    name: "Mahjong Titans",
    image: "gameimages/55.webp",
    category: "Board",
  },
  {
    id: 56,
    name: "Dominoes Duel",
    image: "gameimages/56.webp",
    category: "Board",
  },
  {
    id: 57,
    name: "Pictionary Showdown",
    image: "gameimages/57.webp",
    category: "Board",
  },
  {
    id: 58,
    name: "Crossword Puzzler",
    image: "gameimages/58.webp",
    category: "Puzzle",
  },
  {
    id: 59,
    name: "Backgammon Masters",
    image: "gameimages/59.webp",
    category: "Board",
  },
  {
    id: 60,
    name: "Rock Paper Scissors",
    image: "gameimages/60.webp",
    category: "Casual",
  },
  {
    id: 61,
    name: "Go Board Game",
    image: "gameimages/61.webp",
    category: "Board",
  },
  {
    id: 62,
    name: "Jigsaw Puzzle",
    image: "gameimages/62.webp",
    category: "Puzzle",
  },

  // Add more games as needed
];

const GameCardGIF = memo(({ game, isFirstRow }) => {
  const cardClasses = `
    relative 
    ${isFirstRow ? "col-span-1 aspect-[9/4]" : "aspect-[4/5]"}

    rounded-xs 
    overflow-hidden 
    shadow-lg 
    transform 
    transition-transform 
    hover:scale-101
  `;

  return (
    <div key={game.id} className={cardClasses}>
      <Link href="/comingsoon">
        <Image
          src={`/${game.image}`}
          alt={game.name}
          fill
          className="object-center"
          // sizes="(max-width: 768px) 5vw, (max-width: 1200px) 20vw, 15vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMiEeHBwZIS0iJjFLMlpVUldcZYBlhWlra4qKjTIudLV7dnXqeYWVtsmstL7swcbP/9sAFQgVFhcYFhgXFxcZGRgZHRwdHBwcHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHf/AABEIAAYACgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlgAH/9k="
        />
        {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-1 text-xs truncate">
        {game.name}
      </div> */}
      </Link>
    </div>
  );
});
const GameCard = memo(({ game, isFirstRow }) => {
  const cardClasses = `
    relative 
    ${isFirstRow ? "col-span-1 aspect-[2/4]" : "aspect-[5/5]"}

    rounded-xs 
    overflow-hidden 
    shadow-lg 
    transform 
    transition-transform 
    hover:scale-101
  `;

  return (
    <div key={game.id} className={cardClasses}>
      <Link href="/comingsoon">
        <Image
          src={`/${game.image}`}
          alt={game.name}
          fill
          className="object-center"
          // sizes="(max-width: 768px) 5vw, (max-width: 1200px) 20vw, 15vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMiEeHBwZIS0iJjFLMlpVUldcZYBlhWlra4qKjTIudLV7dnXqeYWVtsmstL7swcbP/9sAFQgVFhcYFhgXFxcZGRgZHRwdHBwcHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHf/AABEIAAYACgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlgAH/9k="
        />
        {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-1 text-xs truncate">
        {game.name}
      </div> */}
      </Link>
    </div>
  );
});

// Main GameGrid component
const GameGrid = () => {
  // Memoize filtered games to prevent unnecessary re-computations
  const firstRowGames = useMemo(
    () => games.filter((game) => game.firstRow),
    []
  );

  const otherGames = useMemo(() => games.filter((game) => !game.firstRow), []);

  return (
    <div className=" min-h-screen bg-black pb-12 sm:pb-16 sm:pt-1 pt-1 px-1">
      {/* First row games */}
      <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-2 sm:gap-1 sm:mb-2 mb-1">
        {firstRowGames.map((game) => (
          <GameCardGIF key={game.id} game={game} isFirstRow={true} />
        ))}
      </div>

      {/* <GameCategoryCard /> */}
      {/* Other games */}
      <div className="grid my-2 grid-cols-4 gap-0.5 sm:grid-cols-5 sm:gap-1">
        {otherGames.map((game, id) => (
          <GameCard key={id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
