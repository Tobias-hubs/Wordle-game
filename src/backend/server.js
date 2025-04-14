import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { controllGuess, chooseWord } from "./game/gameLogic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawWordData = fs.readFileSync(path.join(__dirname, "words_dictionary.json"));
const allWordsObj = JSON.parse(rawWordData); // Detta är ett objekt med ord som nycklar
const allWords = Object.keys(allWordsObj);

const app = express();
const port = 5080;



app.use(cors());
app.use(express.json()); 


let startTime; 
let correctWord; 

// app.post("/startGame", (req, res) => {
//     // const wordList = ["wordd", "apple", "banana", "grape", "cherry"]; // Exempel på ordlista
//     // correctWord = chooseWord(wordList, 5, false); // Dynamiskt ordval när spelet startar
//     const wordLength = req.body.wordLength || 5; //  få ordlängden från frontend
//     const allowRepeats = req.body.allowRepeats ?? false; 
//     const wordList = ["wordd", "apple", "banana", "grape", "cherry", "python", "word"]; // Ordlista
//     correctWord = chooseWord(wordList, wordLength, allowRepeats);  // Välj ett ord baserat på längd
//     startTime = Date.now();  // Start timer
//     res.status(200).json({ message: "Game started"});
// });

app.post("/startGame", (req, res) => {
    const wordLength = req.body.wordLength || 5;
    const allowRepeats = req.body.allowRepeats ?? false;

    correctWord = chooseWord(allWords, wordLength, allowRepeats);
    console.log("Valt ord:", correctWord); // Logga det valda ordet
    startTime = Date.now();

    res.status(200).json({ message: "Game started" });
});

// app.get("/api/test", (req, res) => {
//     res.json({ message: "Hello from the server.js!" });
// });

app.post("/api/check-guess", (req, res) => {
    const { guess } = req.body;
    // const correctWord = "wordd"; // ! This word Communicates with frontend ,Temporary word, should be replaced with a random word from the list
    console.log("Mottagen gissning", guess);
    console.log("Korrekt ord är:", correctWord);

    if (!guess) {
        return res.status(400).json({ message: "Ingen gissning angiven" });
    }

    if (!correctWord) {
        console.error("Korrekt ord är inte definierat!");
        return res.status(500).json({ message: "Spelet har inte startats korrekt. Korrekt ord saknas." });
    }

    const feedback = controllGuess(guess, correctWord);
    if (feedback.isGameOver) {
        console.log("Spelet är över! Korrekt ord var:", correctWord);
    
    res.json({...feedback, correctWord}); // Skicka tillbaka feedback och korrekt ord till frontend
    } else { 
    res.json(feedback);
}});

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
    const { name, time, guesses, wordLength, allowRepeats } = req.body;
    let highscores = [];

    if (fs.existsSync("highscores.json")) {
        highscores = JSON.parse(fs.readFileSync("highscores.json"));
    }
highscores.push({ name, time, guesses, wordLength, allowRepeats });

fs.writeFileSync("highscores.json", JSON.stringify(highscores, null, 2));
res.status(200).json({ message: "Highscore saved", highscores });
});


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});