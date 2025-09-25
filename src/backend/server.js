import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { controllGuess, chooseWord } from "./game/gameLogic.js";
import mongoose from "mongoose";
import Highscore from "./models/Highscore.js"; // Import the Highscore model


if (process.env.NODE_ENV !== "test") {
const mongoUri = process.env.MONGODB_URI; // Local mongodb://localhost:27017/HighscoreList
mongoose
  .connect(mongoUri)
  .then(() => console.log("Ansluten till MongoDB Atlas"))
  .catch((err) => console.error("Fel vid anslutning till MongoDB:", err));
  console.log("Mongodb url är", process.env.MONGODB_URI);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawWordData = fs.readFileSync(path.join(__dirname, "words_filtered.json"));
const allWordsObj = JSON.parse(rawWordData);  //Object with words as keys 
const allWords = Object.keys(allWordsObj);
// const allWords = JSON.parse(rawWordData);

console.log("Totalt antal ord:", allWords.length);
console.log("Exempel:", allWords.slice(0, 10));

const app = express();
const port = process.env.PORT || 5080;

//EJS template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//General SSR highscore page 
app.get("/highscores", async (req, res) => {
  try {
    const highscores = await Highscore.find().sort({ time: 1 });
    res.render("highscore", { highscores });
  } catch (error) {
    res.status(500).send("Ett fel inträffade vid hämtning av highscores.");
  }
});

// Filtered SSR highscore page based on word length and allowRepeats
app.get("/highscores/:wordLength/:allowRepeats", async (req, res) => {
  const { wordLength, allowRepeats } = req.params;
  try {
    const filteredHighscores = await Highscore.find({
      wordLength: Number(wordLength),
      allowRepeats: allowRepeats === "true"  // Convert string to boolean
    }).sort({ time: 1 });
  
    res.render("highscore", { highscores: filteredHighscores });
  } catch (error) {
    res.status(500).send("Ett fel inträffade vid hämtning av filtrerade highscores.");
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
  const wordLength = Number(req.body.wordLength) || 5;
  const allowRepeats = req.body.allowRepeats ?? false;

  //  Kontrollera att längden är mellan 3 och 8
  if (wordLength < 3 || wordLength > 8) {
    return res.status(400).json({
      message: "Endast ordlängd mellan 3 och 8 är tillåten."
    });
  }

  //  Filtrera ordlistan på längd
  const possibleWords = allWords.filter(w => w.length === wordLength);

  if (possibleWords.length === 0) {
    return res.status(400).json({
      message: `Inga ord hittades med längden ${wordLength}.`
    });
  }

  // Välj ord från filtrerade listan
  correctWord = chooseWord(possibleWords, wordLength, allowRepeats);

  if (process.env.NODE_ENV !== "production") {
    console.log("Rätt ord är:", correctWord);
  }

  startTime = Date.now();
  res.status(200).json({ message: "Game started" });
});

app.post("/api/check-guess", (req, res) => {
    const { guess } = req.body;

    if (!guess) {
        return res.status(400).json({ message: "Ingen gissning angiven" });
    }

    if (!correctWord) {
        return res.status(500).json({ message: "Spelet har inte startats korrekt. Korrekt ord saknas." });
    }

    const feedback = controllGuess(guess, correctWord);
    if (feedback.isGameOver) {
    
    res.json({...feedback, correctWord}); // Send back feedback and correct word to frontend 
    } else { 
    res.json(feedback);
}});

// Production build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  //game page
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

  // For all other routes, send index.html
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });
}

app.post("/endGame", (req, res) => {
    const endTime = Date.now();
    const timeTaken = endTime - startTime; 
    res.status(200).json({ message: `Game over. Time taken: ${timeTaken}ms`, timeTaken });
});


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
      res.status(500).json({ message: "Fel vid sparning av highscore" });
    }
  });
  
if (process.env.NODE_ENV !== "test") {
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
} 

export default app; // Export the app for testing purposes