// -------  Versió   per base de dades SANTVIFLIX -----------------
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './Pantalla05.css';
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Container, Row, Col, Card, Button } from "react-bootstrap"; 
import { storageCar } from '../firebaseLoc';
import { ref as refCar, listAll, getDownloadURL } from 'firebase/storage';
import videoF from '../fotos/veureVideo.jpg';
import Benrera from '../JMGlobal/Benrera';

function Pantalla05() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [elements, setElements] = useState([]);
  const [index, setIndex] = useState(0);
  const [urlw, setUrlw] = useState('');
  const [showPantalla01, setShowPantalla01] = useState(1);
  const playerRef = useRef(null);

  // Variables del localStorage
  const c01 = localStorage.getItem('Proces010');
  const c02 = localStorage.getItem('Proces011');
  const c03 = localStorage.getItem('Proces012');  
  const c99 = localStorage.getItem('Proces025');

  // Llegir fitxers de Firebase Storage
useEffect(() => {
  const fetchElements = async () => {
    try {
      const storageRef = refCar(storageCar, `Familiar/${c01} ${c02}/${c99}`);
      const resultat = await listAll(storageRef);

      const videoItems = resultat.items.filter((itemRef) => {
        const ext = itemRef.name.split('.').pop().toLowerCase();
        return ['mp4', 'mpg'].includes(ext);
      });

      const elements = await Promise.all(
        videoItems.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url, type: itemRef.name.split('.').pop().toLowerCase() };
          } catch (err) {
            console.warn('No es pot obtenir URL per:', itemRef.name);
            return null;
          }
        })
      );

      setElements(elements.filter(Boolean));
    } catch (error) {
      console.error('Error carregant fitxers:', error);
    }
  };

  fetchElements();
}, [c01, c02, c99]);

// Quan seleccionem un vídeo, afegim un log per comprovar la URL.
 const handleSelect = (selectedIndex) => {
  setIndex(selectedIndex);
  const selectedUrl = elements[selectedIndex].url;
  console.log('URL del vídeo seleccionat:', selectedUrl);
  setUrlw(selectedUrl);
  setShowPantalla01(2);
};
  const handleSelectx = (selectedIndex) => {
    setIndex(selectedIndex);
    setUrlw(elements[selectedIndex].url);
    setShowPantalla01(2);
  };

  // Tornar enrere
  function Sacabat() {
    localStorage.setItem('Programa', '/Pantalla03');
    navigate('/Pantalla03');
  }
  Benrera(Sacabat);
  return (
    <>
      <div className="P5center-contentP5">
        <Container className='mt-5'>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card>
                <Card.Header className="text-center fs-5 fw-bold">
                  {c01} - {c03}
                  <div className="d-flex justify-content-center mt-1">
                    <Button
                      className="mb-2"
                      variant="warning"
                      size='sm'
                      onClick={Sacabat}
                    >
                         Enrere
                    </Button>
                  </div>
                </Card.Header>
              </Card>
            </Col>
          </Row>

          {/* Pantalla de selecció de vídeos */}
          {showPantalla01 === 1 && (
            <div className="P5M4thumbnail-containerP4">
              {elements.map((element, idx) => {
                return (
                  <div key={idx} className="P5M4thumbnail-itemP4" 
                        onClick={() => handleSelect(idx)}>
                    <LazyLoadImage
                      src={videoF}
                      onError={(e) => (e.target.src = "/icons/video-placeholder.jpg")} // Si no hi ha miniatura, mostra imatge genèrica
                      className="P5M4thumbnail-imageP4"
                      alt={`Vídeo ${idx}`}
                      effect="blur"
                    />
                    <div className="P5M4thumbnail-titleP4">{element.name}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pantalla del reproductor de vídeo */}
          {showPantalla01 === 2 && (
            <div className="P5Vvideo-containerP5 text-center mt-4">
              <ReactPlayer
                ref={playerRef}
                url={urlw}
                playing={playing}
                controls={true}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                className="P5Vreact-playerP5"
                width="80%"
                height="80%"
              />
            
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default Pantalla05;
