import mongoose from 'mongoose';

const highscoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: Number, required: true },
  guesses: { type: [String], required: true },
  wordLength: { type: Number, required: true },
  allowRepeats: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Highscore', highscoreSchema);
