import React from "react";
import Cell from "./Cell";

type FeedbackItem = {
  result: "correct" | "misplaced" | "wrong";
};

type RowProps = {
  guess?: string;
  feedback?: FeedbackItem[];
  isActive?: boolean;
};

function Row({ guess = "", feedback = [], isActive = false }: RowProps) {
  const letters = guess.padEnd(5).split("");

  return (
    <div className={`row ${isActive ? "active" : ""}`}>
      {letters.map((char, i) => (
        <Cell key={i} status={feedback[i]?.result || ""}>
          {char.toUpperCase()}
        </Cell>
      ))}
    </div>
  );
}

export default Row;
