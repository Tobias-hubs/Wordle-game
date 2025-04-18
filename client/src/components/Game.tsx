import { useState } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard"; 
import GameSettings from "./gameSettings";
import { useGameEffects } from "./useGameEffects";


function Game() {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<any[][]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameover, setGameover] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordLength, setWordLength] = useState(5); // Starting length at 5 
  const [allowRepeats, setAllowRepeats] = useState<boolean>(false);  // Repeating of letters 
  const [playerName, setPlayerName] = useState<string>(""); // Player name 
  const [correctWord, setCorrectWord] = useState<string | null>(null); // Right word from backend (only when endGame is called)
  const [hasWon, setHasWon] = useState(false);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [highscoreSubmitted, setHighscoreSubmitted] = useState(false);

  const handleWordLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

  if (/^\d*$/.test(value)) { 
    setWordLength(Number(value)); // Only allow numbers
  }
};

  const startGame = async () => {
    setGuess("");
    setFeedback([]);
    setGuesses([]);
    setGameover(false);
    setStartTime(Date.now());
    setGameStarted(true);

    try {
      const response = await fetch("http://localhost:5080/startGame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordLength, allowRepeats }), // Send choices to backend  
      });
      const data = await response.json();
    } catch (error) {
      alert("Kunde inte starta spelet.");
    }
  };
  
  const restartGame = () => {
    setGameStarted(false);
    setGuess("");
    setFeedback([]);  
    setGuesses([]);
    setGameover(false);
    setStartTime(null);
    setCorrectWord(null); // Reset correct word when restart
    setHasWon(false);
    setTimeTaken(null); 
    setPlayerName(""); // Reset playername when restart 
    setHighscoreSubmitted(false); // Restart submit higscore button
  };

  const handleKeyPress = (key: string) => {
    if (gameover) return;
    if (guess.length < wordLength && /^[a-z]$/i.test(key)) {
      setGuess(prev => prev + key); 
    }
  };

  const handleBackspace = () => {
    if (gameover) return;
    setGuess(prev => prev.slice(0, -1)); 
  };

  const handleGuess = async () => {
    if (guess.length !== wordLength) {
      alert(`Gissningen måste vara ${wordLength} bokstäver.`);  // Should be removed, should handle in endgame 
      return;
    }

    if (gameover || guesses.length >= 6) {
      return;  // Makes sure the game not allows more than 6 guesses
    }

    try {
      const response = await fetch("http://localhost:5080/api/check-guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess }),
      });

      const data = await response.json();
      setGuesses(prev => [...prev, guess]);
      setFeedback(prev => [...prev, data.feedback]);

      if (data.isGameOver) {
        setGameover(true);
        if (data.correctWord) {
          setCorrectWord(data.correctWord);// Save correct word from backend 
        }
        if (data.correctWord?.toLowerCase() === guess.toLowerCase()) {
          setHasWon(true);   // Player has won 
        }
      }

      setGuess("");
    } catch (error) {
      alert("Kunde inte kontakta servern.");
    }
  };

  const getGameTime = async (): Promise<number | null> => {
    if (!startTime || !correctWord) return null;
    const endTime = Date.now();
    const calculatedTime = Math.floor((endTime - startTime) / 1000);
    try {
      const response = await fetch("http://localhost:5080/endGame", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime, correctWord }), // Send start and finish time to backend
      });

      const data = await response.json();
      return data.timeTaken;
    } catch (error) {
      return null;
    }
  };
  
  const submitHighscore = async () => {
    
    if (!gameover || !hasWon || !correctWord || !guesses.includes(correctWord)) {
      alert("Du måste vinna spelet innan du skickar en highscore.");
      return; // Dont send highscore if game is not over or the guess is not correct
    }

    if (timeTaken === null) return;
  
    try {
      await fetch("http://localhost:5080/submitHighscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName, // Name input for highscore
          time: timeTaken,
          guesses,
          wordLength,
          allowRepeats,
        }),
      });

      setHighscoreSubmitted(true);// Lock button after submit
      window.location.href = `http://localhost:5080/highscores/${wordLength}/${allowRepeats}`; // Redirect to filtered highscores page after submit 
    } catch (error) {
    }
  };

useGameEffects({
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
});
  
  return ( 
    <div>
      <h1>Guess the Word</h1>
 
{!gameStarted && (
  <GameSettings 
    wordLength={wordLength}
    allowRepeats={allowRepeats}
    handleWordLengthChange={handleWordLengthChange}
    setAllowRepeats={setAllowRepeats}
    startGame={startGame}
  />
)}

      {gameStarted && (
  <>
      <Board
        guess={guess}
        setGuess={setGuess}
        feedback={feedback}
        currentGuessIndex={guesses.length}
        guesses={guesses}
        handleGuess={handleGuess}
        wordLength={wordLength}
        gameover={gameover} // Pass the gameover state to Board
      />
     
      {!gameover ? (
        <button onClick={handleGuess}>Submit Guess</button> 
        
      ) : (
        <h2>You Won! 🎉</h2>
      )}

      <button onClick={restartGame}>Restart Game</button>

      {hasWon && gameover &&(
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
      <button onClick={submitHighscore}
      disabled={!playerName || highscoreSubmitted}>Submit Highscore</button> 
        </div>
          )}
      <Keyboard feedback={feedback.flat()} onKeyPress={handleKeyPress} 
      onBackspace={handleBackspace}
      onEnter={handleGuess}/>
       </>
      )}
    </div>
  );
}

export default Game;
