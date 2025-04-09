import { useState } from "react";
import Board from "./Board";

function Game() {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<any[][]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameover, setGameover] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const correctWord = "hello"; // Hardcoded but do not play a role now because backend works

  const startGame = () => {
    setGuess("");
    setFeedback([]);
    setGuesses([]);
    setGameover(false);
    setStartTime(Date.now());
  };

  const handleGuess = async () => {
    if (guess.length !== 5) {
      alert("Gissningen måste vara 5 bokstäver.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5080/api/check-guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess }),
      });

      const data = await response.json();
      console.log("FEEDBACK FRÅN BACKEND:", data);

      setGuesses(prev => [...prev, guess]);
      setFeedback(prev => [...prev, data.feedback]);

      if (data.isGameOver) {
        setGameover(true);
        await submitHighscore();
      }

      setGuess("");
    } catch (error) {
      console.error("Fel vid gissning:", error);
      alert("Kunde inte kontakta servern.");
    }
  };

  const submitHighscore = async () => {
    const endTime = Date.now();
    const timeTaken = startTime ? endTime - startTime : 0;

    try {
      await fetch("http://localhost:5080/submitHighscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Player1",
          time: timeTaken,
          guesses,
          wordLength: correctWord.length,
          specialLetters: false,
        }),
      });
    } catch (error) {
      console.error("Fel vid highscore-inskickning:", error);
    }
  };

  return (
    <div>
      <h1>Guess the Word</h1>

      <Board
        guess={guess}
        setGuess={setGuess}
        feedback={feedback}
        currentGuessIndex={guesses.length}
        guesses={guesses}
        handleGuess={handleGuess}
      />

      {!gameover ? (
        <button onClick={handleGuess}>Submit Guess</button>
      ) : (
        <h2>You Won! 🎉</h2>
      )}

      <button onClick={startGame}>Restart Game</button>
    </div>
  );
}

export default Game;
