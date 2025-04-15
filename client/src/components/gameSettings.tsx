import React from "react";

interface GameSettingsProps {
  wordLength: number;
  allowRepeats: boolean;
  handleWordLengthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAllowRepeats: React.Dispatch<React.SetStateAction<boolean>>;
  startGame: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  wordLength,
  allowRepeats,
  handleWordLengthChange,
  setAllowRepeats,
  startGame,
}) => {
  return (
    <>
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
      
      <div>
        <label>
          <input
            type="checkbox"
            checked={allowRepeats}
            onChange={() => setAllowRepeats(!allowRepeats)}
          />
          Allow repeating letters
        </label>
      </div>
      
      <button onClick={startGame}>
        Start Game with {wordLength}-letter word
      </button>
    </>
  );
};

export default GameSettings;
