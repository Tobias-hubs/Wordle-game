// import { useState, useEffect } from "react";
// import Board from "./Board";

// function Game() {
//   const [guess, setGuess] = useState("");
//   const [feedback, setFeedback] = useState([]);
//   const [gameover, setGameover] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [guesses, setGuesses] = useState([]);

//   const correctWord = "hello"; // Ska komma från backend sen

//   // Starta spelet
//   const startGame = async () => {
//     setStartTime(Date.now());
//     setGameover(false);
//     setGuesses([]);
//     setFeedback([]);
//     setGuess("");
//   };

//   // Hantera gissning
//   const handleGuess = async () => {
//     if (guess.length !== correctWord.length) {
//       alert("Gissningen måste vara 5 bokstäver.");
//       return;
//     }

//     const response = await fetch("http://localhost:5080/api/check-guess", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ guess })
//     });

//     const data = await response.json();
//     setFeedback(prev => [...prev, data.feedback]);
//     setGuesses(prev => [...prev, guess]);

//     if (data.isGameOver) {
//       setGameover(true);
//       submitHighscore();
//     }

//     setGuess(""); // Börja ny rad
//   };

//   const submitHighscore = async () => {
//     const endTime = Date.now();
//     const timeTaken = endTime - startTime;

//     await fetch("http://localhost:5080/submitHighscore", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: "Player1",
//         time: timeTaken,
//         guesses,
//         wordLength: correctWord.length,
//         specialLetters: false
//       })
//     });
//   };

//   return (
//     <div>
//       <h1>Guess the Word</h1>
//       <Board
//         guess={guess}
//         setGuess={setGuess}
//         feedback={feedback}
//         handleGuess={handleGuess}
//         currentGuessIndex={guesses.length}
//         guesses={guesses}
//       />

//       {!gameover ? (
//         <button onClick={handleGuess}>Submit Guess</button>
//       ) : (
//         <h2>Game Over! 🎉</h2>
//       )}

//       <button onClick={startGame}>Restart Game</button>
//     </div>
//   );
// }

// export default Game;

// import { useState, useEffect } from "react";
// import Board from "./Board";
// import { FeedbackItem } from './types'; // Förutsätter att FeedbackItem är definierad i types.ts

// type ApiResponse = {
//   feedback: FeedbackItem[][]; // Tvådimensionell array av FeedbackItem
//   isGameOver: boolean;
// };

// function Game() {
//   const [guess, setGuess] = useState<string>("");
//   const [feedback, setFeedback] = useState<FeedbackItem[][]>([]); // Tvådimensionell array
//   const [gameover, setGameover] = useState<boolean>(false);
//   const [startTime, setStartTime] = useState<number | null>(null);
//   const [guesses, setGuesses] = useState<string[]>([]);

//   const correctWord = "hello"; // Ska komma från backend sen

//   const startGame = async (): Promise<void> => {
//     setStartTime(Date.now());
//     setGameover(false);
//     setGuesses([]);
//     setFeedback([]); // Two dimensional array
//     setGuess("");
//   };

//   const handleGuess = async (): Promise<void> => {
//     if (guess.length !== correctWord.length) {
//       alert("Gissningen måste vara 5 bokstäver.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5080/api/check-guess", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ guess })
//       });

//       const data: ApiResponse = await response.json();
//       setFeedback(prev => [...prev, ...data.feedback]); // Lägg till feedback i tvådimensionell array
//       setGuesses(prev => [...prev, guess]);

//       if (data.isGameOver) {
//         setGameover(true);
//         submitHighscore();
//       }

//       setGuess("");
//     } catch (error) {
//       console.error("Något gick fel vid gissningen:", error);
//     }
//   };

//   const submitHighscore = async (): Promise<void> => {
//     const endTime = Date.now();
//     const timeTaken = startTime ? endTime - startTime : 0;

//     try {
//       await fetch("http://localhost:5080/submitHighscore", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: "Player1",
//           time: timeTaken,
//           guesses,
//           wordLength: correctWord.length,
//           specialLetters: false
//         })
//       });
//     } catch (error) {
//       console.error("Misslyckades att skicka highscore:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Guess the Word</h1>
//       <Board
//         guess={guess}
//         setGuess={setGuess}
//         feedback={feedback}
//         handleGuess={handleGuess}
//         currentGuessIndex={guesses.length}
//         guesses={guesses}
//       />

