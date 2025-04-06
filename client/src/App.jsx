// export default App
import React from 'react';
import {useEffect, useState} from "react";
import Game from "./components/Game"; // 
import Board from "./components/Board"; //
import './App.css'
import "./board.css" // ? 

function App() { 
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    console.log("Fetching data from the server...");
    fetch("http://localhost:5080/api/test")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("There was an error!", error));
     }, []);

  return (
    <div>
      <h1>Wordle-game</h1>
        <p>Server say:{message}</p>
        <Game />
        <Board />
    </div>
    
  );
}

export default App;


