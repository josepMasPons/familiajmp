import { Form, Button, Container, Row, Col, Card} from "react-bootstrap";
import { ref as refCar, listAll, getDownloadURL, uploadBytesResumable } from 'firebase/storage'; 
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { LazyLoadImage } from 'react-lazy-load-image-component';
/*import { doc, updateDoc, 
          getDoc, setDoc,
          getDocs, collection, 
          query, orderBy, 
          limit  } from 'firebase/firestore'; */
import { storageCar, db } from '../../firebaseLoc.js';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import "./Puzzle01.css";
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Puzzle01() {
  const navigate=useNavigate();
  const [file, setFile] = useState(null);

  const [ensenyar, setEnsenyar] = useState('0');
  const [rati, setRati] = useState(1);
  const [imatgeI, setImatgeI] = useState('1');
  const [imatgeR, setImatgeR] = useState('Familiar');
  const [jugar, setJugar] = useState(false);
  const [pregunta, setPregunta] = useState(false);
  const [size, setSize] = useState(5);
  const total = (size * size);
  const [hovered, setHovered] = useState(null);
  const [imageUrls, setImageUrls] = useState({});   
  const [imsel, setImsel] = useState('');  
  const [canviIm, setCanviIm] = useState(true);  
  const [pieces, setPieces] = 
            useState(Array.from({ length: total }, (_, i) => i));   
  const [order, setOrder] =
            useState(shuffle(Array.from({ length: total }, (_, i) => i)));
  const [selected, setSelected] = useState(null);
 
  // 🔹 CONTADOR I PUNTS
    const [temps, setTemps] = useState(0);
    const [maxpunts, setMaxpunts] = useState(0);
    const [punts, setPunts] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
  const nivells = [
    { label: "Fàcil", value: 3 },
    { label: "Mitjà", value: 4 },
    { label: "Difícil", value: 5 },
    { label: "Expert", value: 6 },
    { label: "Super", value: 7 },
  ];
  const nivellsI = [
    { label: "Família", value: '1' },
    { label: "Animals", value: '2' },
    { label: "Natura", value:  '3'},
    { label: "Propia", value:  '4'},
  ];
  //  buscant les url de les imatges a firebase ....
 
  const uploadImage = async () => {
     setPregunta(false);
     if (!file || !(file instanceof Blob)) {
        console.error('Cap imatge seleccionada');
     return;
     }
     const url = URL.createObjectURL(file);
     setImsel(url);
};
  const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  setFile(selectedFile);  
};
// 🔹 CONTROL TEMPS
  useEffect(() => {
    if (jugar) {
      const id = setInterval(() => {
        setTemps(t => t + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [jugar]);

  useEffect(() => {
    const img = new Image();
    img.src = imsel; 

    img.onload = () => {
      const totalRati = img.width / img.height;
      setRati(totalRati);
      console.log('ample - ',img.width,'Alt - ',img.height,'rati - ',totalRati,)
    };
    const total = size * size;
    setPieces(Array.from({ length: total }, (_, i) => i));  
    setOrder(shuffle(Array.from({ length: total }, (_, i) => i))); 
  
  }, [size,imsel]);
  useEffect(() => {
     //console.log('imatgeI - ', imatgeI, 'type:', typeof imatgeI)
     if (imatgeI === '1') {setImatgeR('Familiar')};
     if (imatgeI === '2') {setImatgeR('Animals')};
     if (imatgeI === '3') {setImatgeR('Natura')};
     if (imatgeI === '4') {
        setImatgeR('Familiar')
        setPregunta(true);
      };
  }, [imatgeI]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        //console.log('imatger -',imatgeR)
        const grupPath = `Puzzle/${imatgeR}`;
        const storageRef = refCar(storageCar, grupPath);
        const resultat = await listAll(storageRef);
        if (resultat.items.length === 0) {
          setImageUrls([]);
          return;
      }

      const urls = await Promise.all(
        resultat.items.map(item => getDownloadURL(item))
      );
      setImageUrls(urls);
      const randomIndex = Math.floor(Math.random() * urls.length);
      const randomImage = urls[randomIndex];

      setImsel(randomImage);

      console.log("Imatges carregades:", urls.length);
    } catch (error) {
      console.error("Error obtenint imatges:", error);
      setImageUrls([]);
    }
  };

  fetchImages();
}, [imatgeR]);
  
 const movePiece = (index) => {
  // si la peça ja està bé, no fer res
  if (order[index] === index) return;

  if (selected === null) {
    setSelected(index);
  } else {
    // no permetre intercanvi amb una peça correcta
    if (order[selected] === selected) {
      setSelected(null);
      return;
    }

    const newOrder = [...order];
    [newOrder[selected], newOrder[index]] = [
      newOrder[index],
      newOrder[selected]
    ];
    setOrder(newOrder);
    setSelected(null);
  }
};
const solved = order.every((v, i) => v === i);
// 🔹 CALCULAR PUNTS
  useEffect(() => {
    if (solved && jugar) {
      clearInterval(intervalId);
      const score = Math.max(0, size * size * 100 - temps);
      setPunts(score);
      //setJugar(false);
    }
  }, [solved]);
  const restart = () => {  
      setTemps(0);
      setPunts(0);   
      const randomIndex = Math.floor(Math.random() * imageUrls.length);
      const randomImage = imageUrls[randomIndex];
      setImsel(randomImage);
      setJugar(false);
      setCanviIm(true);
      setOrder(shuffle(pieces));
  };
  const handleClick = () => {
    setEnsenyar('1'); 
    setTimeout(() => {
      setEnsenyar('0');
    }, 10000); 
 
  };
  const IniJoc = () => {
    setTemps(0);
    setPunts(0);
    setCanviIm(false);
    setJugar(true);
  }; 
  const sacabat = () => { 
    if (jugar === true) {
      restart();
    } 
    else {
    navigate('/Jocs0');  
    }
    
  };     

  return (
    <div className="inici">
      <h1 className='title'>Puzzle</h1>
       <div style={{ textAlign: "center", marginBottom: "10px" }}>
        ⏱️ Temps: <strong>{temps}s</strong> | 🏆 Punts: <strong>{punts}</strong>
      </div>
      {canviIm && (    
      <> 
      <div className="controls-box">
       <span className="label">Imatges:</span>
       <div className="level-buttons">
        {nivellsI.map((nivellI) => (
          <button
            key={nivellI.value}
            onClick={() => setImatgeI(nivellI.value)}
            className={imatgeI === nivellI.value ? "active" : ""}
          >
            {nivellI.label}
          </button>
        ))}
       </div>
      </div>
        {pregunta && (
          <>
        <input
                className="ImP02-buto"
                type="file"
                onChange={handleFileChange}
        />  
        <Button className="mb-2" 
                             variant="primary"
                             size='sm'
                             type='button'                                    
                             onClick={uploadImage}>
                          acceptar pujar foto 
        </Button>
        </>
        )} 
      <br></br>
      <div className="controls-box">
       <span className="label">Nivell:</span>
       <div className="level-buttons">
        {nivells.map((nivell) => (
          <button
            key={nivell.value}
            onClick={() => setSize(nivell.value)}
            className={size === nivell.value ? "active" : ""}
          >
            {nivell.label}
          </button>
        ))}
       </div>
      </div>
      </>
      )}
      <br></br>
      <div className="d-flex gap-3">
        <Button className="mb-2" 
                variant="warning"
                   size='sm'
                onClick={sacabat}>                                      
              Sortir Joc   
        </Button>   
        <Button className="mb-2" 
                variant="primary"
                   size='sm'
                onClick={handleClick}>                                      
             Ensenyar imatge 10 segons   
        </Button>   
        <Button className="mb-2" 
                variant="primary"
                   size='sm'
                onClick={restart}>                                      
             Canviar Imatge   
        </Button>  
        {jugar === false && (
        <Button className="mb-2" 
                variant="primary"
                   size='sm'
                onClick={IniJoc}>                                      
             Inici Joc  
        </Button>  
        )} 
    </div> 
     {solved && (
      <div
        style={{
        textAlign: "center",
        marginTop: "30px",
        animation: "pop 0.6s ease-out",
        }}>
        <div
         style={{
         fontSize: "3rem",
         fontWeight: "900",
         color: "#16a34a",
         textShadow: "0 0 10px rgba(22,163,74,0.8)",
         }}>
          🎉 PUZZLE COMPLETAT! 🎉
        </div>
        <div
         style={{
         fontSize: "2.5rem",
         marginTop: "10px",
         animation: "fireworks 1.5s infinite",
        }}>
         🎆 🎇 ✨ 🎇 🎆      
        </div>
        <style>{`
          @keyframes fireworks {
           0% { transform: scale(1); opacity: 0.6; }
           50% { transform: scale(1.3); opacity: 1; }
           100% { transform: scale(1); opacity: 0.6; }
         }
          @keyframes pop {
           0% { transform: scale(0.5); opacity: 0; }
           100% { transform: scale(1); opacity: 1; }
          }`}
        </style>    
      </div>
    )}
    <div className="container">
      {ensenyar === '1' && (
          <>
          <h2>Imatge Seleccionada</h2>
          <div className="preview">        
          <img src={imsel} alt="preview" />
          </div>
          </>
      )}
    {jugar && (
     <>
     <br></br>
     <div className="puzzle"
           style={{
           gridTemplateColumns: `repeat(${size}, 1fr)`,
           aspectRatio: `${rati}` }}>
      {order.map((pieces, index) => {
       const row = Math.floor(pieces / size);
       const col = pieces % size;
       const isCorrect = pieces === index;
       const isSelected = selected === index;
       return (
        <div
          key={index}
          className="piece"
          onClick={() => movePiece(index)}
          onMouseEnter={() => !isCorrect && setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          style={{
              "--size": size,
              border:  
                  isCorrect?         "none"     :
                  isSelected?        "9px solid red"       :
                  hovered === index? "4px solid #2563eb" : 
                                     "4px solid #ccc",
              boxShadow:
                  isCorrect?         "0 0 12px rgba(22,163,74,0.9)":
                  hovered === index? "0 0 10px rgba(37,99,235,0.7)":
                                     "none",
              pointerEvents: 
                  isCorrect?         "none" :
                                     "auto",
              cursor:
                  isCorrect?         "default" :
                                     "pointer",
              transition:
                                     "all 0.15s ease",
           }}>
          <img
              src={imsel}
              alt=""
              style={{
              transform: `translate(${-col * 100 / size}%,
                                    ${-row * 100 / size}%)`,
              filter: isCorrect ? "brightness(1.15) saturate(1.3)" : "none",
              }}
          />
        </div>      
        );
        })}
      </div>
      </>
      )}; 
    </div>    
   
    </div>
  );
}
