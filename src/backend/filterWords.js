import fs from "fs"; 
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Read original file 
const raw = fs.readFileSync(path.join(__dirname,"words_dictionary.json"));
const wordsObj = JSON.parse(raw);

// Filter words between 3 and 8
let filtered = Object.keys(wordsObj).filter(
    w => w.length >= 3 && w.length <= 8 
); 

// Random order and max 20 000 words
filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 20000);

// Make same format 
const newObj = {};
filtered.forEach(w => newObj[w] = 1);

fs.writeFileSync(path.join(__dirname, "words_filtered.json"), JSON.stringify(newObj, null, 2));