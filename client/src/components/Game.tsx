import { useState } from "react";
import { useEffect } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard"; 

function Game() {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<any[][]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameover, setGameover] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordLength, setWordLength] = useState(5); // Ordets längd, initialt 5
  const [allowRepeats, setAllowRepeats] = useState<boolean>(false);  // Upprepning av bokstäver

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
  };

  const handleKeyPress = (key: string) => {
    if (guess.length < wordLength && /^[a-z]$/i.test(key)) {
      setGuess(prev => prev + key); 
    }
  };

  const handleBackspace = () => {
    setGuess(prev => prev.slice(0, -1)); 
  };

  

  const handleGuess = async () => {
    if (guess.length !== wordLength) {
      alert("Gissningen måste vara ${wordLength} bokstäver.");
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


  const getGameTime = async (): Promise<number | null> => {
    console.log("Skickar startTime till servern:", startTime);
    try {
      const response = await fetch("http://localhost:5080/endGame", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime })
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
    const timeTaken = await getGameTime();
    if (timeTaken === null) return;
  
    try {
      await fetch("http://localhost:5080/submitHighscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Player1", // ändra till inputfält 
          time: timeTaken,
          guesses,
          wordLength,
          allowRepeats,
        }),
      });
    } catch (error) {
      console.error("Fel vid highscore-inskickning:", error);
    }
  };
  


  // const submitHighscore = async () => {
  //   const endTime = Date.now();
  //   const timeTaken = startTime ? endTime - startTime : 0;

  //   try {
  //     await fetch("http://localhost:5080/submitHighscore", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: "Player1",
  //         time: timeTaken,
  //         guesses,
  //         wordLength: wordLength,        // Should be dynamic based on the word length
  //         allowRepeats: false,
  //       }),
  //     });
  //   } catch (error) {
  //     console.error("Fel vid highscore-inskickning:", error);
  //   }
  // };
  
// To make sure enter key works to for starting the game
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("Tangent tryckt:", event.key);
      if (event.key === "Enter" && !gameStarted) {
        startGame();
      }
    };
  
    // Lägg till lyssnaren när spelet inte har startat
    if (!gameStarted) {
      window.addEventListener("keydown", handleKeyDown);
    }
  
    // Ta bort lyssnaren när komponenten unmountas eller spelets status ändras
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, wordLength]); // Updates the gameStarted state and wordLength state

  return (
    <div>
      <h1>Guess the Word</h1>
      {!gameStarted && (
      <div>
        <label htmlFor="wordLength">Choose word length: </label>
        <input 
          id="wordLength" 
          type="number" 
          value={String(wordLength)} 
          onChange={handleWordLengthChange} 
          min="3" 
          max="10" 
        />
      </div>
       )}
 {/* Val av om upprepning av bokstäver tillåts */}
 {!gameStarted && (
 <div>
        <label>
          <input
            type="checkbox"
            checked={allowRepeats}
            onChange={() => setAllowRepeats(!allowRepeats)}
          />
          Tillåt upprepning av bokstäver
        </label>
      </div>
)}
       {!gameStarted && (
      <button onClick={startGame}>Start Game with {wordLength}-letter word</button>
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
      />
     

      {!gameover ? (
        <button onClick={handleGuess}>Submit Guess</button> 
        
      ) : (
        <h2>You Won! 🎉</h2>
      )}

      <button onClick={restartGame}>Restart Game</button>
      <button onClick={submitHighscore}>Submit Highscore</button> 
      <Keyboard feedback={feedback.flat()} onKeyPress={handleKeyPress} 
      onBackspace={handleBackspace}
      onEnter={handleGuess}/>
       </>
      )}
    </div>
  );
}

export default Game;
