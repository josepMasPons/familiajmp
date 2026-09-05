import React, { useState, useEffect } from 'react';
import './Pinball.css';
import { useNavigate } from "react-router-dom";
import { Form, Button} from "react-bootstrap";
 

function TJPinball() {
  const navigate = useNavigate();

  // tauler **********************************************
  
  const BOARD_WIDTH = 300;    // tauler amplada  cuadrar amb Tjpinball
  const BOARD_HEIGHT = 535;   // tauler llargada cuadrar amb Tjpinball

  // pilota **********************************************
  const BALL_SIZE = 12;       // mida de la pilota
  const getIniciStart = () => ({
   // x: 1 * (BOARD_WIDTH - BALL_SIZE),
   // y: 1 * (BOARD_HEIGHT - BALL_SIZE),
     x: 273, 
     y: 490,
  });
  const getRandomStart = () => ({
    x: Math.random() * (BOARD_WIDTH - BALL_SIZE),
    y: Math.random() * (BOARD_HEIGHT - BALL_SIZE),
    
  });
  const [ballPosition, setBallPosition] = useState(getIniciStart());
  const [velocity, setVelocity] =         useState({ x: -0, y: -10});
  const [originalVelocity, setOriginalVelocity] = useState({ x: 5, y: 1.5 });
  const [gravity, setGravity] = useState(0.2);
  const [speed, setSpeed] = useState(30);
  const [isBoosted, setIsBoosted] = useState(false);

  // obstacles  *****************************************
  const OBSTACLE_RADIUS = 6; // ubicació obstacles 
  const obstacles = [
    { x: 180, y: 263 },
    { x: 135, y: 200 },
    { x: 90, y: 263 }
  ];
  //  paret curva ***************************************
  const arcWalls = [
    {
      x: 155,
      y: 133,
      radius: 135,      
      startAngle: Math.PI,
      endAngle: 0
    }
  ];
  // flaps    *******************************************
  const FLAP_WIDTH = 50;     // mida flaps  llarc 
  const FLAP_HEIGHT = 10;     // mida flaps ample
  const FLAP_Y = 
        BOARD_HEIGHT - FLAP_HEIGHT -45;  // situació en alçada dels flaps
  const flaps = [
  { x: 85, y: FLAP_Y },     // situació flap  esquerra
  { x: BOARD_WIDTH - 
       FLAP_WIDTH - 100, y: FLAP_Y } // situació flap dret
   ];
  const [flapLeftActive, setFlapLeftActive] = useState(false);
  const [flapRightActive, setFlapRightActive] = useState(false);
  
  // paret  ****************************************************    
   const WALL_WIDTH = 25;  // paret vertical cuadrar amb wall-right  
  // paret inclinada  1 ******************************************
  
   const wallLength = 200;    // paret inclinada cuadrar amb diagonal-wall
   const wallAngle = 45 * 
             (Math.PI / 180); // en radians
   const diagonalWalls = [
    {
     x1: 130,
     y1: 440,
     x2: 130 + wallLength * Math.cos(wallAngle),
     y2: 440 + wallLength * Math.sin(wallAngle),
    }
   ];
 
  //  inici ******************************************************
  
  // useEffect  moure flaps 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'z' || e.key === 'Z') setFlapLeftActive(true);
      if (e.key === 'm' || e.key === 'M') setFlapRightActive(true);
    };
  
    const handleKeyUp = (e) => {
      if (e.key === 'z' || e.key === 'Z') setFlapLeftActive(false);
      if (e.key === 'm' || e.key === 'M') setFlapRightActive(false);
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // useEffect  gestió moviments  joc 
  useEffect(() => {
    
    const moveBall = () => {
      let newX = ballPosition.x + velocity.x;
      let newY = ballPosition.y + velocity.y + gravity;
  
      let newVelX = velocity.x;
      let newVelY = velocity.y;

      function drawTrajectory(ctx, trajectory) {
        ctx.beginPath();
        ctx.moveTo(trajectory[0].x, trajectory[0].y);
      
        for (let i = 1; i < trajectory.length; i++) {
          ctx.lineTo(trajectory[i].x, trajectory[i].y);
        }
      
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Color verd suau per la trajectòria
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      function isAngleBetween(angle, startAngle, endAngle) {
        if (startAngle <= endAngle) {
          return angle >= startAngle && angle <= endAngle;
        } else {
          return angle >= startAngle || angle <= endAngle;
        }
      }  
// --------- SEMICIRCULAR ARC COLLISION  ----------
let angleStep = 0.001; // Ràpid / lent per ajustar el pas de l'angle
let distanceFactor = 0.1; // Factor per ajustar la velocitat de sortida
let trajectory = [];
for (let arc of arcWalls) {
  const dx = newX + BALL_SIZE / 2 - arc.x;
  const dy = newY + BALL_SIZE / 2 - arc.y;

  let angle = Math.atan2(dy, dx);
  if (angle < 0) angle += 2 * Math.PI;

  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDist = arc.radius + BALL_SIZE / 2;

  const insideArc = isAngleBetween(angle, arc.startAngle, arc.endAngle);

  if (distance < minDist && insideArc) {
    // Calcular la velocitat en funció de la distància
    distanceFactor = Math.sqrt(newVelX * newVelX + newVelY * newVelY) / 2;  // Una escala per ajustar la velocitat de sortida

    // Si la velocitat és més alta, el pas de l'angle serà més petit, la pilota sortirà abans
    angleStep = Math.min(0.1, Math.max(0.05, distanceFactor));  // Ajusta aquest valor segons l'efecte que vols

    const nextAngle = angle - angleStep; // Direcció de dreta a esquerra

    // Nova posició al voltant de l'arc
    newX = arc.x - Math.cos(nextAngle) * minDist - BALL_SIZE / 2;
    newY = arc.y - Math.sin(nextAngle) * minDist - BALL_SIZE / 2;

    // Nova velocitat basada en l'angle
    newVelX = -Math.sin(nextAngle) * angleStep * minDist;
    newVelY =  Math.cos(nextAngle) * angleStep * minDist;

    // Afegir un efecte de "trajectòria"
    trajectory.push({ x: newX, y: newY });
    
    //drawTrajectory(ctx, trajectory);
     
    // Dibuixa la pilota després de dibuixar la trajectòria

    //ctx.beginPath();
    //ctx.arc(newX, newY, BALL_SIZE / 2, 0, Math.PI * 2);
    //ctx.fillStyle = "red";  // Color de la pilota
    //ctx.fill();
    //ctx.closePath();
  
    console.log('🌙 Seguiment del perímetre - angle:', (nextAngle * 180 / Math.PI).toFixed(1), '°');
    console.log('Posició →', newX.toFixed(1), newY.toFixed(1));
    console.log('Velocitat →', newVelX.toFixed(2), newVelY.toFixed(2));
  }
}


  // Comprovar si la pilota colideix amb l'arc
  //  if (distance < minDist && isAngleBetween(angle, arc.startAngle, arc.endAngle)) {
    //console.log('abans distance / minDist / dx / dy',distance,minDist,dx,dy);
    //console.log('abans newX / newY / newVelX / newVelY',newX,newY,newVelX,newVelY);
    // Càlcul del vector normal (perpendicular a la superfície de col·lisió)
   // const normX = dx / distance;
   // const normY = dy / distance;

    // Ajustar la posició de la pilota per evitar que es quedi dins de l'arc
    //const overlap = minDist - distance;
    //newX -= normX * overlap;
    //newY -= normY * overlap;

    // Càlcul del producte punt per obtenir la reflexió de la velocitat
    //const dot = newVelX * normX + newVelY * normY;  // Producte punt entre la velocitat i la normal

    // Reflexió de la velocitat (invertim la component normal)
    //newVelX -= 2 * dot * normX;
    //newVelY -= 2 * dot * normY;

    // Suavitzament opcional de la velocitat per evitar canvis bruscos
    //newVelX *= 0.9;
    //newVelY *= 0.9;

    // Depuració per veure el resultat de la reflexió
    //console.log('Rebot:', {
    //  velX: newVelX.toFixed(2),
    //  velY: newVelY.toFixed(2),
    //  angle: (angle * 180 / Math.PI).toFixed(1) + '°',
    //});
    //console.log('DESPRES newX / newY / newVelX / newVelY',newX,newY,newVelX,newVelY);



    //console.log('Posició final després de la col·lisió:', newX, newY);
//console.log('Velocitat final després del rebot:', newVelX, newVelY);
//console.log('cercle - ',newX,' :', newY , ' / ' , newVelX ,' : ', newVelY)


      /*  
      // ----OLD OLD OLD ----- SEMICIRCULAR ARC COLLISION  ----------
      for (let arc of arcWalls) {
        const dx = newX + BALL_SIZE / 2 - arc.x;  // Distància en X
        const dy = newY + BALL_SIZE / 2 - arc.y;  // Distància en Y
      
        // Càlcul de l'angle de la pilota respecte al centre de l'arc
        let angle = Math.atan2(dy, dx);  // Angle en radian
        if (angle < 0) angle += 2 * Math.PI;  // Ajustar perquè l'angle sigui positiu
      
        const distance = Math.sqrt(dx * dx + dy * dy);  // Distància entre la pilota i l'arc
        const minDist = arc.radius + BALL_SIZE / 2;  // Distància mínima per a la col·lisió
      
        // Comprovar si la pilota colideix amb l'arc
        if (distance < minDist && isAngleBetween(angle, arc.startAngle, arc.endAngle)) {
      
          // Càlcul del vector normal (perpendicular a la superfície de col·lisió)
          const normX = dx / distance;
          const normY = dy / distance;
      
          // Ajustar la posició de la pilota per evitar que es quedi dins de l'arc
          const overlap = minDist - distance;
          newX -= normX * overlap;
          newY -= normY * overlap;
      
          // Càlcul del producte punt per obtenir la reflexió de la velocitat
          const dot = newVelX * normX + newVelY * normY;  // Producte punt entre la velocitat i la normal
      
          // Reflexió de la velocitat (invertim la component normal)
          newVelX -= 2 * dot * normX;
          newVelY -= 2 * dot * normY;
      
          // Suavitzament opcional de la velocitat per evitar canvis bruscos
          newVelX *= 0.9;
          newVelY *= 0.9;
      
          // Depuració per veure el resultat de la reflexió
          console.log('Rebot:', {
            velX: newVelX.toFixed(2),
            velY: newVelY.toFixed(2),
            angle: (angle * 180 / Math.PI).toFixed(1) + '°',
          });
      
          // Depuració per veure la posició i velocitat després de la col·lisió
          console.log('Posició després de la col·lisió:', newX, newY);
          console.log('Velocitat després del rebot:', newVelX, newVelY);
        }
      }
      
          //console.log('Posició final després de la col·lisió:', newX, newY);
      //console.log('Velocitat final després del rebot:', newVelX, newVelY);
      //console.log('cercle - ',newX,' :', newY , ' / ' , newVelX ,' : ', newVelY)
      */

      /*
      // --------- DIAGONAL WALL COLLISION ----------
      for (let wall of diagonalWalls) {
        const { x1, y1, x2, y2 } = wall;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len;
        const ny = dx / len;
        const cx = newX + BALL_SIZE / 2;
        const cy = newY + BALL_SIZE / 2;
        const vx = cx - x1;
        const vy = cy - y1;
        const distToWall = vx * nx + vy * ny;
  
        if (Math.abs(distToWall) < BALL_SIZE / 2) {
          const dot = newVelX * nx + newVelY * ny;
          newVelX -= 2 * dot * nx;
          newVelY -= 2 * dot * ny;
  
          newX += nx * (BALL_SIZE / 2 - distToWall);
          newY += ny * (BALL_SIZE / 2 - distToWall);
        }
      }
  
      // ---------  WALL COLLISION ----------
      for (let wall of curvedWalls) {
        const dx = newX + BALL_SIZE / 2 - wall.x;
        const dy = newY + BALL_SIZE / 2 - wall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = wall.radius + BALL_SIZE / 2;
  
        if (distance < minDist) {
          const normX = dx / distance;
          const normY = dy / distance;
          newX = wall.x + normX * minDist - BALL_SIZE / 2;
          newY = wall.y + normY * minDist - BALL_SIZE / 2;
  
          const dot = newVelX * normX + newVelY * normY;
          newVelX -= 2 * dot * normX;
          newVelY -= 2 * dot * normY;
        }
      }
        
 
      // --------- WALL LIMITS ----------
      if (newX <= 0) {
        newVelX = -newVelX;
      } else {       
        if (newX >= BOARD_WIDTH - BALL_SIZE - WALL_WIDTH) {
       let xxx = BOARD_WIDTH - BALL_SIZE - WALL_WIDTH;
       console.log('wall dreta colissió X -', newX , ' - ', xxx , ' - ', newVelX)
        newVelX = -newVelX;
        }
      }
      if (newY <= 0) {
      newVelY = -newVelY;
      } else {  
        if (newY >= BOARD_HEIGHT - BALL_SIZE) {
        let yyy = BOARD_HEIGHT - BALL_SIZE;
        console.log('wall dreta colissió Y -', newY , ' - ', yyy, ' - ', newVelY)
        newVelY = -newVelY;
        }
      }
  
      // --------- OBSTACLE COLLISION (BOOST) ----------
      for (let obs of obstacles) {
        const dx = newX + BALL_SIZE / 2 - (obs.x + OBSTACLE_RADIUS);
        const dy = newY + BALL_SIZE / 2 - (obs.y + OBSTACLE_RADIUS);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = OBSTACLE_RADIUS + BALL_SIZE / 2;
  
        if (distance < minDist && !isBoosted) {
          const normX = dx / distance;
          const normY = dy / distance;
  
          newX = obs.x + OBSTACLE_RADIUS + normX * (minDist + 1) - BALL_SIZE / 2;
          newY = obs.y + OBSTACLE_RADIUS + normY * (minDist + 1) - BALL_SIZE / 2;
  
          setOriginalVelocity({ ...velocity });
          newVelX = -velocity.x * 2;
          newVelY = -velocity.y * 2;
          setIsBoosted(true);
  
          setTimeout(() => {
            setVelocity(originalVelocity);
            setIsBoosted(false);
          }, 300);
  
          break;
        }
      }  
      // --------- FLAPS COLLISION ----------
      const flapCollision = (flap, direction) => {
        const withinX = newX + BALL_SIZE > flap.x && newX < flap.x + FLAP_WIDTH;
        const withinY = newY + BALL_SIZE > flap.y && newY < flap.y + FLAP_HEIGHT;
        if (withinX && withinY) {
          newVelY = -Math.abs(newVelY) * 2;
          newVelX = direction === 'left' ? -Math.abs(newVelX) : Math.abs(newVelX);
        }
      };
  
      if (flapLeftActive) flapCollision(flaps[0], 'left');
      if (flapRightActive) flapCollision(flaps[1], 'right');
  */
      // --------- APPLY CHANGES ----------
      setVelocity({ x: newVelX, y: newVelY });
      setBallPosition({ x: newX, y: newY });
      //console.log(' final interval - ',ballPosition.x, ' - ', ballPosition.y )
    }; 
    // executa la funció moveBall , cada speed milisegons  
    const interval = setInterval(moveBall, speed);   
    return () => clearInterval(interval);
  }, [
    ballPosition,
    velocity,
    gravity,
    speed,
    isBoosted,
    originalVelocity,
    flapLeftActive,
    flapRightActive,
  ]);
  
  
  //  reste ****************

  const increaseSpeed = () => setSpeed((prev) => Math.max(prev - 2, 10));
  const decreaseSpeed = () => setSpeed((prev) => Math.min(prev + 2, 50));
  const toggleGravity = () => setGravity((prev) => (prev === 0.2 ? 0 : 0.2));
 // const Sacabat       = () => navigate('/TJInici'); 
  const Sacabat       = () => 
    {
     navigate('/Jocs0');
    }; 
  const Bola       = () => 
    {
      const getIniciStart = () => ({
        // x: 1 * (BOARD_WIDTH - BALL_SIZE),
        // y: 1 * (BOARD_HEIGHT - BALL_SIZE),
          x: 10, 
          y: 150,
       });
      setBallPosition(getIniciStart());
    }; 
  return (
    <>
    
    <div className="container">
       <h4>Pinball / veloc:  {speed} / grav.: {gravity} </h4> 
    {/*  <h4> ubic. pilota : {ballPosition.x} /  {ballPosition.y} </h4> */} 
       <div className='pinball-wrapper' >  
          <div className="TJPinball">
    {/* Paret diagonal 1 */}        
                <div className="diagonal-wall1" />
    {/* Paret diagonal 2 */}        
                 <div className="diagonal-wall2" />
    {/* Pilota */}
                <div
                  className="ball"
                  style={{
                    top: `${ballPosition.y}px`,
                    left: `${ballPosition.x}px`,
                    width: `${BALL_SIZE}px`,
                    height: `${BALL_SIZE}px`,
                  }}
                  />
    {/* Paret dreta */}
                <div className="wall-right1" />
    {/* Paret esquerra */}
                  <div className="wall-right2" />
    {/* Paret curva */}
    {arcWalls.map((arc, i) => (
      <div
      key={`arc-${i}`}
      className="circular-wall"      
      />
    ))}
   
    {/* Obstacles */}
                {obstacles.map((obs, index) => (
                <div
                  key={index}
                  className="obstacle"
                   style={{
                    top: `${obs.y}px`,
                    left: `${obs.x}px`,
                    width: `${OBSTACLE_RADIUS * 2}px`,
                    height: `${OBSTACLE_RADIUS * 2}px`,
                   }}
                />         
                ))}
    {/* Flaps */}
               {flaps.map((flap, index) => {
                const isActive = index === 0 ?
                      flapLeftActive : flapRightActive;
                const baseAngle = index === 0 ? 25 : -25;
                const activeAngle = index === 0 ? -30 : 30;
                const angle = isActive ? activeAngle : baseAngle;

              return (
               <div
                  key={`flap-${index}`}
                  className="flap"
                  style={{
                  top: `${flap.y}px`,
                  left: `${flap.x}px`,
                  width: `${FLAP_WIDTH}px`,
                  height: `${FLAP_HEIGHT}px`,
                  backgroundColor: '#444',
                  position: 'absolute',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: index === 0 ? 'left center' : 'right center',
                  transition: 'transform 0.1s ease-out',
                }}
              />
              );
            })}
            </div> 
          </div>
          <div className="d-flex justify-content-center mt-4 gap-3"> 
              <button onClick={increaseSpeed}> + vel.</button>
              <button onClick={decreaseSpeed}> - vel.</button>
              <button onClick={toggleGravity}>off/on grav.</button>
              <Button className="custom-button small-buttonP2 px-4 py-2" 
                    variant="danger" onClick={Bola}>
                  <i className="fas fa-flag-checkered"></i> Bola
              </Button>
              <Button className="custom-button small-buttonP2 px-4 py-2" 
                    variant="danger" onClick={Sacabat}>
                  <i className="fas fa-flag-checkered"></i> Fi prog.
              </Button>
          </div>
        </div>
      </>
    );
}
export default TJPinball;
