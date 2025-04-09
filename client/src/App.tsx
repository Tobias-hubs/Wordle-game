import React, { useEffect, useState } from "react";
import Game from "./components/Game"; 
import "./App.css";
import "./board.css";
import "./keyboard.css"; 

function App() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    console.log("Fetching data from the server...");
    fetch("http://localhost:5080/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("There was an error!", error));
  }, []);

  return (
    <div>
      <h1>Wordle-game</h1>
      <p>Server says: {message}</p>
      <Game />
    </div>
  );
}

export default App;

