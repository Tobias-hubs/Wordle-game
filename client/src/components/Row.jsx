import React from 'react';
import Cell from './Cell';

function Row({ guess = "", feedback = [], isActive }) {
  const guessString = typeof guess === "string" ? guess : "";
  const letters = guessString.padEnd(5).split(""); // Se till att det är 5 bokstäver

  console.log("Row – guess:", guess);
console.log("Row – letters:", letters);


  return (
    <div className={`row ${isActive ? "active" : ""}`}>
      {letters.map((char, i) => (
        <Cell
          key={i}
          status={feedback[i]?.result || ""}
        >
          {char.toUpperCase()} {/* Show letter in cell */}
        </Cell>
      ))}
    </div>
  );
}

export default Row;
