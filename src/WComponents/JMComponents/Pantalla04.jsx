import React, { useState, useEffect } from 'react';
import { ref as refCar, listAll, getDownloadURL } from 'firebase/storage';
import { Button, Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { storageCar } from '../../firebaseLoc';
import fotoPdf from './logopdf.png';
import { useNavigate } from "react-router-dom";
import "./Pantalla04.css";

function GridView({ elements, onSelect, onSelectPdf }) {
  return (
    <div className="M4thumbnail-containerP4">
      {elements.map((el, idx) => (
        <div key={idx} className="M4thumbnail-wrapperP4">
          <LazyLoadImage
            src={el.type === 'pdf' ? fotoPdf : el.url}
            className={`M4thumbnail-imageP4 ${el.orientation}`}
            onClick={() =>
              el.type === 'pdf' ? onSelectPdf(idx) : onSelect(idx)
            }
            alt={`Miniatura ${idx}`}
            effect="blur"
          />
           {el.type === 'pdf' && (
             <div className="pdf-nameP4">
                 {el.name}
             </div>
             )}
        </div>
      ))}
    </div>
 
  );
}
function CarouselView({ elements, index, setIndex, onToggleFull, temps }) {

  const goPrev = () => {
    setIndex((prev) => (prev === 0 ? elements.length - 1 : prev - 1));
  };

  const goNext = () => {
    setIndex((prev) => (prev === elements.length - 1 ? 0 : prev + 1));
  };
  return (
    <div className="carousel-container">

      <div className="carousel-arrow prev" onClick={goPrev}>‹</div>

      <img
        src={elements[index].url}
        alt=""
        className="carousel-image"
        onClick={onToggleFull}
      />
      <div className="carousel-arrow next" onClick={goNext}>›</div>
    </div>
  );
}
function FullScreenView({ element, onExit }) {
  return (
    <div className="pantalla-completa-container">
      <img
        src={element.type === 'pdf' ? fotoPdf : element.url}
        className={`imatge-a-pantalla-completaP4 ${element.orientation}`}
        onClick={onExit}
        alt="pantalla completa"
      />
    </div>
  );
}
function Pantalla04() {
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [index, setIndex] = useState(0);
  const [view, setView] = useState('grid');
  const [temps] = useState(10000);
  const [progresPercent, setProgresPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false); 

  const c01 = localStorage.getItem('Proces010');
  const c02 = localStorage.getItem('Proces011');
  const c03 = localStorage.getItem('Proces012');
  const c99 = localStorage.getItem('Proces025');
// ----- fer que el butó < en mòbil faci el mateix que  enrere ----
 useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      //navigate(0);
    };
    window.history.pushState({ preventExit: true }, '');
    window.addEventListener('popstate', handler);

    const keyDownHandler = (event) => {
       if(event.key === 'Backspace') {
        event.preventDefault();
        handleBack();
       }
    };
     window.addEventListener('keydown',keyDownHandler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [view]);
  // Carrega les imatges i detecta orientació
  useEffect(() => {
  const fetchElements = async () => {
    try {
      const storageRef = refCar(storageCar, `Familiar/${c01} ${c02}/${c99}`);
      const resultat = await listAll(storageRef);

      const validItems = resultat.items.filter((itemRef) => {
        const ext = itemRef.name.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(ext);
      });

      const total = validItems.length;
      let completed = 0;

      const files = await Promise.all(
        validItems.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            const ext = itemRef.name.split('.').pop().toLowerCase();

            let orientation = 'horizontal';
            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
              const img = new Image();
              img.src = url;
              await new Promise((resolve) => {
                img.onload = () => {
                  orientation =
                    img.naturalHeight > img.naturalWidth
                      ? 'vertical'
                      : 'horizontal';
                  resolve();
                };
                img.onerror = resolve;
              });
            }

            // 🔹 Actualitza el progrés cada cop que un arxiu s’ha acabat de carregar
            completed++;
            setProgresPercent(Math.round((completed / total) * 100));

            return { name: itemRef.name, url, type: ext, orientation };
          } catch {
            completed++;
            setProgresPercent(Math.round((completed / total) * 100));
            return null;
          }
        })
      );

      setElements(files.filter(Boolean));
    } catch (error) {
      console.error('Error carregant fitxers:', error);
    }
  };
  fetchElements();
}, [c01, c02, c99]);

// fer que backspace no interfereixi en els formularis ------------
const keyDownHandler = (event) => {
  if(event.key === 'Backspace' && !event.target.closest('input, textarea')) {
     event.preventDefault();
     handleBack();
  }
}
const handleBack = () => {
    // console.log('handleBack - '+ view);
    if (view === 'carousel')   {
       // console.log('Pasat a grid ---')
       setView('grid');    
    } else {
       if (view === 'full')   {
          // console.log('Pasat a carrousel ---')
          setView('carousel');    
       } else {
          localStorage.setItem('Programa', '/Pantalla03');
          navigate('/Pantalla03');
       }
    };
  };
  return (
    <div>
      <div className="M4TextP4x">
        <div> {c01} / {c03} </div>
         <div style={{ fontSize: "0.85rem", fontWeight: "normal" }}>
              Carpeta - {c99}
         </div>
        
        <div className="d-flex justify-content-center mt-1">
          <Button
            className="mb-2"
            variant="warning"
            size='sm'
            onClick={handleBack}
          >
            Enrere
          </Button>
         </div>
      </div>

      <div className="M4P4x">
        {view === 'grid' && (
          <GridView
            elements={elements}
            onSelect={(i) => {
              setIndex(i);
             // console.log('Pasat a carrousel ---')
              setView('carousel');
            }}
            onSelectPdf={(i) => {
              setIndex(i);
             // console.log('va a pantalla06  - ',i)
             // Guardar URL del PDF
              localStorage.setItem('PdfUrl', elements[i].url);
              localStorage.setItem('PdfName', elements[i].name);
              localStorage.setItem('Programa', '/Pantalla06');
              navigate('/Pantalla06');
            }}
          />
        )}
      </div>
        {view === 'full' && (
          <FullScreenView
            element={elements[index]}
            onExit={() => {
               setView('carousel')
             //  console.log('Pasat a carrousel ---')
              }}
          />
        )}
        <div className="M4P4y">
          {view === 'carousel' && (
             <CarouselView
                elements={elements}
                 index={index}
                 setIndex={setIndex}
                 onToggleFull={() => {
                  // console.log('Pasat a Full ---')
                   setView('full')}
                 }
                 temps={temps}
              />
          )}
        </div>
        {elements.length === 0 && (
          <div style={{ marginTop: '1rem' }}>
            <label>Carregant arxius...(Esperi).. {progresPercent}%</label>
               <progress value={progresPercent}
                max="100" style={{ width: '100%' }} />
          </div>
        )} 
      </div>
   
  );
}

export default Pantalla04;
