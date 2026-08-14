import React, { useState, useEffect } from 'react';
import Board from './Board';
import BoardNext from './BoardNext.js';
import TetrisInterval from './TetrisInterval';
import './Tetris.css';
import { useNavigate } from "react-router-dom";

function getRandomPiece() {
  
  const pieces = [
    [[1, 1, 1], [0, 1, 0]], // T
    [[2, 2], [2, 2]],       // O
    [[0, 3, 3], [3, 3, 0]], // S
    [[4, 4, 4, 4]],         // I
    [[5, 5, 0], [0, 5, 5]], // Z
    [[6, 6, 6], [6, 0, 0]], // L
    [[7, 7, 7], [0, 0, 7]]  // J
  ];
  return pieces[Math.floor(Math.random() * pieces.length)];
}

function rotatePiece(piece) {
  return piece[0].map((_, i) => piece.map(row => row[i])).reverse();
}

function collides(board, piece, position) {
  const { x, y } = position;
  return piece.some((row, i) =>
    row.some((value, j) =>
      value !== 0 &&
      (board[x + i] && board[x + i][y + j]) !== 0
    )
  );
}

function merge(board, piece, position) {
  const { x, y } = position;
  const newBoard = board.map(row => row.slice());
  piece.forEach((row, i) => {
    row.forEach((value, j) => {
      if (value !== 0) {
        newBoard[x + i][y + j] = value;
      }
    });
  });
  return newBoard;
}

function clearRows(board) {
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  const rowsCleared = board.length - newBoard.length;
  while (newBoard.length < board.length) {
    newBoard.unshift(Array(board[0].length).fill(0));
  }
  return { clearedBoard: newBoard, rowsCleared };
}

function createEmptyBoard(rows, cols) {
  const board = Array.from({ length: rows }, () => Array(cols).fill(0));
  return board;
}

const Tetris = ({ canviarPantalla }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(createEmptyBoard(22, 12));
  const [currentPiece, setCurrentPiece] = useState(getRandomPiece());
  const [nextPiece, setNextPiece] = useState(getRandomPiece());
  const [position, setPosition] = useState({ x: 0, y: 4 });
  const [gameOver, setGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [showPantalla01, setShowPantalla01] = useState(0);

  let startX = null;
  let startY = null;
  let lastClickTime = 0;

  TetrisInterval(() => {
    if (!gameOver) {
      drop();
    }
  }, 500);

  const drop = () => {
    const { x, y } = position;
    const newPos = { x: x + 1, y };
    if (!collides(board, currentPiece, newPos)) {
      setPosition(newPos);
    } else {
      const newBoard = merge(board, currentPiece, position);
      const { clearedBoard, rowsCleared } = clearRows(newBoard);
      setBoard(clearedBoard);
      setScore(prevScore => prevScore + rowsCleared * 100);
      setCurrentPiece(nextPiece);
      setNextPiece(getRandomPiece());
      setPosition({ x: 0, y: 4 });
      if (collides(clearedBoard, nextPiece, { x: 0, y: 4 })) {
        setGameOver(true);
      }
    }
  };

  const move = (direction) => {
    const { x, y } = position;
    const newPos = { x, y: y + direction };
    if (!collides(board, currentPiece, newPos) && isWithinBounds(newPos, currentPiece, board)) {
      setPosition(newPos);
    }
  };

  const rotate = () => {
    const newPiece = rotatePiece(currentPiece);
    if (!collides(board, newPiece, position) && isWithinBounds(position, newPiece, board)) {
      setCurrentPiece(newPiece);
    }
  };

  const handleKeyPress = (event) => {
    if (gameOver) return;
    if (event.key === 'ArrowLeft') {
      move(-1);
    } else if (event.key === 'ArrowRight') {
      move(1);
    } else if (event.key === 'ArrowDown') {
      drop();
    } else if (event.key === 'ArrowUp') {
      rotate();
    }
  };

  const handleTouchStart = (event) => {
    if (gameOver) return;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  };

  const handleTouchMove = (event) => {
    if (gameOver) return;
    if (startX === null || startY === null) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        move(1);
      } else {
        move(-1);
      }
    } else {
      if (deltaY > 0) {
        drop();
      } else {
        rotate();
      }
    }
    startX = null;
    startY = null;
  };
   
  const handleMouseDown = (event) => {
    if (gameOver) return;
    startX = event.clientX;
    startY = event.clientY;
  };

  const handleMouseMove = (event) => {
    if (gameOver) return;
    if (startX === null || startY === null) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        move(1);
      } else {
        move(-1);
      }
    } else {
      if (deltaY > 0) {
        drop();
      } else {
        rotate();
      }
    }
    startX = null;
    startY = null;
  };

  const handleMouseUp = () => {
    startX = null;
    startY = null;
  };

  const handleMouseClick = (event) => {
    const clickTime = new Date().getTime();
    if (clickTime - lastClickTime < 300) {
      rotate();
    }
    lastClickTime = clickTime;
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleMouseClick);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleMouseClick);
    };
  });

  const restartGame = () => {
    setBoard(createEmptyBoard(22, 12));
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setPosition({ x: 0, y: 4 });
    setGameOver(false);
    setScore(0);
  };

  const Sacabat = () => {
      navigate('/Jocs0');
  };

  const isWithinBounds = (position, piece, board) => {
    return piece.every((row, i) =>
      row.every((value, j) =>
        value === 0 ||
        (board[position.x + i] !== undefined && board[position.x + i][position.y + j] !== undefined)
      )
    );
  };

  return (
    <div className='TEP01T'>
    
        <div>
          <h1 className="TEP02-capG">Tetris</h1>
          <h3 className="TEP02-capP">Punts: {score}</h3>
          <h3 className="TEP02-capP">següent peça : 
          <BoardNext
            board={createEmptyBoard(4, 4)}
            currentPiece={nextPiece}
            position={{ x: 0, y: 0 }}
            isNextPiece={true}
          />
          </h3>
          <br></br>
          <div className="TEtetris">
            <Board
              board={board}
              currentPiece={currentPiece}
              position={position}
              isNextPiece={false}
            />
          </div>
          <div className="TEgame-over">
            <button className="TEP02-buto" onClick={restartGame}>inici</button>
            <button className="TEP02-buto" onClick={Sacabat}>Fi del joc</button>
          </div>
        </div>
      
      
    </div>
  );
};

export default Tetris;
