import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { controllGuess, chooseWord } from "./game/gameLogic.js";
import mongoose from "mongoose";
import Highscore from "./models/Highscore.js"; // Import the Highscore model



const mongoUri = "mongodb://localhost:27017/HighscoreList"; 
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Ansluten till MongoDB"))
  .catch((err) => console.error("Fel vid anslutning till MongoDB:", err));


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawWordData = fs.readFileSync(path.join(__dirname, "words_dictionary.json"));
const allWordsObj = JSON.parse(rawWordData); // Object with words as keys 
const allWords = Object.keys(allWordsObj);

const app = express();
const port = 5080;

//EJS template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//SSR route
app.get("/highscores", async (req, res) => {
  try {
    const highscores = await Highscore.find().sort({ time: 1 });
    res.render("highscore", { highscores });
  } catch (error) {
    console.error("Fel vid hämtning av highscores:", error);
    res.status(500).send("Ett fel inträffade vid hämtning av highscores.");
  }
});

//Public folder for static files
app.use(express.static(path.join(__dirname, "public")));


app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public/about.html"));
});


app.use(cors());
app.use(express.json()); 


let startTime; 
let correctWord; 

app.post("/startGame", (req, res) => {
    const wordLength = req.body.wordLength || 5;
    const allowRepeats = req.body.allowRepeats ?? false;

    correctWord = chooseWord(allWords, wordLength, allowRepeats);
    console.log("Valt ord:", correctWord); // console.log choosen word
    startTime = Date.now();

    res.status(200).json({ message: "Game started" });
});

app.post("/api/check-guess", (req, res) => {
    const { guess } = req.body;
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
    
    res.json({...feedback, correctWord}); // Send back feedback and correct word to frontend 
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

// app.post("/submitHighscore", (req, res) => {
//     const { name, time, guesses, wordLength, allowRepeats } = req.body;
//     let highscores = [];

//     if (fs.existsSync("highscores.json")) {
//         highscores = JSON.parse(fs.readFileSync("highscores.json"));
//     }
// highscores.push({ name, time, guesses, wordLength, allowRepeats });

// fs.writeFileSync("highscores.json", JSON.stringify(highscores, null, 2));
// res.status(200).json({ message: "Highscore saved", highscores });
// });

// MongoDB highscore
app.post("/submitHighscore", async (req, res) => {
    const { name, time, guesses, wordLength, allowRepeats } = req.body;
  
    try {
      const newHighscore = new Highscore({
        name,
        time,
        guesses,
        wordLength,
        allowRepeats,
      });
  
      const savedHighscore = await newHighscore.save();
      res.status(200).json({ message: "Highscore saved", highscore: savedHighscore });
    } catch (error) {
      console.error("Fel vid sparning av highscore:", error);
      res.status(500).json({ message: "Fel vid sparning av highscore" });
    }
  });
  

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});