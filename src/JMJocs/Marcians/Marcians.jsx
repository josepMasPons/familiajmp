import React, { useState, useEffect } from 'react';
import Alien from './Alien.js';
import Player from './Player.js';
import Bullet from './Bullet.js';
import './Marcians.css'; 
import { useNavigate } from "react-router-dom";
import Benrera from '../../JMGlobal/Benrera.js';

function Marcians({ canviarPantalla }) {
  const navigate = useNavigate();
  const [showPantalla01, setShowPantalla01] = useState(0);
  const [nimatge1, setNimatge1] = useState(1);
  const [nimatge2, setNimatge2] = useState(2);
  const [nimatge3, setNimatge3] = useState(3);
  const [nimatge4, setNimatge4] = useState(4);
  const [aliens1, setAliens1] = useState([]);
  const [aliens2, setAliens2] = useState([]);
  const [aliens3, setAliens3] = useState([]);
  const [aliens4, setAliens4] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(50); // initial position in percentage
  const [score, setScore] = useState(0);
  const [bullets, setBullets] = useState([]);
  const [gameOver, setGameOver] = useState(true);
 
  const initializeAliens1 = () => {
    setNimatge1(1);
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      position: Math.random() * 90,
      top: 16,
      direction: Math.random() > 0.5 ? 1 : -1 
    }));
  };
  const initializeAliens2 = () => {
    setNimatge2(2);
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: Math.random() * 90,
      top: 10,
      direction: Math.random() > 0.5 ? 1 : -1  
    }));
  };
  const initializeAliens3 = () => {
    setNimatge3(3);
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      position: Math.random() * 90,
      top: 5,
      direction: Math.random() > 0.5 ? 1 : -1  
    }));
  };
  const initializeAliens4 = () => {
    setNimatge4(4);
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: Math.random() * 90,
      top: 0,
      direction: Math.random() > 0.5 ? 1 : -1  
    }));
  };

  useEffect(() => {
    if (gameOver) return;

    const moveAliens1 = () => {
      setAliens1(prevAliens1 => 
        prevAliens1.map(alien1 => {
          let newTop = alien1.top;
          newTop = newTop + (Math.random() > 0.5 ? 1 : 0);  
          let newPosition = alien1.position + alien1.direction;

          if (newPosition < 0 || newPosition > 90) {
            alien1.direction *= -1; // reverse direction
            newPosition = alien1.position + alien1.direction;
          }

          if (newTop >= 90) {
            setGameOver(true);
            return { ...alien1, top: 90 }; // stop alien at bottom
          }

          return { ...alien1, top: newTop, position: newPosition };
        })
      );
    };

    const moveAliens2 = () => {
      setAliens2(prevAliens2 => 
        prevAliens2.map(alien2 => {
          let newTop = alien2.top;
          newTop = newTop + (Math.random() > 0.5 ? 1 : 0);  
          let newPosition = alien2.position + alien2.direction;

          if (newPosition < 0 || newPosition > 90) {
            alien2.direction *= -1; // reverse direction
            newPosition = alien2.position + alien2.direction;
          }

          if (newTop >= 90) {
            setGameOver(true);
            return { ...alien2, top: 90 }; // stop alien at bottom
          }

          return { ...alien2, top: newTop, position: newPosition };
        })
      );
    };

    const moveAliens3 = () => {
      setAliens3(prevAliens3 => 
        prevAliens3.map(alien3 => {
          let newTop = alien3.top;
          newTop = newTop + (Math.random() > 0.5 ? 1 : 0);  
          let newPosition = alien3.position + alien3.direction;

          if (newPosition < 0 || newPosition > 90) {
            alien3.direction *= -1; // reverse direction
            newPosition = alien3.position + alien3.direction;
          }

          if (newTop >= 90) {
            setGameOver(true);
            return { ...alien3, top: 90 }; // stop alien at bottom
          }

          return { ...alien3, top: newTop, position: newPosition };
        })
      );
    };

    const moveAliens4 = () => {
      setAliens4(prevAliens4 => 
        prevAliens4.map(alien4 => {
          let newTop = alien4.top;
          newTop = newTop + (Math.random() > 0.5 ? 1 : 0);  
          let newPosition = alien4.position + alien4.direction;

          if (newPosition < 0 || newPosition > 90) {
            alien4.direction *= -1; // reverse direction
            newPosition = alien4.position + alien4.direction;
          }

          if (newTop >= 90) {
            setGameOver(true);
            return { ...alien4, top: 90 }; // stop alien at bottom
          }

          return { ...alien4, top: newTop, position: newPosition };
        })
      );
    };

    const interval = setInterval(() => {
      moveAliens1();
      moveAliens2();
      moveAliens3();
      moveAliens4();
      updateBullets();
      checkCollision();
    }, 200);

    return () => clearInterval(interval);
  }, [aliens1, bullets, gameOver]);

  const shootBullet = () => {
    setBullets([...bullets, { id: Date.now(), position: playerPosition + 1, top: 90 }]);
  };

  const updateBullets = () => {
    setBullets(bullets.map(bullet => ({
      ...bullet,
      top: bullet.top - 20, // Increased speed
    })).filter(bullet => bullet.top > 0));
  };
