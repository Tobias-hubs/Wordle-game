function Cell({ letter, status }) {
    return (
      <div className={`cell ${status || ''}`}>
        {letter}
      </div>
    );
  }
  
  export default Cell;
  