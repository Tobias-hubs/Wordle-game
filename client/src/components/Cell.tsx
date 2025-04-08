
// import React from 'react';

// function Cell({ status, children }) {
//   return (
//     <div className={`cell ${status || ""}`}>
//       {children} {/* Visa bokstaven som är skriven */}
//     </div>
//   );
// }

// export default Cell;



// import React, { ReactNode } from 'react';

// type CellProps = {
//   // status?: string;
//   status?: "correct" | "misplaced" | "wrong"; //
//   children: ReactNode;
// };

// function Cell({ status, children }: CellProps) {
//   const className = status ? `cell ${status}` : "cell"; // Kontrollera om status är giltig
//   console.log("Cell - status:", status); // Logga status för att se vad som skickas in
//   return (
//     <div className={className}> 
//      {/*status || "" */}
//       {children} {/* Visa bokstaven som är skriven */}
//     </div>

//   );
// }

// export default Cell;

import React from "react";

type CellProps = {
  status?: "correct" | "misplaced" | "wrong" | "";
  children: React.ReactNode;
};

function Cell({ status = "", children }: CellProps) {
  return <div className={`cell ${status}`}>{children}</div>;
}

export default Cell;
