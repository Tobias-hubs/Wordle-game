import Row from './Row';
function Board({ guesses = [], feedback = [], currentGuessIndex }) {
    const maxRows = 6;
    return (
      <div className="board">
        {Array.from({ length: maxRows }).map((_, i) => (
          <Row
            key={i}
            guess={guesses[i] || ""}
            feedback={feedback[i] || []}
            isActive={i === currentGuessIndex}
          />
        ))}
      </div>
    );
  }
  
  export default Board;
  
