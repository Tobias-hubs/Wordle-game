import React, { useEffect } from "react";
import Row from "./Row";

type FeedbackItem = {
  result: "correct" | "misplaced" | "wrong";
};

type BoardProps = {
  guess: string;
  setGuess: React.Dispatch<React.SetStateAction<string>>;
  feedback: FeedbackItem[][];
  guesses: string[];
  currentGuessIndex: number;
  handleGuess: () => void;
  wordLength: number; 
  gameover: boolean; // Added gameover prop
};

function Board({
  guess,
  setGuess,
  feedback,
  guesses,
  currentGuessIndex,
  handleGuess, 
  wordLength,
  gameover
}: BoardProps) {
  useEffect(() => {
    if (gameover) return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key) && guess.length < wordLength) {
        setGuess((prev) => prev + key);
      } else if (key === "backspace") {
        setGuess((prev) => prev.slice(0, -1));
      } else if (key === "enter" && guess.length === wordLength) {
        handleGuess();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [guess, wordLength, handleGuess, gameover]);

  return (
    <div className="board">
      {Array.from({ length: 6 }).map((_, i) => (
        <Row
          key={i}
          guess={i === currentGuessIndex ? guess : guesses[i] || ""}
          feedback={feedback[i] || []}
          isActive={i === currentGuessIndex}
          wordLength={wordLength} // Pass wordlength to Row
        />
      ))}
    </div>
  );
}

export default Board;
