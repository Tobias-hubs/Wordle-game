import { useEffect } from "react";

interface GameEffectsProps {
  gameStarted: boolean;
  wordLength: number;
  gameover: boolean;
  startGame: () => void;
  correctWord: string | null;
  guesses: string[];
  hasWon: boolean;
  startTime: number | null;
  timeTaken: number | null;
  setHasWon: (value: boolean) => void;
  getGameTime: () => Promise<number | null>;
  setTimeTaken: (value: number | null) => void;
}

export function useGameEffects({
  gameStarted,
  wordLength,
  gameover,
  startGame,
  correctWord,
  guesses,
  hasWon,
  startTime,
  timeTaken,
  setHasWon,
  getGameTime,
  setTimeTaken,
}: GameEffectsProps) {
  // Lyssnar på tangenttryckningar för att starta spelet
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameover) return;
      if (event.key === "Enter" && !gameStarted) {
        startGame();
      }
    };

    if (!gameStarted) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, wordLength, gameover, startGame]);

  
  useEffect(() => {
    if (
      gameover &&
      correctWord &&
      guesses.some(g => g.toLowerCase() === correctWord.toLowerCase())
    ) {
      setHasWon(true);
    }
  }, [gameover, correctWord, guesses, setHasWon]);

  // UseEffect to get the end time if the game is won
  useEffect(() => {
    if (hasWon && gameover && startTime && timeTaken === null) {
      getGameTime()
        .then((serverTime) => {
          if (serverTime !== null) {
            setTimeTaken(serverTime);
          }
        })
        .catch((error) =>
          console.error("Error to get correct time:", error)
        );
    }
  }, [hasWon, gameover, startTime, timeTaken, getGameTime, setTimeTaken]);
}
