import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { controllGuess, chooseWord } from "./game/gameLogic.js";

const app = express();
const port = 5080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json()); 


let startTime; 
let correctWord; 

app.post("/startGame", (req, res) => {
    const wordList = ["word1", "apple", "banana", "grape", "cherry"]; // Exempel på ordlista
    correctWord = chooseWord(wordList, 5, false); // Dynamiskt ordval när spelet startar
    startTime = Date.now();  // Start timer
    res.status(200).json({ message: "Game started"});
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Hello from the server.js!" });
});

app.post("/api/check-guess", (req, res) => {
    const { guess } = req.body;
    const correctWord = "word1"; //Temporary word, should be replaced with a random word from the list
    console.log("Mottagen gissning", guess);
    console.log("Korrekt ord är:", correctWord);

    if (!guess) {
        return res.status(400).json({ message: "Ingen gissning angiven" });
    }

    const feedback = controllGuess(guess, correctWord);
    res.json(feedback);
});

// Development
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// For production
// app.use(express.static(path.join(__dirname, "../client/build")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

app.post("/endGame", (req, res) => {
    const endTime = Date.now();
    const timeTaken = endTime - startTime; 
    res.status(200).json({ message: `Game over. Time taken: ${timeTaken}ms`, timeTaken });
});

// JSON test highscore 
app.post("/submitHighscore", (req, res) => {
    const { name, time, guesses, wordLength, specialLetters } = req.body;
    let highscores = [];

    if (fs.existsSync("highscores.json")) {
        highscores = JSON.parse(fs.readFileSync("highscores.json"));
    }
highscores.push({ name, time, guesses, wordLength, specialLetters });

fs.writeFileSync("highscores.json", JSON.stringify(highscores, null, 2));
res.status(200).json({ message: "Highscore saved", highscores });
});


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});