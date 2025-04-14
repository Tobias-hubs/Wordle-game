import { useState } from "react";
import { useEffect } from "react";
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
  const [wordLength, setWordLength] = useState(5); // Ordets längd, initialt 5
  const [allowRepeats, setAllowRepeats] = useState<boolean>(false);  // Upprepning av bokstäver
  const [playerName, setPlayerName] = useState<string>(""); // Spelarens namn
  const [correctWord, setCorrectWord] = useState<string | null>(null); // Right word from backend (only when endGame is called)
  const [hasWon, setHasWon] = useState(false);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [highscoreSubmitted, setHighscoreSubmitted] = useState(false);

  const handleWordLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setWordLength(Number(e.target.value)); // Uppdatera ordlängden
      // Kontrollera att värdet endast innehåller siffror
  if (/^\d*$/.test(value)) { 
    setWordLength(Number(value)); // Uppdatera om det är ett giltigt numeriskt värde
  }
};

  const startGame = async () => {
    setGuess("");
    setFeedback([]);
    setGuesses([]);
    setGameover(false);
    setStartTime(Date.now());
    setGameStarted(true);
    console.log("Spelet startade vid:", Date.now()); 

    try {
      const response = await fetch("http://localhost:5080/startGame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordLength, allowRepeats }), // Skicka ordlängd till backend och upprepning 
      });
      const data = await response.json();
      console.log(data.message);  // För att verifiera att spelet startades
    } catch (error) {
      console.error("Fel vid start av spelet:", error);
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
    setCorrectWord(null); // Återställ rätt ord vid ny start
    setHasWon(false);
    setTimeTaken(null); 
    setPlayerName(""); // Återställ spelarens namn vid ny start
    setHighscoreSubmitted(false); // Återställ highscore-knappen
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
      alert("Gissningen måste vara ${wordLength} bokstäver.");  // Denna bör tas bort eftersom de ska hanteras i endgame 
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
      console.log("FEEDBACK FRÅN BACKEND:", data);

      setGuesses(prev => [...prev, guess]);
      setFeedback(prev => [...prev, data.feedback]);

      if (data.isGameOver) {
        setGameover(true);
        if (data.correctWord) {
          setCorrectWord(data.correctWord);// Spara det rätta ordet från servern
        }
        if (data.correctWord?.toLowerCase() === guess.toLowerCase()) {
          setHasWon(true);   // Spelaren har vunnit
        // await submitHighscore();
        }
      }

      setGuess("");
    } catch (error) {
      console.error("Fel vid gissning:", error);
      alert("Kunde inte kontakta servern.");
    }
  };

  const getGameTime = async (): Promise<number | null> => {
    if (!startTime || !correctWord) return null;
    const endTime = Date.now();
    const calculatedTime = Math.floor((endTime - startTime) / 1000);
    console.log("Skickar startTime till servern:", startTime);
    try {
      const response = await fetch("http://localhost:5080/endGame", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime, correctWord }), // Skicka start- och sluttid till servern
      });

      const data = await response.json();
      console.log("Sluttid från servern:", data.timeTaken);

      return data.timeTaken;
    } catch (error) {
      console.error("Kunde inte hämta sluttid:", error);
      return null;
    }
  };
  
  const submitHighscore = async () => {
    // const timeTaken = await getGameTime();
    
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
          name: playerName, // ändra till inputfält 
          time: timeTaken,
          guesses,
          wordLength,
          allowRepeats,
        }),
      });
      setHighscoreSubmitted(true); // Lock button after submit
    } catch (error) {
      console.error("Fel vid highscore-inskickning:", error);
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
