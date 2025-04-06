import Row from './Row';

// function Board({ guesses, currentGuessIndex }) {
//   return (
//     <div className="board">
//       {Array.from({ length: 6 }).map((_, i) => (
//         <Row 
//           key={i} 
//           guess={guesses[i] || ""} 
//           isActive={i === currentGuessIndex} 
//         />
//       ))}
//     </div>
//   );
// }

// export default Board;
function Board({ guesses = [], feedback = [], currentGuessIndex }) {
    return (
      <div className="board">
        {Array.from({ length: 6 }).map((_, i) => (
          <Row
            key={i}
            guess={guesses[i] || ""}
            feedback={feedback[i] || []} // 🟢 Se till att detta alltid är en array
            isActive={i === currentGuessIndex}
          />
        ))}
      </div>
    );
  }
  
  export default Board;
  
