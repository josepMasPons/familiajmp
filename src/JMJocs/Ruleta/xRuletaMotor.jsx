import { useRef, useEffect ,useState} from "react";
import { Button } from "react-bootstrap";
import "./RuletaMotor.css";

const SIZE = 320;
const R = SIZE / 2;
 
function esImatge(valor,param) {
  /*
  if (typeof valor === 'string') return true;
  if (typeof valor === 'object' && valor?.default) return true;
  */
  if (param === 'I') {
    return true
  } else {
    return false; 
  }
  
 
}

export default function RuletaMotor({ images, param, go, delay, onGuanyador }) {
  const [Go, setGo] = useState(go);
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const animRef = useRef(null);
  const loopRef = useRef(null);

  const NUMEROS = images.length;
  const anglePerSector = (2 * Math.PI) / NUMEROS;
useEffect(() => {
  //console.log('Go........',Go)
  if (go === 'On') {
    setGo(go);
    go='Of'
    let temps=100;
    if (delay=== '1') {temps = 1000
    } else            {temps = 2500}
    setTimeout(() => {
       girar();      
    }, temps); 
   
  }
}, [go, Go]);

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Preparar imatges/textos
  const imgs = images.map(src => {
    if (esImatge(src,param)) {
    //if (typeof src === "object" && src.default) {
      const img = new Image();
      img.src = src; // ← molt important
      img.loaded = false;
      img.isImage = true;
      img.onload = () => {
        img.loaded = true;
        draw();
      };
      return img;
    } else if (typeof src === "string" && src.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
      const img = new Image();
      img.src = src;
      img.loaded = false;
      img.isImage = true;
      img.onload = () => {
        img.loaded = true;
        draw();
      };
      return img;
    } else {
      return { text: src, isImage: false }; // text normal
    }
  });

  let win = undefined;

  const draw = () => {
    ctx.clearRect(0, 0, SIZE, SIZE);

    for (let i = 0; i < NUMEROS; i++) {
      const start = angleRef.current + i * anglePerSector;
      ctx.beginPath();
      ctx.moveTo(R, R);
      ctx.arc(R, R, R - 5, start, start + anglePerSector);
      ctx.fillStyle = `hsl(${(i * 360) / NUMEROS},70%,60%)`;
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(R, R);
      ctx.rotate(start + anglePerSector / 2);
      const item = imgs[i];

      if (item.isImage && item.loaded) {
        ctx.drawImage(item, R - 62, -21, 42, 42); // imatge petita
      } else if (!item.isImage) {
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(item.text, R - 20, 0); // text petit
      }
      ctx.restore();
    }

    // fletxa
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(R - 10, 5);
    ctx.lineTo(R + 10, 5);
    ctx.lineTo(R, 25);
    ctx.closePath();
    ctx.fill();

    // calcular guanyador
    let angle = angleRef.current + Math.PI / 2;
    angle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    win = Math.floor((2 * Math.PI - angle) / anglePerSector) % NUMEROS;

    // guanyador gran
    if (speedRef.current === 0 && typeof win !== "undefined") {
      const item = imgs[win];
      const size = 64;
      ctx.save();
      ctx.translate(R, R);

      if (item.isImage && item.loaded) {
        ctx.drawImage(item, -size / 2, -size / 2, size, size);
      } else if (!item.isImage) {
        ctx.fillStyle = "#000";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.text, 0, 0);
      }
      ctx.restore();
    }
  };

  loopRef.current = () => {
    angleRef.current += speedRef.current;
    speedRef.current *= 0.985;
    draw();

    if (speedRef.current > 0.001) {
      animRef.current = requestAnimationFrame(loopRef.current);
    } else if (speedRef.current !== 0) {
      speedRef.current = 0;
      draw();
      onGuanyador(win);
    }
  };

  draw();
  return () => cancelAnimationFrame(animRef.current);
}, [images]);

  const girar = () => {
    if (speedRef.current !== 0) return;
    speedRef.current = Math.random() * 0.4 + 0.35;
    animRef.current = requestAnimationFrame(loopRef.current);
  };

  return (  
    
    <div style={{ textAlign: "center" }}>    
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ border: "3px solid #333", borderRadius: "50%" }}
      />
      {/*<br />
      <Button size="sm" className="mt-2" onClick={girar}>
        Girar
      </Button> */}
    </div>
  );
}
