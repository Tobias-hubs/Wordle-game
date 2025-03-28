// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import {useEffect, useState} from "react";

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
      <h1>Wordle-games</h1>
        <p>Server say:{message}</p>
    </div>
  );
}

export default App;
