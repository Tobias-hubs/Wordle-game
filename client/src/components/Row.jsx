import Cell from './Cell';

function Row({ guess = "", feedback = [], isActive }) {
    const guessString = typeof guess === "string" ? guess : "";
    const letters = guessString.padEnd(5).split("");
  
    return (
      <div className={`row ${isActive ? "active" : ""}`}>
        {letters.map((char, i) => (
          <Cell
            key={i}
            className={`cell ${feedback[i]?.result || ""}`} 
          >
            {char.toUpperCase()}
          </Cell>
        ))}
      </div>
    );
  }
  
  export default Row;
  
  