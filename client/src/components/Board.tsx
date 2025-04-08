
// import React, { useEffect } from 'react';
// import Row from './Row';

// function Board({ guess, setGuess, feedback = [], currentGuessIndex = 0, handleGuess, guesses = [] }) {
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       const key = e.key.toLowerCase();
//       if (/^[a-z]$/.test(key) && guess.length < 5) {
//         setGuess(prev => prev + key);
//       } else if (key === "backspace") {
//         setGuess(prev => prev.slice(0, -1));
//       } else if (key === "enter" && guess.length === 5) {
//         handleGuess(); // Send guess
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [guess]);

//   const maxRows = 6;

//   return (
//     <div className="board">
//       {Array.from({ length: maxRows }).map((_, i) => (
//         <Row
//           key={i}
//           rowIndex={i}
//           guess={i === currentGuessIndex ? guess : guesses?.[i] || ""}
//           feedback={feedback[i] || []}
//           isActive={i === currentGuessIndex}
//         />
//       ))}
//     </div>
//   );
// }



// export default Board;




// import React, { useEffect } from 'react';
// import Row from './Row';
// import { FeedbackItem } from "./types";

// // type BoardProps = {
// //   guess: string;
// //   setGuess: React.Dispatch<React.SetStateAction<string>>;
// //   feedback: { result?: string }[][];
// //   currentGuessIndex: number;
// //   handleGuess: () => void;
// //   guesses: string[];
// // };

// interface BoardProps {
//   guess: string;
//   setGuess: React.Dispatch<React.SetStateAction<string>>;
//   feedback: FeedbackItem[][]; // Feedback ska vara en tvådimensionell array av FeedbackItem
//   currentGuessIndex: number;
//   handleGuess: () => void;
//   guesses: string[];
// }

// function Board({
//   guess,
//   setGuess,
//   feedback = [],
//   currentGuessIndex = 0,
//   handleGuess,
//   guesses = []
// }: BoardProps) {

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       const key = e.key.toLowerCase();

//       if (/^[a-z]$/.test(key) && guess.length < 5) {
//         setGuess(prev => prev + key);
//       } else if (key === "backspace") {
//         setGuess(prev => prev.slice(0, -1));
//       } else if (key === "enter" && guess.length === 5) {
//         handleGuess(); // Skicka gissningen
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [guess, setGuess, handleGuess]);

//   const maxRows = 6;

//   console.log("Feedback i Board:", feedback);

//   return (
//     <div className="board">
//       {Array.from({ length: maxRows }).map((_, i) => (
//         <Row
//           key={i}
//           guess={i === currentGuessIndex ? guess : guesses?.[i] || ""}
//           feedback={feedback[i] || []}
//           // feedback={i === currentGuessIndex ? [] : feedback[i] || []}
//           isActive={i === currentGuessIndex}
//         />
//       ))}
//     </div>
//   );
// }

// export default Board;


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
