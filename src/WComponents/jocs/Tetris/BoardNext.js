 
import React from 'react';
import './Tetris.css';

const BoardNext = ({ board, currentPiece, position, isNextPiece }) => {
  const { x, y } = position;

  // Generar el tauler amb la peça actual
  const displayBoard = board.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      let pieceValue = 0;
      if (
        rowIndex >= x &&
        rowIndex < x + currentPiece.length &&
        colIndex >= y &&
        colIndex < y + currentPiece[0].length
      ) {
        pieceValue = currentPiece[rowIndex - x][colIndex - y];
      }
      return pieceValue || cell;
    })
  );

  return (
    <div className="TEBoardNext">
      {displayBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`TEboard-cell ${cell ? `color-${cell}` : ''}`}
          />
        ))
      )}








    </div>
  );
};

const getColorClass = (value) => {
  switch (value) {
    case 1:
      return 'color-1';
    case 2:
      return 'color-2';
    case 3:
      return 'color-3';
    case 4:
      return 'color-4';
    case 5:
      return 'color-5';
    case 6:
      return 'color-6';
    case 7:
      return 'color-7';
    default:
      return '';
  }
};

export default BoardNext;