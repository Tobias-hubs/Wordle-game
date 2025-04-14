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
      console.log("Tangent tryckt:", event.key);
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

  // Effekt för att kontrollera win-status
  useEffect(() => {
    console.log("checking win status:", {
      gameover,
      correctWord,
      guesses,
      match: correctWord && guesses.includes(correctWord),
    });
    if (
      gameover &&
      correctWord &&
      guesses.some(g => g.toLowerCase() === correctWord.toLowerCase())
    ) {
      setHasWon(true);
    }
  }, [gameover, correctWord, guesses, setHasWon]);

  // Effekt för att hämta sluttid om spelet är vunnet
  useEffect(() => {
    // console.log("useEffect körs:", { hasWon, gameover, startTime, timeTaken });
    if (hasWon && gameover && startTime && timeTaken === null) {
      getGameTime()
        .then((serverTime) => {
          if (serverTime !== null) {
            setTimeTaken(serverTime);
          }
        })
        .catch((error) =>
          console.error("Fel vid hämtning av verifierad tid:", error)
        );
    }
  }, [hasWon, gameover, startTime, timeTaken, getGameTime, setTimeTaken]);
}