/*-------------------------------------------------
revissió de colissió proposada per chatgpt
const checkCollision = () => {
  const filterAliens = (aliens, points) => {
    return aliens.filter(alien => {
      const hit = bullets.some(bullet => 
        Math.abs(bullet.position - alien.position) < 5 &&
        Math.abs(bullet.top - alien.top) < 5
      );
      if (hit) setScore(prev => prev + points);
      return !hit;
    });
  };
-------------------------------------------------*/
  const checkCollision = () => {
    setAliens1(prevAliens => 
      prevAliens.filter(alien => {
        const hit = bullets.some(bullet => 
          Math.abs(bullet.position - alien.position) < 5 &&
          Math.abs(bullet.top - alien.top) < 5
        );
        if (hit) {
          setScore(prev => prev + 4);
          setNimatge1(5)
        }
        return !hit;
      })
    );
    setAliens2(prevAliens => 
      prevAliens.filter(alien => {
        const hit = bullets.some(bullet => 
          Math.abs(bullet.position - alien.position) < 5 &&
          Math.abs(bullet.top - alien.top) < 5
        );
        if (hit) {
          setScore(prev => prev + 3);
          setNimatge2(5)
        }
          return !hit;
      })
    );
    setAliens3(prevAliens => 
      prevAliens.filter(alien => {
        const hit = bullets.some(bullet => 
          Math.abs(bullet.position - alien.position) < 5 &&
          Math.abs(bullet.top - alien.top) < 5
        );
        if (hit) {
          setScore(prev => prev + 2);
          setNimatge3(5)
        }
        return !hit;
      })
    );
    setAliens4(prevAliens => 
      prevAliens.filter(alien => {
        const hit = bullets.some(bullet => 
          Math.abs(bullet.position - alien.position) < 5 &&
          Math.abs(bullet.top - alien.top) < 5
        );
        if (hit) {
          setScore(prev => prev + 1);
          setNimatge4(5)
        }
        return !hit;
      })
    );
  };

  const restartGame = () => {
    setAliens1(initializeAliens1());
    setAliens2(initializeAliens2());
    setAliens3(initializeAliens3());
    setAliens4(initializeAliens4());
    setBullets([]);
    setPlayerPosition(50);
    setGameOver(false);
    setScore(0); // Reiniciar puntuación
  };

  useEffect(() => {
    setAliens1(initializeAliens1());
    setAliens2(initializeAliens2());
    setAliens3(initializeAliens3());
    setAliens4(initializeAliens4());
  }, []);

  function Sacabat() {
   navigate('/Jocs0');
  }
  Benrera(Sacabat);
  return (
    <div> 
    
        <div className="ALgame">     
          <h1>Score: {score}</h1>
          {gameOver && <h2>Game Over!</h2>}
          <div className="ALgame-area">
            {aliens1.map(alien => (
              <Alien key={alien.id} 
              position={alien.position} 
              Aimage={nimatge1} 
              top={alien.top} />
            ))}
            {aliens2.map(alien => (
              <Alien key={alien.id} position={alien.position} Aimage={nimatge2} top={alien.top} />
            ))}
            {aliens3.map(alien => (
              <Alien key={alien.id} position={alien.position} Aimage={nimatge3} top={alien.top} />
            ))}
            {aliens4.map(alien => (
              <Alien key={alien.id} position={alien.position} Aimage={nimatge4} top={alien.top} />
            ))}
            {bullets.map(bullet => (
              <Bullet key={bullet.id} position={bullet.position} top={bullet.top} />
            ))} 
            {!gameOver && <Player position={playerPosition - 1} setPosition={setPlayerPosition} shootBullet={shootBullet} />}
          </div>     
          <div className="ALgame-over">          
            <button className='ALP02-buto' onClick={restartGame}>Inici</button>
            <button className="ALP02-buto" onClick={Sacabat}>Fi del joc</button>
          </div>
        </div>  
           
    </div>
  );
}

export default Marcians;
