// import {useState} from react; 

// function Game() { 
// const [guess, setGuess] = useState("");
// const [feedback, setFeedback] = useState("");
// const [gameover, setGameover] = useState(false);
// }

// const correctWord = "hello";

import { useState } from "react";

function Game() {
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState([]);
    const [gameover, setGameover] = useState(false);
    const [startTime, setStartTime] = useState(null); // Starttid
    const [guesses, setGuesses] = useState([]); // Lista över gissningar

    const correctWord = "hello"; // Ska egentligen hämtas från backend

    // Starta spelet
    const startGame = async () => {
        setStartTime(Date.now());
        setGameover(false);
        setGuesses([]);
        setFeedback([]);
    };

    // Hantera användarens gissning
    const handleGuess = async () => {
        if (guess.length !== correctWord.length) {
            alert("Gissningen måste vara lika lång som målordet.");
            return;
        }

        const response = await fetch("http://localhost:5080/api/check-guess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guess })
        });

        const data = await response.json();
        setFeedback(data.feedback);
        setGuesses([...guesses, guess]);

        if (data.isGameOver) {
            setGameover(true);
            submitHighscore();
        }

        setGuess(""); // Töm inputfältet
    };

    // Skicka highscore till backend
    const submitHighscore = async () => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;

        await fetch("http://localhost:5000/submitHighscore", {
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
            {!gameover ? (
                <div>
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        disabled={gameover}
                    />
                    <button onClick={handleGuess}>Submit Guess</button>
                </div>
            ) : (
                <h2>Game Over! 🎉</h2>
            )}

            <div>
                <h3>Feedback:</h3>
                <ul>
                    {feedback.map((item, index) => (
                        <li key={index}>
                            {item.letter} - {item.result}
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={startGame}>Restart Game</button>
        </div>
    );
}

export default Game;