//       {!gameover ? (
//         <button onClick={handleGuess}>Submit Guess</button>
//       ) : (
//         <h2>Game Over! 🎉</h2>
//       )}

//       <button onClick={startGame}>Restart Game</button>
//     </div>
//   );
// }

// export default Game;


//This is the part with mocked api and works with all the colors on the board? 

import React, { useState } from "react";
import Board from "./Board";

const correctWord = "hello";

type FeedbackItem = {
  result: "correct" | "misplaced" | "wrong";
};

function Game() {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<FeedbackItem[][]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameover, setGameover] = useState(false);

  const handleGuess = async () => {
    if (guess.length !== 5) return;

    // Mockad feedbacklogik – ersätt med riktig API-koll!
    const newFeedback: FeedbackItem[] = guess.split("").map((letter, i) => {
      if (letter === correctWord[i]) return { result: "correct" };
      else if (correctWord.includes(letter)) return { result: "misplaced" };
      else return { result: "wrong" };
    });

    setGuesses((prev) => [...prev, guess]);
    setFeedback((prev) => [...prev, newFeedback]);
    setGuess("");

    if (guess === correctWord) {
      setGameover(true);
    }
  };

  return (
    <div>
      <h1>Wordle Game</h1>
      <Board
        guess={guess}
        setGuess={setGuess}
        feedback={feedback}
        guesses={guesses}
        currentGuessIndex={guesses.length}
        handleGuess={handleGuess}
      />
      {!gameover ? (
        <button onClick={handleGuess}>Submit</button>
      ) : (
        <h2>🎉 Du klarade det!</h2>
      )}
    </div>
  );
}

export default Game;


// The colors do not work with backend implemented bellow yet, only for correct color (green)

// import { useState } from "react";
// import Board from "./Board";

// function Game() {
//   const [guess, setGuess] = useState("");
//   const [feedback, setFeedback] = useState<any[][]>([]);
//   const [guesses, setGuesses] = useState<string[]>([]);
//   const [gameover, setGameover] = useState(false);
//   const [startTime, setStartTime] = useState<number | null>(null);

//   const correctWord = "hello"; // För fallback/debug

//   const startGame = () => {
//     setGuess("");
//     setFeedback([]);
//     setGuesses([]);
//     setGameover(false);
//     setStartTime(Date.now());
//   };

//   const handleGuess = async () => {
//     if (guess.length !== 5) {
//       alert("Gissningen måste vara 5 bokstäver.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5080/api/check-guess", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ guess }),
//       });

//       const data = await response.json();

//       setGuesses(prev => [...prev, guess]);
//       setFeedback(prev => [...prev, data.feedback]);

//       if (data.isGameOver) {
//         setGameover(true);
//         await submitHighscore();
//       }

//       setGuess("");
//     } catch (error) {
//       console.error("Fel vid gissning:", error);
//       alert("Kunde inte kontakta servern.");
//     }
//   };

//   const submitHighscore = async () => {
//     const endTime = Date.now();
//     const timeTaken = startTime ? endTime - startTime : 0;

//     try {
//       await fetch("http://localhost:5080/submitHighscore", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: "Player1",
//           time: timeTaken,
//           guesses,
//           wordLength: correctWord.length,
//           specialLetters: false,
//         }),
//       });
//     } catch (error) {
//       console.error("Fel vid highscore-inskickning:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Guess the Word</h1>

//       <Board
//         guess={guess}
//         setGuess={setGuess}
//         feedback={feedback}
//         currentGuessIndex={guesses.length}
//         guesses={guesses}
//         handleGuess={handleGuess}
//       />

//       {!gameover ? (
//         <button onClick={handleGuess}>Submit Guess</button>
//       ) : (
//         <h2>You Won! 🎉</h2>
//       )}

//       <button onClick={startGame}>Restart Game</button>
//     </div>
//   );
// }

// export default Game;
