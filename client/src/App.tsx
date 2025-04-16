// import React, { useEffect, useState } from "react";
import Game from "./components/Game"; 
import "./App.css";
import "./board.css";
import "./keyboard.css"; 
import Header from "./components/Navigation"; // Import Navigation component

function App() {

  return (
    <div> 
      <Header /> {/* Include Navigation component */}
      <h1>Wordle-game</h1>
      <Game />
    </div>
  );
}

export default App;

