import React from "react";

type KeyboardProps = {
  feedback: { letter: string; result: "correct" | "misplaced" | "incorrect" | null }[];
  onKeyPress: (key: string) => void; 
  onBackspace: () => void;
  onEnter: () => void;
};

const Keyboard = ({ feedback, onKeyPress, onBackspace, onEnter }: KeyboardProps) => {
  const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]
  ];

  const getFeedback = (letter: string) => {
    const feedbackItem = feedback.find(item => item.letter === letter);
    return feedbackItem ? feedbackItem.result : null;
  };

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = getFeedback(key);
            return (
              <button
                key={key}
                className={`key ${status}`}
                onClick={() => onKeyPress(key)} 
              >
                {key.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
      <div className="keyboard-row">
        <button className="key special" onClick={onBackspace}>
            ←
            </button>
            <button className="key special" onClick={onEnter}>
                Enter
                </button>
                </div>
    </div>
  );
};

export default Keyboard;
