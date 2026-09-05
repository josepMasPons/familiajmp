import { useRef, useState, useEffect } from "react";
import { generateBoard } from "./BoardData";
import Daus from '../1Motors/DausMotor';
import Ruleta from '../1Motors/RuletaMotor';
import fondo from './Imatges/f12.jpg';
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "./Avis.css";
import f01 from './Imatges/avis.jpg';
import f02 from './Imatges/gemma.jpg';
import f03 from './Imatges/esther.jpg';
import f04 from './Imatges/julia.jpg';
import f05 from './Imatges/jordiimarc.jpg';

//const TOTAL = 63;
const TOTAL = 50;
export default function Board() {
  const navigate = useNavigate();
  const canvasRef = useRef();
  const [vmis, setVmis] = useState(false);
    
  const imgRef = useRef(new Image());
  const drawBoardStaticRef = useRef();
  //const [board, setBoard] = useState(() => generateBoard());
  const boardRef = useRef(generateBoard());
  const [go1, setGo1] = useState("Of");
  const [go2, setGo2] = useState("Of");
  const nota = useRef();
  const [resultat1, setResultat1] = useState("");
  const [resultat2, setResultat2] = useState("");
  const [ordre, setOrdre] = useState("0");
  const [posFitxa, setPosFitxa] = useState({ x: -50, y: -50 });
  const fitxaRef = useRef();
  const positionsRef = useRef([]);
  const positionsGuardades = useRef(false);
  const posicioActualRef = useRef(0);
  const [missatge, setMissatge] = useState("");
  const AFER1 = ['Avança','Torna a tirar','Enrera','Un cop sense tirar',
                 'Dobla','triple'        ,'Avança','No fas res'];
  const AFER2 = ['0'     ,'0'            ,'-1'    ,'0'                 ,
                 '2'     ,'3'            ,'-2'    ,'0'];
                 
  const AFER3 = ['+'     ,'*'            ,'*'     ,'*'                 ,
                 '*'     ,'*'            ,'0'     ,'*'];
  const AFER4 = ['Avança','Torna a tirar','Enrera','Un cop sense tirar',
                 'Dobla','triple'        ,'Avança','No fas res'];
  const AFER5 = ['C'     ,'R'            ,'C'     ,'R'                 ,
                 '2'     ,'3'            ,'C'     ,'R'];
  const [nomc, setNomc] = useState(localStorage.getItem('NomJ') || 'convidat');
  const bossImg1 = useRef(new Image());
  const bossImg2 = useRef(new Image());
  const bossImg3 = useRef(new Image());
  const bossImg4 = useRef(new Image());
  const bossImg5 = useRef(new Image());
  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  useEffect(() => {
    imgRef.current.src = fondo;
  }, []);
   useEffect(() => {
     bossImg1.current.src = f01;
     bossImg2.current.src = f02;
     bossImg3.current.src = f03;
     bossImg4.current.src = f04;
     bossImg5.current.src = f05;
}, []);
  useEffect(() => {
    if (resultat1 !== '' && resultat2 !== '' && positionsRef.current.length > 0) {
      const dau = parseInt(resultat1, 10);
      if (isNaN(dau)) return;
      const index = AFER1.findIndex(item => item === resultat2);
      if (index === -1) return;     
      const valor = parseInt(AFER2[index], 10);
      const operador = AFER3[index];
      let moviment = operador === '+' ? dau + valor : dau * valor;
      let notax = `${AFER4[index]} ${moviment} caselles`;
     
      setVmis(true);
      /*
      if(AFER5[index] === 'R') {
        setMissatge(AFER4[index]);
      } else {
        setMissatge(nota);
      }  */
      if(AFER5[index] === 'R') {
        nota.current=AFER4[index];
      } else {
        nota.current=notax;
      }  
      moureFitxa(moviment);
    }      
  }, [resultat2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const pos = positionsRef.current[posicioActualRef.current];
      if (pos) setPosFitxa({ x: pos.x, y: pos.y });
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const img = new Image();
    img.src = fondo;
    img.onload = () => startAnimation(ctx, img);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  function moureFitxa(moviment) {
    let desti = posicioActualRef.current + moviment;
    if (desti >= TOTAL) desti = TOTAL - 1;
    if (desti < 0) desti = 0;

    const direccio = desti > posicioActualRef.current ? 1 : -1;

    const interval = setInterval(() => {
      /*
      if (posicioActualRef.current === desti) {
        clearInterval(interval);
        return;
      }
      */
      if (posicioActualRef.current === desti) {
        clearInterval(interval);
        const cell = boardRef.current[desti];
      
      if (["neus","gemma","esther","julia","jordi"].includes(cell.type)) {
        setMissatge(`Casella ${cell.id + 1} (${cell.type}) i  (${nota.current}) `);
        //console.log('nota - ',nota )
        setVmis(true);
      } else {
        setMissatge(`Casella ${cell.id + 1} / (${nota.current}) `);
      }  
     return;
    }

      posicioActualRef.current += direccio;
      const pos = positionsRef.current[posicioActualRef.current];
      if (pos && canvasRef.current) setPosFitxa({ x: pos.x, y: pos.y });
    }, 250);
  }

  function startAnimation(ctx, img) {
    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * ctx.canvas.width,
        y: Math.random() * ctx.canvas.height,
        size: 2 + Math.random() * 3,
        speed: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2
      });
    }

    let glowTime = 0;

    function animate() {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;

      drawBoardStatic(ctx);

      particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const fitxaPos = positionsRef.current[posicioActualRef.current];
      if (fitxaPos) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(fitxaPos.x, fitxaPos.y, 12, 0, Math.PI*2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

 function drawBoardStatic(ctx) {
  if (!ctx) return;

  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

  // Carrega imatges de "familia"
  let imgToDraw = null;
  let loadedCount = 0;
  let bossLoaded = true;
 /*
  function checkLoaded() {
    loadedCount++;
    if (loadedCount === 5) bossLoaded = true;
  }

  bossImg1.onload = checkLoaded;
  bossImg2.onload = checkLoaded;
  bossImg3.onload = checkLoaded;
  bossImg4.onload = checkLoaded; 
  bossImg5.onload = checkLoaded;
  bossImg1.src = f01;
  bossImg2.src = f02;
  bossImg3.src = f03;
  bossImg4.src = f04;
  bossImg5.src = f05;
 */
  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height);
  const offsetX = (width - size) / 2;
  const offsetY = (height - size) / 2;

  //const centerX = offsetX + size / 2;
  //const centerY = offsetY + size / 2;

  //const cellSize = Math.min(width, height) / 16;
  const base = Math.min(width, height);
  const cellSize = base * 0.06;  // 6% de la mida mínima
  
  const gap = 12;
  const step = cellSize + gap;

 // const centerRadius = Math.min(width, height) / 5;
  const centerRadius = base * 0.18;

  //const startRadius = Math.min(width, height) / 2.3;
  const startRadius = base * 0.45;

  const minRadius = centerRadius + cellSize;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(imgRef.current, 0, 0, width, height);

  // Calcula posicions caselles
  if(!positionsRef.current.length) {
    const positions = [];
    let radius = startRadius;
    let angle = 1.25 * Math.PI;
    for (let i = 0; i < TOTAL; i++) {
      if (radius < minRadius) radius = minRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      positions.push({ x, y });
      const deltaAngle = step / radius;
      angle -= deltaAngle;
      radius -= (startRadius - minRadius) / TOTAL;
    }
  positionsRef.current = positions;
  }
  const positions = positionsRef.current;
  // Dibuixa el camí
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  positions.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // Dibuixa caselles
  positions.forEach((p, i) => {
    //const cell = board[i];
    const cell = boardRef.current[i];
    let size = cellSize;
    let radius = 14;
    if (i === posicioActualRef.current) {
      size = cellSize * 1.4;
      radius = 20;
      ctx.shadowColor = "gold";
      ctx.shadowBlur = 25;
    }

    switch(cell.type) {
      case "gemma":
        if (bossLoaded) {
          ctx.save();
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.clip();
          ctx.drawImage(bossImg2.current, p.x - size/2, p.y - size/2, size, size);
          ctx.restore();
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 5;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#000";
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.fill();
        }
        break;
      case "esther":
        if (bossLoaded) {
          ctx.save();
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.clip();
          ctx.drawImage(bossImg3.current, p.x - size/2, p.y - size/2, size, size);
          ctx.restore();
          ctx.strokeStyle = "green";
          ctx.lineWidth = 5;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#000";
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.fill();
        }
        break;
      case "julia":
        if (bossLoaded) {
          ctx.save();
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.clip();
          ctx.drawImage(bossImg4.current, p.x - size/2, p.y - size/2, size, size);
          ctx.restore();
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = 5;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#000";
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.fill();
        }
        break;
      case "jordi":
        if (bossLoaded) {
          ctx.save();
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.clip();
          ctx.drawImage(bossImg5.current, p.x - size/2, p.y - size/2, size, size);
          ctx.restore();
          ctx.strokeStyle = "brown";
          ctx.lineWidth = 5;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#000";
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.fill();
        }
        break;
      case "neus":
        if (bossLoaded) {
          ctx.save();
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.clip();
          ctx.drawImage(bossImg1.current, p.x - size/2, p.y - size/2, size, size);
          ctx.restore();
          ctx.strokeStyle = "red";
          ctx.lineWidth = 6;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#000";
          drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
          ctx.fill();
        }
        break;
      default:
        ctx.fillStyle = "#d8d3da";
        drawRoundedRect(ctx, p.x - size/2, p.y - size/2, size, size, radius);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
        break;
    }

    ctx.fillStyle = "black";
    ctx.font = `${Math.floor(size/3)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cell.id + 1, p.x, p.y);
    // -------- CENTRE RULETA + DAU --------
const gradient = ctx.createRadialGradient(
  centerX, centerY, 0,
  centerX, centerY, centerRadius
);

gradient.addColorStop(0, "#575754");
gradient.addColorStop(0.4, "#004cff");
gradient.addColorStop(0.7, "#00eaff");
gradient.addColorStop(1, "#ff5500");

ctx.fillStyle = gradient;
ctx.beginPath();
ctx.arc(centerX, centerY, centerRadius, 0, Math.PI*2);
ctx.fill();

ctx.strokeStyle = "gold";
ctx.lineWidth = 5;
ctx.stroke();
  });
}

  const go12 = () => {    
    setVmis(false);
    setResultat1('');
    setResultat2('');
    //setGo1('On');
    //setGo2('On');
    setGo1('Of');
    setGo2('Of');

    setTimeout(() => {
       setGo1('On');
       setGo2('On');
    }, 50);
    setOrdre('1');
    positionsGuardades.current = false;
  }
  /*
  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (imgRef.current.complete) {
    drawBoardStatic(ctx);
  }
  }, [board]);
  */
  const reinicia = () => {    
   // const nouBoard = generateBoard();
    //setBoard(nouBoard);
    boardRef.current = generateBoard();
    posicioActualRef.current = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const positions = [];
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const cellSize = Math.min(width, height) / 16;
    const gap = 12;
    const step = cellSize + gap;
    const centerRadius = Math.min(width, height) / 5;
    const startRadius = Math.min(width, height) / 2.3;
    const minRadius = centerRadius + cellSize;

    let radius = startRadius;
    let angle = 1.25 * Math.PI;

    for (let i = 0; i < TOTAL; i++) {
      if (radius < minRadius) radius = minRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      positions.push({ x, y });
      const deltaAngle = step / radius;
      angle -= deltaAngle;
      radius -= (startRadius - minRadius) / TOTAL;
    }

    positionsRef.current = positions;
    const pos = positionsRef.current[0];
    if (pos) setPosFitxa({ x: pos.x, y: pos.y });

    //if (imgRef.current.complete) drawBoardStatic(ctx);
  };

  const Sacabat = () => navigate('/Jocs0');

  return (
     <div className="casino-bg">
      <div 
        ref={fitxaRef} 
        className="fitxa"
        style={{
          left: posFitxa.x - 15,
          top: posFitxa.y - 15,
          display: 'none'  
        }}
      />
      <canvas ref={canvasRef} className="casino-canvas" />
    <div className="casino-ui">
     <div className="casino-header">
      <h2 className="casino-title">
         Benvingut al Joc <span className="casino-player">{nomc}</span>
      </h2>
        <div className="casino-message">{missatge}</div>
     </div>
     <div className="casino-centre">
         <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "15%"
            }}></div>
     <Daus
                images={[]} 
                param='S'
                go={go1}
                delay='1'
                onGuanyador={(i) => setResultat1(i)}
                mides='40'
      />
      <Ruleta   images={AFER1}
                param='S'
                go={go2}
                delay='2'
                onGuanyador={(s) => {             
                  setTimeout(() => {
                    setResultat2(AFER1[s]);
                    //setOrdre('0');
                  }, 3000);
                }}
                mides='140'
      />
     </div>
     <div className="gap-3 mb-2">
          <Button className="casino-btn" variant="primary" size='sm' onClick={go12}>
            Inici Jugada   
          </Button> 
          <Button className="casino-btn" variant="primary" size='sm' onClick={reinicia}>
            Reinicia tauler   
          </Button> 
          <Button className="casino-btn" variant="warning" size='sm' onClick={Sacabat}>
            Sortir Joc   
          </Button> 
     </div>
    </div> 
      </div>
    
  )
}