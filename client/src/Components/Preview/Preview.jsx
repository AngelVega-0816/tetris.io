import React from "react";
import "./styles.css";

import { buildBoard } from "../../bussines/Board";
import { transferToBoard } from "../../bussines/Tetrominoes";

import BoardCell from "../BoardCell/BoardCell";

const Preview = ({ tetromino, index }) => {
  const { shape, className } = tetromino;

  const board = buildBoard({ rows: 4, columns: 4 });


  board.rows = transferToBoard({
    className,
    isOccupied: false,
    position: { row: 0, column: 0 },
    rows: board.rows,
    shape
  });
  return (
    <div className={"Preview"}>
      <div className={"PreviewBoard"}>
        {board.rows.map((row, y) =>
          row.map((cell, x) => (
            <BoardCell key={x * board.size.columns + x} cell={cell} />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(Preview);
