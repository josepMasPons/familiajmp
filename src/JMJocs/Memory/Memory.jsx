  import React, { useEffect, useState, useRef } from "react";
  import { useNavigate } from "react-router-dom";
  import { query, where, getDocs, collection } from 'firebase/firestore';
  import { ref as refCar, listAll, getDownloadURL } from 'firebase/storage'; 
  import { Form, Button} from "react-bootstrap";
 
  import { storageCar, db } from '../../firebaseLoc.js';

  import  ModalM1 from "./ModalM1.js"; 
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { LazyLoadImage } from 'react-lazy-load-image-component';
  import 'react-lazy-load-image-component/src/effects/blur.css';
  import "./Memory.css";
  //import TJHeader from "./TJHeader";

  function TJMemory() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [imageUrlsR, setImageUrlsR] = useState({});  
    const [oberta, setOberta] = useState({});
    const [revers, setRevers] = useState([]);
    const [sirevers, setSirevers] = useState('');
    const [trobat, setTrobat] = useState({});
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [vist, setVist] = useState(true);
    const [numCards, setNumCards] = useState("8");
    const [selectedB, setSelectedB] = useState('V10');
    const [selectedBnom, setSelectedBnom] = useState('Família');
    const [isOpenB, setIsOpenB] = useState(false);
    const isProcessingRef = useRef(false);
    const [jogar, setJogar] = useState(false);
    const [carregat, setCarregat] = useState(false);
    const [codisNoms, setCodisNoms] = useState([]);
    const [urlv1, setUrlv1] = useState('');
    const [indv1, setIndv1] = useState('');
    const [showModalM1, setShowModalM1] = useState(false);
    const [comentari1, setComentari1] = useState('');
    const [comentari2, setComentari2] = useState('');
    const [comentari3, setComentari3] = useState('');
    const [scoreM1, setScoreM1] = useState(0);
    const [tirades0, setTirades0] = useState(0);
    const [tirades, setTirades] = useState(0);
    
    useEffect (() => {
      if (visible1) {
        setComentari1('Entrar  la primera carta a comparar')
      } else {
        setComentari1('');
      }
    }, [visible1]);  
    useEffect (() => {
      if (visible2) {
        setComentari2('Entrar la segona Carta')
      } else {
        setComentari2('');
      }
    }, [visible2]);      
    useEffect(() => {
      if (oberta.length > 0 && oberta.every((elem) => elem === "O")) {
        console.log('*************** final de la partida');
        setTimeout(() => {
           setComentari1('');
           setComentari2('');
           setComentari3('');
           setShowModalM1(true);
        
      }, 500);    
      }
    }, [oberta]);
    useEffect(() => {
      const fetchRevers = async () => {
        //console.log('***************** ' + db)
        const linksCollectionR = collection(db, 'TMCartes');
        const qR = query(linksCollectionR, where("TMCcodi", "==", "R01"));
        try {
          const querySnapshot = await getDocs(qR);
          const linksDataR = querySnapshot.docs.map(docR => ({
            TMDocument: docR.id,
            TMCcodi: docR.data().TMCcodi,
            TMCnom:  docR.data().TMCnom,
            ...docR.data()
          }));
          // console.log('docs. seleccionats - ', linksDataR)
          setRevers(linksDataR);
        } catch (error) {
          console.error('Error llegint revers: ', error);
        }
      };
      fetchRevers();
      const buscarBaralles = async () => {
        const linksCollectionX = collection(db, 'TMCartes');
        const qX = query(linksCollectionX);
        try {
          const querySnapshotX = await getDocs(qX);
          const linksDataX = querySnapshotX.docs.map(docX => ({
            TMDocument: docX.id,
            TMCcodi: docX.data().TMCcodi,
            TMCnom: docX.data().TMCnom,
            ...docX.data()
          }))
          const codisNomsArray = linksDataX.filter(({ TMCcodi }) => TMCcodi !== "R01")
                                          .map(({ TMCcodi, TMCnom }) => ({ TMCcodi, TMCnom }));
                setCodisNoms(codisNomsArray);
          
        } catch (error) {
          console.error('Error llegint documents: ', error);
        }
      };
      buscarBaralles();
      const fetchData = async () => {
        const linksCollection = collection(db, 'TMCartes');
        const q = query(linksCollection, where("TMCcodi", "==", selectedB));
        try {
          const querySnapshot = await getDocs(q);
          const linksData = querySnapshot.docs.map(doc => ({
            TMDocument: doc.id,
            TMCcodi: doc.data().TMCcodi,
            TMCnom:  doc.data().TMCnom,
            ...doc.data()
          }));
        // console.log('docs. seleccionats - ', linksData)
          setData(linksData);
          setCarregat(true);
        } catch (error) {
          console.error('Error llegint documents: ', error);
        }
      };
      fetchData();
    }, [selectedB, numCards]);
  useEffect(() => {
    const fetchImageR = async (codiR, indexR) => {      
      const grupPathR = `TMCartes/${codiR}`;
      const storageRefR = refCar(storageCar, grupPathR);  
      try {
        const resultatR = await listAll(storageRefR); 
        if (resultatR.items.length > 0) {
            const urlsR = await Promise.all(
            resultatR.items.map(async (item) => {
              const urlR = await getDownloadURL(item);
              return urlR;
            })
          );
        return { [indexR]: urlsR };
        } else {
          return { [indexR]: [] };
        }
      } catch (error) {
        console.error('Error al obtenir la imatge REVERS:', error);
        return { [indexR]: [] };
      }
    };
    if (data.length > 0) {
      const imagePromisesR = revers.map((itemR, indexR) => 
        fetchImageR(itemR.TMCcodi, indexR));      

      Promise.all(imagePromisesR)
        .then(resultsR => {         
          const allImagesR = resultsR.reduce((acc, cur) => 
            [...acc, ...Object.values(cur)[0]], []);
        
          setImageUrlsR({ selected: allImagesR });
      });
    }
      const fetchImage = async (codi, index) => {      
        const grupPath = `TMCartes/${codi}`;
        //console.log('codi - ',codi );
        const storageRef = refCar(storageCar, grupPath);  
        try {
          const resultat = await listAll(storageRef); 
          if (resultat.items.length > 0) {
            // Obtenim totes les URL de les imatges disponibles
            const urls = await Promise.all(
              resultat.items.map(async (item) => {
                const url = await getDownloadURL(item);
                return url;
              })
            );
            // Retornem l'array de URL d'imatges per aquest registre
            return { [index]: urls };
          } else {
            return { [index]: [] };
          }
        } catch (error) {
          console.error('Error al obtenir la imatge:', error);
          return { [index]: [] };
        }
      };
        // Verifiquem si hi ha dades abans de fer la crida per a les imatges
      if (data.length > 0) {
        const imagePromises = data.map((item, index) => 
          fetchImage(item.TMCcodi, index));      
    
        Promise.all(imagePromises)
          .then(results => {
            // Unim totes les URL d'imatges en un sol array
            const allImages = results.reduce((acc, cur) => 
              [...acc, ...Object.values(cur)[0]], []);
            
            // Funció per seleccionar les imatges de manera aleatòria
            const randomImages = (images, count = numCards) => {
              const shuffled = [...images];  // Fem una còpia de l'array d'imatges
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Random index
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Intercanviem els elements
              }
              return shuffled.slice(0, count); // Retornem les primeres 'count' imatges
            };
    
            // Seleccionem 10 imatges aleatòriament
            const selectedImages = randomImages(allImages);
    
            // Duplicar les imatges seleccionades
            const duplicatedImages = [...selectedImages, ...selectedImages];  // Duplicarem les 10 imatges per obtenir 20 imatges
    
            // Funció per barrejar les imatges duplicades
            const shuffleImages = (images) => {
              const shuffled = [...images]; // Fem una còpia de l'array
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Random index
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Intercanviem els elements
              }
              return shuffled; // Retornem l'array barrejat
            };
    
            // Barrejar les 20 imatges
            const shuffledImages = shuffleImages(duplicatedImages);
    
            // Emmagatzemem les imatges barrejades
            setImageUrls({ selected: shuffledImages });
            const initialStates = shuffledImages.map(() => 'T');
            setOberta(initialStates);
            const initialtrobat = shuffledImages.map(() => 'No');
            setTrobat(initialtrobat);
          });
      }
    }, [data]);

    
    const buto01 = async (index, urlW) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true; 
        if (vist === true) {
            await butoprimer(index, urlW);
        } else {
            await butosegon(index, urlW);
        }
        isProcessingRef.current = false;
    };

    const butoprimer = async (index, urlW) => {
      console.log('primer -'. processing)
      if (oberta[index] === '0') return;
     //console.log('inici butoprimer . ', index);  
      setOberta((prev) => {
            const newState = [...prev];
            newState[index] = 'O';            
            return newState;
        });    
        setUrlv1(urlW);
        setIndv1(index);
        setVisible1(false);
        setVisible2(true);
        setVist(false);
       
    // console.log('final butoprimer . ', index);
    };
    
    const butosegon = async (index, urlW) => {
      if (oberta[index] === 'O' || indv1 === index) return;
      console.log('inici butosegon . ', index);  
      await new Promise((resolve) => setTimeout(resolve, 50));
      setTirades((prev) => prev + 1);
      setTirades0((prev) => prev + 1);
      setOberta((prev) => {
        const newState = [...prev];
        newState[index] = 'O';
        return newState;
      });
      setVisible1(true);
      setVisible2(false);
      setVist(true);
     
    
      if ( (index !== indv1) &&  (urlW === urlv1)) {
        //console.log('*********  trobat !!!!', index, ' => ', indv1);
           setOberta((prev) => {
            const newState = [...prev];
            newState[index] = 'O';
            return newState;
        });
        setComentari3('****  🎉 ******  Parella completada ******  🎉 ****');
        setScoreM1((prev) => Math.round(prev + (100 * numCards / tirades0)));
        setTirades(0);

        setTimeout(() => {
           setComentari3('');
        }, 5000);

      } else {
        const canviaA_T = (index1, index2) => {
        setOberta((prev) => {
          const newState = [...prev];
          newState[index1] = 'T';
          newState[index2] = 'T';
          return newState;
         });
        };
        setTimeout(() => {
           canviaA_T(index, indv1);
        }, 2200);
      };
    };
 
    
    const ButoRevers = (urlR) => {
    setSirevers(urlR);
    }
    
    const Jugar = () => {
      setVisible1(true);
      setVisible2(false);
      setJogar(true);
    }
    const Sacabat = () => {      
      setShowModalM1(false)
      navigate('/jocs0'); 

    }
    const DmenuB = (optionB, optionBnom) => {
      setSelectedB(optionB);
      setSelectedBnom(optionBnom);
    }
    const toggleMenuB = () => {
      setIsOpenB(!isOpenB);
    } 
    return ( 
      <>

      <div>  
      <div>
        <ModalM1
        punts={scoreM1}
        jugades={tirades0}
        nivell= {numCards}
        show={showModalM1}
        onClose={() => {Sacabat()}}
        message="Has acabat la partida amb èxit! 🏆"
        />
        </div>      
      <div className="text-center mt-4">
        <div className="fw-bold display-6"
            style={{ fontSize: '1.3rem' }}>Memory
          &nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;
        <div  style={{
          fontsize: '1rem',
          backgroundColor: 'beige',
          color: 'Black',
          padding: '2px 5px',
          borderRadius: '2px',
          display: 'inline-block', 
          textAlign: 'right', 
          fontWeight: 'normal',
          marginTop: '3px',
          width: 'auto', 
          maxWidth: '200px',
          border: '1px solid black'
          }}>           
          Punts: {scoreM1}
        </div>
        </div> 
        {sirevers === '' && jogar === false && (
          <>
        <br></br>
        <Button className="mb-2" 
                        variant="warning"
                           size='sm'
                        onClick={Sacabat}>                                      
                      Sortir Joc   
        </Button> 
         <div className="text-muted h5">Seleccioni Revers</div>  
          <div className="TJI001R">      
            <div className="TJI002R">
              {revers.map((itemR, indexR) => (
                <>
                  {imageUrlsR.selected && imageUrlsR.selected.length > 0 ? (
                    imageUrlsR.selected.map((urlR, indexR) => (
                    <div key={indexR} className="image-containerR"> 
                      <LazyLoadImage
                        key={indexR}
                        src={urlR}
                        className="TJI003R"                
                        onClick={() => ButoRevers(urlR)}
                        alt={`Miniatura ${indexR}`}
                        effect="blur"
                      />
                    
                      </div>                   
                    ))
                  ) : (
                    <div>Carregant ....</div> 
                  )}
              </>   
              ))}
            </div>
            </div>
            </>          
        )}
        <br></br>
          {sirevers != '' && jogar === false && (
            <>
            <div> 
              <LazyLoadImage
                src={sirevers}
                className="TJI003R"              
                effect="blur"
              />        
            </div>
            <div className="d-flex flex-column align-items-center mt-4">
            <Form.Group controlId="numCards" className="mb-3 w-50">
              <Form.Label className="fw-bold fs-5 text-primary">
                  Amb quantes cartes vols jugar?
                </Form.Label>
                <Form.Control
                  type="number"
                  min="2"
                  className="text-center shadow-sm"
                    
                  value={numCards}
                  onChange={(e) => setNumCards(e.target.value)}
                />
              </Form.Group>
            </div>
            <br></br>
            <div>
            <button
              className={`menu05AR-button ${selectedB === 'V10' ? 'active' : ''}`}
                    onClick={toggleMenuB}>
                  Baralla : {selectedBnom} ▼
            </button>      
                {isOpenB && (
                  <ul>
                  {codisNoms.map((item) => (
                    <li key={item.TMCcodi} onClick={() => DmenuB(item.TMCcodi,item.TMCnom)}>
                            {item.TMCnom}
                    </li>
                    ))}
                  </ul>
                )}
              </div>
              </>
          )}
          <br></br>
        {jogar === false && sirevers != '' && (       
        <div className="d-flex justify-content-center mt-4 gap-3">            
              <Button className="mb-2" 
                        variant="warning"
                           size='sm'
                        onClick={Sacabat}>                                      
                      Sortir Joc   
              </Button> 
                <Button className="mb-2"
                      variant="primary" 
                      onsize='sm'
                      onClick={Jugar}>
                  Jugar
              </Button>
            </div>
        )}
      </div>       
      {jogar  && carregat && sirevers != '' && (
        <>
          <div className="game-container1">             
             {comentari1 && (
              <div className={visible1 ? 'fade1' : ''}>
                           {comentari1}
                  </div>
             )}
          </div> 
          <div className="game-container2">          
             {comentari2 && (
                    <div className={visible2 ? 'fade2' : ''}>                     
                            {comentari2}
                    </div>
             )}
          </div> 
          <div className="game-container3">             
             {comentari3 && (
              <div className={visible1 ? 'fade3' : ''}>
                           {comentari3}
                  </div>
             )}
          </div> 
        <div className="d-flex justify-content-center mt-4 gap-3">  
            <Button className="mb-2" 
                  variant="warning"
                  size='mb'
                  onClick={Sacabat}>
                Sortir del joc
            </Button>
          </div>
          <div className="TJI001">      
            <div className="TJI002">
              {data.map((item, index) => (
                <>
                {imageUrls.selected && imageUrls.selected.length > 0 ? (
                    imageUrls.selected.map((url, index) => {
                      const imageUrlx = oberta[index] === 'T' ? 
                            sirevers : url;    
                    return (
                      <div key={index} className="image-container">
                        <LazyLoadImage
                          key={index}
                          src={imageUrlx} 
                          className="TJI003R"
                          onClick={() => buto01(index, url)}
                          alt={`Miniatura ${index}`}
                          effect="blur"
                        /> 
                      </div> 
                                            
                    );
                    })
                    
                ) : (
                    <div>No tenim Imatges disponibles ....</div>
              )}
              </>              
            ))}                        
          </div>
         </div>
          </>
          )}          
        </div>
    </>
    );
  }

  export default TJMemory;
