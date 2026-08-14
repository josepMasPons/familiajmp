// -------  Versió   per base de dades SANTVIFLIX -----------------
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ref as refCar, listAll, getDownloadURL } from 'firebase/storage';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { storageCar } from '../../firebaseLoc'; 
import "./Global.css";
import { Navbar, Container, Button, Row, Col, Card } from "react-bootstrap";

function Pantalla06() {
  const navigate=useNavigate();
  const [urlsImatges, setUrlsImatges] = useState([]);
  const [index, setIndex] = useState(0);
  const [pCompleta, setpCompleta] = useState(false);
  const [urlw, setUrlw] = useState('');
  const [temps, setTemps] = useState(1);
  const togglePantallaCompleta = () => {     
    setpCompleta(!pCompleta);
  }
  const pdfUrl = localStorage.getItem('PdfUrl');
  const pdfName = localStorage.getItem('PdfName');
  //console.log('pdf a mostrar - ', pdfName, ' - ', pdfUrl);
  let c00 = localStorage.getItem('Proces000');
  let c01 = localStorage.getItem('Proces010');
  let c02 = localStorage.getItem('Proces011');
  let c03 = localStorage.getItem('Proces012');
  let c04 = localStorage.getItem('Proces013');
  let c05 = localStorage.getItem('Proces014');
  let c06 = localStorage.getItem('Proces015');
  let c07 = localStorage.getItem('Proces016');
  let c08 = localStorage.getItem('Proces017');
  let c09 = localStorage.getItem('Proces018');
  let c10 = localStorage.getItem('Proces019');
  let c11 = localStorage.getItem('Proces020');
  let c12 = localStorage.getItem('Proces021');
  let c13 = localStorage.getItem('Proces022');
  let c14 = localStorage.getItem('Proces114');
  let c15 = localStorage.getItem('Proces115');
  let c16 = localStorage.getItem('Proces116');
  let c17 = localStorage.getItem('Proces117');
  let c18 = localStorage.getItem('Proces118');
  let c19 = localStorage.getItem('Proces119');
  let c20 = localStorage.getItem('Proces120');
  let c21 = localStorage.getItem('Proces023');
  let c99 = localStorage.getItem('Proces025');
// useEffect per anular buto retorn mòbil *********************
   useEffect(() => {
    const anularReturn = (event) => {
      event.preventDefault();
    // 1.- evita que el butó enrera et tregui de l'aplicació
      if (window.history.state && window.history.state.preventExit) {
          navigate(0);
      }
    }
    // 2.- afageix un estat al historial per no surtir directament
    window.history.pushState({preventExit: true},'');
    // 3.- Gestiona events del butó enrera
    window.addEventListener('popstate',anularReturn);
    // 4.- Neteja 
    return () => {
        window.removeEventListener('popstate',anularReturn);
        window.history.replaceState(null,'');
    }
   }, [navigate]);
 // useEffect per anular buto retorn mòbil *********************

  useEffect(() => {       
    const fetchImages = async () => {
      try {
        const storageRef = refCar(storageCar, 
                        `Familiar/${c01} ${c02}/${c99}`);
    
        //console.log('directori on buscar el pdf  - '+ storageRef);
        const resultat = await listAll(storageRef);
        const pdfUrls = [];
        resultat.items.forEach((itemRef) => {
          if (itemRef.name.endsWith('.pdf')) {
            //console.log('trobat pdf --- '+ itemRef.name);
            getDownloadURL(itemRef).then((url) => {  
          
              pdfUrls.push(url);
              setUrlsImatges(pdfUrls); // actualitza la llista de URLs només amb fitxers PDF
              if (!urlw) {
                setUrlw(url);
              }
              console.log('trobat un pdf - '+ itemRef.name + ' URL: ' + url);
            }).catch((error) => {
              console.error("Error en obtenir l'URL de descàrrega:", error);
            });
          };
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    console.log('urlw: ', urlw); // Aquí s'assegura que es llegeixi el valor actualitzat de urlw
  }, [urlw]); // Aquest efecte s'executarà cada vegada que urlw canviï

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);     
    if (!urlw && urlsImatges.length > 0) {
      setUrlw(urlsImatges[0]); // Si urlw està buida, assigna la primera URL d'imatge
    }
    setTemps(40000);
  }
  const handleUrl = (selectedIndex) => {     
    setUrlw(urlsImatges[selectedIndex]);
    console.log('urlw **** -- '+ urlw + '    selectedIndex - '+ selectedIndex);
  }
  function Sacabat() {    
    localStorage.setItem('Programa', '/Pantalla04');
    navigate('/Pantalla04');
}  
  return (  
   <>
    <div className="M4TextP4">{c01} / {c03}
         <div className="d-flex justify-content-center mt-1">
                 <Button className="mt-1 custom-logout-btn small-buttonP4" 
                     variant="light"
                     onClick={Sacabat}>                                      
                     <i className="fas fa-sign-out-alt"></i>  Enrere
                 </Button>
          </div>
      </div>
       <br></br>
       <div className="M4P6">
        <Container> 
             {pCompleta ? (
              <div className='imatge-a-pantalla-completaP6'>                           
                    <iframe src= {pdfUrl} width="100%" height="500px"
                    onClick={togglePantallaCompleta}
                    ></iframe>                    
              </div>
            ) : (
              <div className='pdf-containerP6'>
                <Carousel activeIndex={index} interval={temps} onSelect={handleSelect}>
                {urlsImatges.map((url, idx) => (
                <Carousel.Item key={idx} onSelect={() => handleUrl(idx)}>
                <iframe
                  className='pdf-iframeP6'
                  src={pdfUrl}
                  onClick={togglePantallaCompleta}
                  
                  title={`Pdf ${idx}`}
                  style={{
                    width: '100%', // S'adapta a l'amplada del contenidor
                    height: '70vh', // Opcional, pots ajustar l'altura per adaptar-lo
                    border: 'none', // Eliminar el borde de l'iframe
                  }}
                ></iframe>
                </Carousel.Item>
                ))}
                </Carousel>
              </div>
            )}            
         </Container>  
         </div>      
   </>
  );}
export default Pantalla06;