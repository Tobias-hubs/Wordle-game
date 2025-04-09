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
};

function Board({
  guess,
  setGuess,
  feedback,
  guesses,
  currentGuessIndex,
  handleGuess,
}: BoardProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key) && guess.length < 5) {
        setGuess((prev) => prev + key);
      } else if (key === "backspace") {
        setGuess((prev) => prev.slice(0, -1));
      } else if (key === "enter" && guess.length === 5) {
        handleGuess();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [guess, handleGuess]);

  return (
    <div className="board">
      {Array.from({ length: 6 }).map((_, i) => (
        <Row
          key={i}
          guess={i === currentGuessIndex ? guess : guesses[i] || ""}
          feedback={feedback[i] || []}
          isActive={i === currentGuessIndex}
        />
      ))}
    </div>
  );
}

export default Board;
