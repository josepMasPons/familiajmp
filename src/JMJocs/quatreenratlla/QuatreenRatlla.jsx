import { useState, useEffect } from "react";
import "./QuatreenRatlla.css";
import { Form, Button, Container, Row, Col, Card} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import logoX from './logojugador.png';
import logoO from './logowindows.png';
import logobuit from './logobuit.png';
import Benrera from "../../JMGlobal/Benrera";

const ROWS = 6;
const COLS = 6;

function QuatreenRatlla() {
  const emptyBoard = Array(36).fill(null);
  const navigate=useNavigate();
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  
  useEffect(() => {
    const w = calculateWinner(board);
    setWinner(w);

    if (!w && !xIsNext) {
      setTimeout(computerMove, 400);
    }
  }, [board, xIsNext]);


  /* ========= UTILITATS ========= */
  function Tauler({ value}) {
  let imageSrc = '';
  if (value === 'X') {
    imageSrc = logoX; 
  } else if (value === 'O') {
    imageSrc = logoO; 
  } else  {
    imageSrc = logobuit; 
  }
  return (
    <button className="square" >
   {imageSrc && <img src={imageSrc} alt={value} />}
    </button>
  );
}
  function index(r, c) {
    return r * COLS + c;
  }

  function isPlayable(squares, i) {
    if (squares[i] !== null) return false;
    if (i >= 30) return true;
    return squares[i + COLS] !== null;
  }

  function getValidMoves(squares) {
    return squares
      .map((_, i) => (isPlayable(squares, i) ? i : null))
      .filter(i => i !== null);
  }

  /* ========= JUGADOR ========= */

  function handleClick(i) {
    if (winner || !xIsNext) return;
    if (!isPlayable(board, i)) return;

    const next = board.slice();
    next[i] = "X";
    setBoard(next);
    setXIsNext(false);
  }

  /* ========= IA ========= */

  function computerMove() {
    const squares = board.slice();
    const validMoves = getValidMoves(squares);

    // 1️⃣ Guanyar
    for (let m of validMoves) {
      squares[m] = "O";
      if (calculateWinner(squares) === "O") {
        setBoard(squares);
        setXIsNext(true);
        return;
      }
      squares[m] = null;
    }

    // 2️⃣ Bloquejar guany immediat
    for (let m of validMoves) {
      squares[m] = "X";
      if (calculateWinner(squares) === "X") {
        squares[m] = "O";
        setBoard(squares);
        setXIsNext(true);
        return;
      }
      squares[m] = null;
    }

    // 3️⃣ BLOQUEJAR 3 SEGUIDES (cas crític)
    const threat = findThreeInRowThreat(squares);
    if (threat !== null) {
      squares[threat] = "O";
      setBoard(squares);
      setXIsNext(true);
      return;
    }

    // 4️⃣ Centre / aleatori
    const centerMoves = validMoves.filter(i => i % COLS === 2 || i % COLS === 3);
    const move =
      centerMoves.length > 0
        ? centerMoves[Math.floor(Math.random() * centerMoves.length)]
        : validMoves[Math.floor(Math.random() * validMoves.length)];

    squares[move] = "O";
    setBoard(squares);
    setXIsNext(true);
  }

  /* ========= DETECCIÓ 3 SEGUIDES ========= */

  function findThreeInRowThreat(squares) {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        for (let [dr, dc] of directions) {
          const r2 = r + dr;
          const c2 = c + dc;
          const r3 = r + 2 * dr;
          const c3 = c + 2 * dc;

          if (
            r3 < 0 || r3 >= ROWS ||
            c3 < 0 || c3 >= COLS
          ) continue;

          const i1 = index(r, c);
          const i2 = index(r2, c2);
          const i3 = index(r3, c3);

          if (
            squares[i1] === "X" &&
            squares[i2] === "X" &&
            squares[i3] === "X"
          ) {
            // esquerra
            const rl = r - dr;
            const cl = c - dc;
            if (rl >= 0 && rl < ROWS && cl >= 0 && cl < COLS) {
              const il = index(rl, cl);
              if (isPlayable(squares, il)) return il;
            }

            // dreta
            const rr = r + 3 * dr;
            const cr = c + 3 * dc;
            if (rr >= 0 && rr < ROWS && cr >= 0 && cr < COLS) {
              const ir = index(rr, cr);
              if (isPlayable(squares, ir)) return ir;
            }
          }
        }
      }
    }
    return null;
  }

  /* ========= GUANYADOR ========= */

  function calculateWinner(squares) {
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        for (let [dr, dc] of dirs) {
          const line = [];
          for (let k = 0; k < 4; k++) {
            const rr = r + k * dr;
            const cc = c + k * dc;
            if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) break;
            line.push(index(rr, cc));
          }
          if (line.length === 4) {
            const v = squares[line[0]];
            if (v && line.every(i => squares[i] === v)) {
              return v;
            }
          }
        }
      }
    }
    return null;
  }

  function reset() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setWinner(null);
  }

  /* ========= RENDER ========= */
  const Sacabat = () => { 
    navigate('/Jocs0');     
  };
  Benrera(Sacabat);     
  return (
    <div className="game">
      <h1 className='title'>Quatre en ratlla</h1>

      <div className="board">
        {board.map((value, i) => (
       <button
          key={i}
          className="cell"
          onClick={() => handleClick(i)}
        >
          <Tauler value={value} />
        </button>
        ))}
        </div>
        <div className="status">
  {!winner && (
    xIsNext 
      ? <span className="player-turn">Torn del jugador (X)</span> 
      : <span className="ai-turn">Torn de la IA (O)</span>
  )}

  {winner === "X" && <span className="win">🎉 Has guanyat!</span>}
  {winner === "O" && <span className="lose">🤖 Ha guanyat la IA!</span>}
</div>

      <div className="d-flex gap-3">
      <Button className="mb-2" 
                        variant="warning"
                           size='sm'
                        onClick={Sacabat}>                                      
                      Sortir Joc   
      </Button>   
      <Button className="mb-2" 
                                variant="primary"
                                   size='sm'
                                onClick={reset}>                                      
                      Reiniciar  
      </Button>     
    </div>
    </div>
  );
}

export default QuatreenRatlla;
