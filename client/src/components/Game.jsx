import { useState, useEffect } from "react";
import Board from "./Board";

function Game() {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [gameover, setGameover] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [guesses, setGuesses] = useState([]);

  const correctWord = "hello"; // Ska komma från backend sen

  // Starta spelet
  const startGame = async () => {
    setStartTime(Date.now());
    setGameover(false);
    setGuesses([]);
    setFeedback([]);
    setGuess("");
  };

  // Hantera gissning
  const handleGuess = async () => {
    if (guess.length !== correctWord.length) {
      alert("Gissningen måste vara 5 bokstäver.");
      return;
    }

    const response = await fetch("http://localhost:5080/api/check-guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess })
    });

    const data = await response.json();
    setFeedback(prev => [...prev, data.feedback]);
    setGuesses(prev => [...prev, guess]);

    if (data.isGameOver) {
      setGameover(true);
      submitHighscore();
    }

    setGuess(""); // Börja ny rad
  };

  const submitHighscore = async () => {
    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    await fetch("http://localhost:5080/submitHighscore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Player1",
        time: timeTaken,
        guesses,
        wordLength: correctWord.length,
        specialLetters: false
      })
    });
  };

  return (
    <div>
      <h1>Guess the Word</h1>
      <Board
        guess={guess}
        setGuess={setGuess}
        feedback={feedback}
        handleGuess={handleGuess}
        currentGuessIndex={guesses.length}
        guesses={guesses}
      />

      {!gameover ? (
        <button onClick={handleGuess}>Submit Guess</button>
      ) : (
        <h2>Game Over! 🎉</h2>
      )}

      <button onClick={startGame}>Restart Game</button>
    </div>
  );
}

export default Game;
