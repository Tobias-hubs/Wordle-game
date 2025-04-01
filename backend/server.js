import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import cors from "cors";
import path from "path";
// import { gameLogic } from "./game/gameLogic.js"; 

const app = express();
const port = 5080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

app.get("/api/test", (req, res) => {
    res.json({ message: "Hello from the server.js!" });
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

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});