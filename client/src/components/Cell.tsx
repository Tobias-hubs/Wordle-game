import React from "react";

type CellProps = {
  status?: "correct" | "misplaced" | "wrong" | "";
  children: React.ReactNode;
};

function Cell({ status = "", children }: CellProps) {
  return <div className={`cell ${status}`}>{children}</div>;
}

export default Cell;
