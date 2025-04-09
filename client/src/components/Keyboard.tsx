import React from "react";

type KeyboardProps = {
  feedback: { letter: string; result: "correct" | "misplaced" | "incorrect" | null }[];
  onKeyPress: (key: string) => void; // Funktion för att hantera tangenttryckningar
};

const Keyboard = ({ feedback, onKeyPress }: KeyboardProps) => {
  // Skapa en lista med alla bokstäver i QWERTY-format
  const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]
  ];

  // Hitta feedback för varje tangent
  const getFeedback = (letter: string) => {
    const feedbackItem = feedback.find(item => item.letter === letter);
    return feedbackItem ? feedbackItem.result : null;
  };

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = getFeedback(key); // Hämta status för denna tangent (correct, misplaced, incorrect)
            return (
              <button
                key={key}
                className={`key ${status}`}
                onClick={() => onKeyPress(key)} // Anropa onKeyPress när användaren klickar på en tangent
              >
                {key.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
