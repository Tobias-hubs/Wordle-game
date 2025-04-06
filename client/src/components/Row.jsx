import Cell from './Cell';

// function Row({ guess, feedback = [], isActive }) {
//     // Säkerställer att raden alltid har 5 bokstäver (fyll ut med tomma om kort)
//     const letters = guess.padEnd(5).split("");
  
//     return (
//       <div className={`row ${isActive ? "active" : ""}`}>
//         {letters.map((char, i) => (
//           <Cell
//             key={i}
//             className={`cell ${feedback[i]?.result || ""}`} // t.ex. "correct", "present", "absent"
//           >
//             {char.toUpperCase()}
//           </Cell>
//         ))}
//       </div>
//     );
//   }
  
//   export default Row;
function Row({ guess = "", feedback = [], isActive }) {
    // Se till att guess är en sträng innan padEnd används
    const guessString = typeof guess === "string" ? guess : "";
    const letters = guessString.padEnd(5).split("");
  
    return (
      <div className={`row ${isActive ? "active" : ""}`}>
        {letters.map((char, i) => (
          <Cell
            key={i}
            className={`cell ${feedback[i]?.result || ""}`} // t.ex. "correct", "present", "absent"
          >
            {char.toUpperCase()}
          </Cell>
        ))}
      </div>
    );
  }
  
  export default Row;
  
  