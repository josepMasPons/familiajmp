// src/components/Board.js
import React from 'react';

const Board = ({ board, currentPiece, position, isNextPiece }) => {
  const { x, y } = position;
  const displayBoard = isNextPiece ? Array.from({ length: 4 }, () => Array(4).fill(0)) : board.map(row => row.slice());

  if (!isNextPiece) {
    currentPiece.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value !== 0) {
          displayBoard[x + i][y + j] = value;
        }
      });
    });
  } else {
    currentPiece.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value !== 0) {
          displayBoard[i][j] = value;
        }
      });
    });
  }

  return (
    <div className={`board ${isNextPiece ? 'next-piece-board' : ''}`}>
      {displayBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`board-cell ${cell !== 0 ? getColorClass(cell) : ''}`}
            />
          ))}
        </div>
      ))}
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

export default Board;
