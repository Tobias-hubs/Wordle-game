// import React from 'react';
// import Cell from './Cell';

// function Row({ guess = "", feedback = [], isActive }) {
//   const guessString = typeof guess === "string" ? guess : "";
//   const letters = guessString.padEnd(5).split(""); // Se till att det är 5 bokstäver

//   console.log("Row – guess:", guess);
// console.log("Row – letters:", letters);


//   return (
//     <div className={`row ${isActive ? "active" : ""}`}>
//       {letters.map((char, i) => (
//         <Cell
//           key={i}
//           status={feedback[i]?.result || ""}
//         >
//           {char.toUpperCase()} {/* Show letter in cell */}
//         </Cell>
//       ))}
//     </div>
//   );
// }

// export default Row;



// import React from 'react';
// import Cell from './Cell';

// type FeedbackItem = {
//   result?: "correct" | "misplaced" | "wrong";
//   // string
// };

// type RowProps = {
//   guess?: string;
//   feedback?: FeedbackItem[];
//   isActive?: boolean;
// };


// function Row({ guess = "", feedback = [], isActive = false }: RowProps) {
//   const guessString = typeof guess === "string" ? guess : "";
//   const letters = guessString.padEnd(5).split(""); // Se till att det är 5 bokstäver

//   console.log("Row – guess:", guess);
//   console.log("Row – letters:", letters);
//   console.log("Row – feedback:", feedback); 

//   return (
//     <div className={`row ${isActive ? "active" : ""}`}>
//       {letters.map((char, i) => (
//         <Cell key={i} status={feedback[i]?.result || ""}> 
//       {/*   >
//             */}
//           {char.toUpperCase()} {/* Show letter in cell */}
//         </Cell>
//       ))}
//     </div>
//   );
// }

// export default Row;


// import React from 'react';
// import Cell from './Cell';

// type FeedbackItem = {
//   result?: "correct" | "misplaced" | "wrong"; // Feedback för varje bokstav
// };

// type RowProps = {
//   guess?: string; // Ord som gissats
//   feedback?: FeedbackItem[]; // Feedback för varje bokstav
//   isActive?: boolean; // Om raden är aktiv eller inte
// };

// function Row({ guess = "", feedback = [], isActive = false }: RowProps) {
//   const guessString = typeof guess === "string" ? guess : "";
//   const letters = guessString.padEnd(5).split(""); // Se till att det är 5 bokstäver
//   console.log("Row feedback:", feedback);
//   const isArrayFeedback = Array.isArray(feedback);
//   console.log("feedback is array?", Array.isArray(feedback));

//   return (
//     <div className={`row ${isActive ? "active" : ""}`}>
//       {letters.map((char, i) => {
//         // Skicka feedback till varje cell baserat på index
//         const status = isArrayFeedback ? feedback[i]?.result : undefined; // Om feedback inte finns, sätt som "wrong"
//         console.log(`Cell ${i}: status:`, status);
//         return (
//           <Cell key={i} status={status}>
//             {char.toUpperCase()} {/* Visa bokstaven */}
//           </Cell>
//         );
//       })}
//     </div>
//   );
// }

// export default Row;

import React from "react";
import Cell from "./Cell";

type FeedbackItem = {
  result: "correct" | "misplaced" | "wrong";
};

type RowProps = {
  guess?: string;
  feedback?: FeedbackItem[];
  isActive?: boolean;
};

function Row({ guess = "", feedback = [], isActive = false }: RowProps) {
  const letters = guess.padEnd(5).split("");

  return (
    <div className={`row ${isActive ? "active" : ""}`}>
      {letters.map((char, i) => (
        <Cell key={i} status={feedback[i]?.result || ""}>
          {char.toUpperCase()}
        </Cell>
      ))}
    </div>
  );
}

export default Row;
