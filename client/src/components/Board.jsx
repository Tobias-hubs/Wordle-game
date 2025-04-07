
import React, { useEffect } from 'react';
import Row from './Row';

function Board({ guess, setGuess, feedback = [], currentGuessIndex = 0, handleGuess, guesses = [] }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key) && guess.length < 5) {
        setGuess(prev => prev + key);
      } else if (key === "backspace") {
        setGuess(prev => prev.slice(0, -1));
      } else if (key === "enter" && guess.length === 5) {
        handleGuess(); // Send guess
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [guess]);

  const maxRows = 6;

  return (
    <div className="board">
      {Array.from({ length: maxRows }).map((_, i) => (
        <Row
          key={i}
          rowIndex={i}
          guess={i === currentGuessIndex ? guess : guesses?.[i] || ""}
          feedback={feedback[i] || []}
          isActive={i === currentGuessIndex}
        />
      ))}
    </div>
  );
}

export default Board;
