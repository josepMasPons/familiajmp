import React, { useState, useEffect, useRef } from 'react';
import './Caçador.css';

import imatge01 from '../Jocs0Logos/JMHimage01.svg';
import imatge02 from '../Jocs0Logos/JMHimage02.svg';
import imatge03 from '../Jocs0Logos/gespa.jpg';
import { useNavigate } from "react-router-dom";
import { Form, Button} from "react-bootstrap";
import Benrera from '../../JMGlobal/Benrera';

const TJHero01 = () => {
  const navigate = useNavigate();
  const [estat01, setEstat01] = useState(true);
 
  const largada = 500;
  const alçada = 450;
  const ampladaAvatar = 20;
  const alçadaAvatar = 20;

  const [posicio, setPosicio] = useState({ x: 0, y: 0 });

  const [posiciox, setPosiciox] = useState({ x: 0, y: 0 });
  const [direccio, setDireccio] = useState('dreta');
  const [colorsRecuadre, setColorsRecuadre] = useState({});
  const [historialDireccions, setHistorialDireccions] = useState([]);
  const [velocitat] = useState(50); // Ajustable
  const [actiu, setActiu] = useState(true);
  const [velo, setVelo] = useState(5);   // velocitat guineu
  const [veloH, setVeloH] = useState(5); // Velocitat del caçador
  const [missatge, setMissatge] = useState("");

  // 🧱 Obstacles
  const obstacles = [
    { x: 300, y: 100, width: 5, height: 200 }, // Mur gran
    { x: 100, y: 150, width: 5, height: 30 },  // Bloc petit
    { x: 105, y: 150, width: 5, height: 30 },  // Bloc petit
    { x: 110, y: 150, width: 5, height: 30 },  // Bloc petit
    { x: 115, y: 150, width: 5, height: 30 },  // Bloc petit
    { x: 120, y: 150, width: 5, height: 30 },  // Bloc petit
    { x: 125, y: 150, width: 5, height: 30 },  // Bloc petit
    { x: 400, y: 300, width: 5, height: 120 },  // Bloc Mitjà

    { x: 400, y:   10, width: 5, height: 10 }, 
    { x: 410, y:   10, width: 5, height: 20 },  
    { x: 420, y:   10, width: 5, height: 30 },
    { x: 430, y:   10, width: 5, height: 40 }, 
    { x: 440, y:   10, width: 5, height: 50 },  
    { x: 450, y:   10, width: 5, height: 60 },
    { x: 460, y:   10, width: 5, height: 70 }, 
    { x: 470, y:   10, width: 5, height: 80 }  
   
  ];

  // 🎨 Colors aleatoris de marc
  const generarColorsAleatoris = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'magenta'];
    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
    const base = randomColor();
    setColorsRecuadre({      
      top: base,
      right: base,
      bottom: base,
      left: base,
    });
  };

  // 📍 Posició inicial aleatòria
  const generarPosicioAleatoria = () => {
    const x = Math.floor(Math.random() * (largada - ampladaAvatar));
    const y = Math.floor(Math.random() * (alçada - alçadaAvatar));
    setPosicio({ x, y });
  };

  // 🔍 Comprovar col·lisió amb qualsevol obstacle
  const colisioAmbObstacle = (x, y) => {
    return obstacles.some((obs) => {
      return (
        x < obs.x + obs.width &&
        x + ampladaAvatar > obs.x &&
        y < obs.y + obs.height &&
        y + alçadaAvatar > obs.y
      );
    });
  };

  // 📏 Fora dels límits del tauler
  const foraDeLimits = (x, y) => {
    return (
      x < 0 ||
      y < 0 ||
      x > ( largada - ampladaAvatar  - 20) ||
      y > (alçada - alçadaAvatar  - 20)
    );
  };

  // 🔁 Moviment automàtic amb detecció i correcció
  useEffect(() => {
    const interval = setInterval(() => {
      let { x, y } = posicio;
      let newX = x;
      let newY = y;
      switch (direccio) {
        case 'dreta': newX += velo; break;
        case 'esquerra': newX -= velo; break;
        case 'amunt': newY -= velo; break;
        case 'avall': newY += velo; break;
      }
      const haXocat = foraDeLimits(newX, newY) 
            || colisioAmbObstacle(newX, newY);
        if (haXocat) {
        const direccionsPossibles = ['dreta', 'esquerra', 'amunt', 'avall'];
        const direccionsLliures = direccionsPossibles.filter((d) => {
          if (d === direccio || historialDireccions.includes(d)) return false;
          let testX = x, testY = y;
          if (d === 'dreta') testX += velo;
          else if (d === 'esquerra') testX -= velo;
          else if (d === 'amunt') testY -= velo;
          else if (d === 'avall') testY += velo;

          return !foraDeLimits(testX, testY) && !colisioAmbObstacle(testX, testY);
        });

        let novaDireccio = direccionsLliures.length > 0
          ? direccionsLliures[Math.floor(Math.random() * direccionsLliures.length)]
          : direccionsPossibles.filter(d => d !== direccio)[Math.floor(Math.random() * 3)];

        setDireccio(novaDireccio);

        setHistorialDireccions(prev => {
          const actualitzat = [...prev, direccio];
          if (actualitzat.length > 2) actualitzat.shift();
          return actualitzat;
        });
      } else {
        setPosicio({ x: newX, y: newY });

        if (!foraDeLimits(newX, newY) && !colisioAmbObstacle(newX, newY)) {
          setHistorialDireccions([]);
        }
      }
    }, velocitat);
    return () => clearInterval(interval);
  }, [posicio, direccio, historialDireccions]);

  useEffect(() => {
    generarPosicioAleatoria();
    generarColorsAleatoris();
  }, []);
  /*
  const GenerPosic = () => {
    switch (direccio) {
        case 'dreta': newX += 10; break;
        case 'esquerra': newX -= 10; break;
        case 'amunt': newY -= 10; break;
        case 'avall': newY += 10; break;
      }
    }
       
  const generarNumeroAleatori = () => {
    const numeroGenerat = Math.floor(Math.random() * (200 - 10 + 1)) + 10;
    setNumero(numeroGenerat);
  }; */
 useEffect(() => {  
      let num = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
      if (direccio === 'dreta' || direccio === 'esquerra') {
         if (posicio.y > 250) { setDireccio('amunt')} 
         else {setDireccio('avall')}
      }  else {
         if (posicio.x > 200) { setDireccio('esquerra')} 
         else {setDireccio('dreta')}
      }
      const interval = setInterval(() => {
      setActiu(prevActiu => !prevActiu);
      }, num);
      return () => clearInterval(interval);
  }, [actiu])
   // **************** final de gestio guineu *****************
  // *****************  inici gestió caçador ----------------

  const [hunterPos, setHunterPos] = useState(
    { x: Math.floor(Math.random() * largada), 
      y: Math.floor(Math.random() * alçada) });

 

  const moveHunter = (e) => {
    setHunterPos((prevPosition) => {
      let newHX = prevPosition.x;
      let newHY = prevPosition.y;

      switch (e.key) {
        case 'ArrowUp':
          newHY = Math.max(0, prevPosition.y - veloH);
          break;
        case 'ArrowDown':
          newHY = Math.min(window.innerHeight - ampladaAvatar, prevPosition.y + veloH);
          break;
        case 'ArrowLeft':
          newHX = Math.max(0, prevPosition.x - veloH);
          break;
        case 'ArrowRight':
          newHX = Math.min(window.innerWidth - ampladaAvatar, prevPosition.x + veloH);
          break;
        default:
          break;
      }

      // Comprovar si el caçador xoca amb algun obstacle
      if (foraDeLimits(newHX, newHY) 
            || colisioAmbObstacle(newHX, newHY)) {
        return prevPosition;  // No es mou si hi ha col·lisió amb un mur
      }

      return { x: newHX, y: newHY };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      moveHunter(e);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // **************** final gestió caçador *****************
 // comprovar collisió entre caçador i guineu 
  useEffect(() => { 
     let hpx1 = hunterPos.x - ampladaAvatar;
     let hpx2 = hunterPos.x + ampladaAvatar;  
     let hpy1 = hunterPos.y - alçadaAvatar;
     let hpy2 = hunterPos.y + alçadaAvatar;  
     if (posicio.x >= hpx1 && posicio.x <= hpx2) {      
       if(posicio.y >= hpy1 && posicio.y <= hpy2) {
           setVelo(0);
           setVeloH(0);
           setMissatge('Guineu caçada !!!!');
        }
      }
  }, [posicio.x,posicio.y,hunterPos.x,hunterPos.y]);
  const increaseSpeed = () => {
    setVelo(velo+1);
  };
  const decreaseSpeed = () => {
  setVelo(velo-1);
  };
   const Sacabat       = () => 
    {
     navigate('/Jocs0');
    }; 
  const inicia      = () => 
    {
        setVelo(5);
        setVeloH(5);
        setMissatge('');         
        setHunterPos({ x: 10, y: 10 });
        generarColorsAleatoris();
        generarPosicioAleatoria();

    }; 
    Benrera(Sacabat);
  return (
    <div>
      <h2 className="capsalera">Fox Hunt</h2>
     {missatge && <div style={{ 
            marginTop: 20,          
            fontSize: 24,
            fontWeight: "bold",
            color: "red", 
            textAlign: "center"
            }}>{missatge}</div>}
      {/*<div>Caçador  - {hunterPos.x} / {hunterPos.y} 
             ------ Guineu - {posicio.x} / {posicio.y}</div> */}
     <div className="d-flex justify-content-center mt-4 gap-3"> 
              <button onClick={increaseSpeed}> + vel.</button>
              <button onClick={decreaseSpeed}> - vel.</button>
              
              <Button className="custom-button small-buttonP2 px-4 py-2" 
                    variant="danger" onClick={inicia}>
                  <i className="fas fa-flag-checkered"></i> Reiniciar
              </Button>
              <Button className="custom-button small-buttonP2 px-4 py-2" 
                    variant="danger" onClick={Sacabat}>
                  <i className="fas fa-flag-checkered"></i> Fi prog.
              </Button>
          </div>
          <br></br>
      <div className="pantalla">
        <div
          style={{
            width: `${largada}px`,
            height: `${alçada}px`,
            position: 'relative',
            borderTop: `10px solid ${colorsRecuadre.top}`,
            borderRight: `10px solid ${colorsRecuadre.right}`,
            borderBottom: `10px solid ${colorsRecuadre.bottom}`,
            borderLeft: `10px solid ${colorsRecuadre.left}`,
            backgroundColor: 'lightgrey',
            boxSizing: 'border-box',
            backgroundColor: 'lightgrey',
             
            backgroundImage: `url(${imatge03})`,
            backgroundSize: 'cover',  
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat', 
  
          }}
        >
          {/* 🧱 Obstacles */}
          {obstacles.map((obs, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${obs.x}px`,
                top: `${obs.y}px`,
                width: `${obs.width}px`,
                height: `${obs.height}px`,
                backgroundColor: 'brown',
                border: '2px solid black',
                zIndex: 1,
              }}
            />
          ))}

          {/* 🦸 Superheroi */}
          <div
            className="superheroi"
            style={{
              position: 'absolute',
              left: `${posicio.x}px`,
              top: `${posicio.y}px`,
              width: `${ampladaAvatar}px`,
              height: `${alçadaAvatar}px`,
              transition: 'left 0.1s, top 0.1s',
              zIndex: 2,
            }}
          >
            <img src={imatge02} alt="Superheroi" width="100%" height="100%" />
          </div>

          {/* 🏹 Caçador */}
          <div
            className="hunter"
            style={{
              position: 'absolute',
              left: `${hunterPos.x}px`,
              top: `${hunterPos.y}px`,
              width: `${ampladaAvatar}px`,
              height: `${alçadaAvatar}px`,
              zIndex: 2,
            }}
          >
            <img src={imatge01} alt="Caçador" width="100%" height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TJHero01;
