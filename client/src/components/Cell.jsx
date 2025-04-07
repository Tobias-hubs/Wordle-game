
import React from 'react';

function Cell({ status, children }) {
  return (
    <div className={`cell ${status || ""}`}>
      {children} {/* Visa bokstaven som är skriven */}
    </div>
  );
}

export default Cell;
