import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ref as refCar, listAll, getDownloadURL, getStorage, ref, deleteObject, uploadBytes } from 'firebase/storage'; 
import { Navbar, Container, Nav, Row, Col, Card, Form, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { storageCar, db } from '../firebaseLoc';
import JMHeader from "./JMHeader";
import "./Global.css";
import { collection, deleteDoc, writeBatch, doc, limit, query, getDocs } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';
export default function Pantalla03() {
  
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [progresPercent, setProgresPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  
  const [siDocs, setSiDocs] = useState(false);
  const [modDocs, setModDocs] = useState(false);
  const [malta, setMalta] = useState(false);
  const [baixa, setBaixa] = useState(false);
  const [missatge, setMissatge] = useState('');
  const [logEliminacio, setLogEliminacio] = useState([]);
  const [fitxer, setFitxer] = useState('');
  const passWord = localStorage.getItem('PassWord');
  const passNom = localStorage.getItem('PassNom');
  const passTip = localStorage.getItem('PassTip');
  const passMail = localStorage.getItem('PassMail');
  
  const c01 = localStorage.getItem('Proces010');
  const c02 = localStorage.getItem('Proces011');
  const c03 = localStorage.getItem('Proces012');
  const c04 = localStorage.getItem('Proces013');
  const c05 = localStorage.getItem('Proces014');
  const c06 = localStorage.getItem('Proces015');
  const c07 = localStorage.getItem('Proces016');
  const c08 = localStorage.getItem('Proces017');
  const c09 = localStorage.getItem('Proces018');
  const c10 = localStorage.getItem('Proces019');
  const c11 = localStorage.getItem('Proces020');
  const c12 = localStorage.getItem('Proces021');
  const c13 = localStorage.getItem('Proces022');
  const c14 = localStorage.getItem('Proces114');
  const c15 = localStorage.getItem('Proces115');
  const c16 = localStorage.getItem('Proces116');
  const c17 = localStorage.getItem('Proces117');
  const c18 = localStorage.getItem('Proces118');
  const c19 = localStorage.getItem('Proces119');
  const c20 = localStorage.getItem('Proces120');
  const c99 = localStorage.getItem('Proces099');
  const c00 = localStorage.getItem('Proces000');
  const primerP = localStorage.getItem('c00_ident');
  const [primer, setPrimer] = useState(null);
 

  const fetchMedia = async (refPath) => {
    try {
      const storageRef = refCar(storageCar, refPath);
      const resultat = await listAll(storageRef);
      const urls = await Promise.all(resultat.items.map(async itemRef => {
        try {
          const url = await getDownloadURL(itemRef);
          return { url, name: itemRef.name };
        } catch (error) {
          console.error("Error descarregant:", itemRef.name, error);
          return null;
        }
      }));
      const validUrls = urls.filter(Boolean);
      const fotos = validUrls.filter(item => /\.(jpe?g|png|pdf)$/i.test(item.name));
      const videos = validUrls.filter(item => /\.mp4$/i.test(item.name));
      const nvideo = videos.length > 0 ? videos[0].url : '';
      return { fotos, videos, nvideo };
    } catch (err) {
      console.error("Error accedint a la carpeta:", refPath, err);
      setError(`Error accedint a ${refPath}`);
      return { fotos: [], videos: [], nvideo: '', carpeta: refPath.split('/').pop() };
    }
  };
 useEffect(() => {
    const fetchAllMedia = async () => {
      const basePath = `santviHist/${c01}/${c02}/`;
      try {
        const baseRef = refCar(storageCar, basePath);
        const result = await listAll(baseRef);
        const grups = await Promise.all(result.prefixes.map(async subRef => {
          const path = `${basePath}${subRef.name}`;
          const mediaData = await fetchMedia(path);
          return { carpeta: subRef.name, ...mediaData };
        }));
        setMedia(grups);
        const anyDocs = grups.some(grup => grup.fotos && grup.fotos.length > 0);
        setSiDocs(anyDocs);
      } catch (err) {
        console.error("Error llistant subcarpetes:", err);
        setError("Error carregant les carpetes");
      }
    };

    if (primerP === 'M') {
      localStorage.setItem('c00_ident', 'A');
    }

    const obtenirPrimer = async () => {
      try {
        const linksCollection = collection(db, 'SantviLog');
        const primerRegistre = query(linksCollection, limit(1));
        const querySnapshot = await getDocs(primerRegistre);
        if (!querySnapshot.empty) {
          const primerDoc = querySnapshot.docs[0];
          setPrimer(primerDoc.data().C00_ident);
        } else {
          setPrimer('99000');
        }
      } catch (err) {
        console.error("Error carregant primer log:", err);
        setPrimer('99000');
      }
    };

    obtenirPrimer();
    fetchAllMedia();
  }, []);

  useEffect(() => {
    if (primer !== null) {
      const ident = localStorage.getItem('c00_ident');
      if (ident === 'A') {
        localStorage.setItem('c00_ident', 'F');
        const csvCollection = collection(db, 'SantviLog');
        const batch = writeBatch(db);
        const newDocRef = doc(csvCollection, `SantviDoc_${primer}`);
        const data = new Date();
        const dataFormatejada = `${data.getHours()}:${data.getMinutes()} ${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
        batch.set(newDocRef, {
          C00_ident: primer,
          C01_mail: passMail,
          C02_usuari: passNom,
          C03_clase: passTip,
          C04_temporada: c01,
          C05_obra: c03,
          C06_inici: dataFormatejada,
          C07_final: '',
          C08_notes: c08
        });
        batch.commit();
      }
    }
  }, [primer]);

  function VeureFotos(index) {
    if(modDocs === false) {
      localStorage.setItem('Proces025', media[index].carpeta);
      localStorage.setItem('Programa', '/Pantalla04');
      navigate('/Pantalla04');
      return;
    }
    localStorage.setItem('Proces025', media[index].carpeta);
    setBaixa(true);
  }

  function VeureVideos(cx, cy) {
    localStorage.setItem('Proces026', cx);
    localStorage.setItem('Proces027', cy);
    localStorage.setItem('Programa', '/Pantalla05');
    navigate('/Pantalla05');
  }

  function Sacabat() {
    localStorage.setItem('Programa', '/Pantalla02b');
    navigate('/Pantalla02b');
  }

  function Manten() {
    localStorage.setItem('Proces099', c99); 
    localStorage.setItem('Programa', '/JMManten');
    navigate('/JMManten');
  }

  function AltaD() {
    setMalta(true);
    setFitxer('');
  }
 
async function BaixaC() {
  const storage = getStorage();
  const carpetaX = localStorage.getItem('Proces025');
  const c01 = localStorage.getItem('Proces010');
  const c02 = localStorage.getItem('Proces011');
  const basePath = `santviHist/${c01}/${c02}/${carpetaX}/`;

  function afegirAlLog(miss) {
    setLogEliminacio(prev => [...prev, miss]);
  }

  if (!carpetaX) {
    alert('❌ Cap carpeta seleccionada.');
    return;
  }

  if (!window.confirm(`Estàs segur que vols eliminar la carpeta i tot el seu contingut?\n\n${basePath}`)) {
    return;
  }

  setMissatge('🗑️ Eliminant fitxers i subcarpetes...');
  setLogEliminacio([]);

  const carpetaRef = ref(storage, basePath);

  try {
    const result = await listAll(carpetaRef);

    const deletePromises = [];

    // Eliminar fitxers
    result.items.forEach((itemRef) => {
      const p = deleteObject(itemRef)
        .then(() => afegirAlLog(`✅ Eliminat: ${itemRef.fullPath}`))
        .catch((error) => afegirAlLog(`❌ Error eliminant: ${itemRef.fullPath} - ${error.message}`));
      deletePromises.push(p);
    });

    // Eliminar subcarpetes (recursivament si cal)
    result.prefixes.forEach((subfolderRef) => {
      const p = eliminaRecursivament(subfolderRef);
      deletePromises.push(p);
    });

    await Promise.all(deletePromises);

    setMissatge('✅ Eliminació completada!');
  } catch (error) {
    console.error("Error general en la baixa:", error);
    setMissatge(`❌ Error en eliminar carpeta: ${error.message}`);
  }
}

// Funció auxiliar per eliminar subcarpetes recursivament
async function eliminaRecursivament(folderRef) {
  const result = await listAll(folderRef);

  const deletePromises = [];

  result.items.forEach((itemRef) => {
    const p = deleteObject(itemRef)
      .then(() => setLogEliminacio(prev => [...prev, `✅ Eliminat: ${itemRef.fullPath}`]))
      .catch((error) => setLogEliminacio(prev => [...prev, `❌ Error eliminant: ${itemRef.fullPath} - ${error.message}`]));
    deletePromises.push(p);
  });

  result.prefixes.forEach((subfolderRef) => {
    const p = eliminaRecursivament(subfolderRef);
    deletePromises.push(p);
  });

  await Promise.all(deletePromises);
}

async function Baixa() {  
      if (window.confirm("Estàs segur que vols eliminar aquest registre?")) 
        {
          try {
             const docRef = doc(db,'SantviHist',  'santvidoc_'+c99);
             await deleteDoc(docRef);   
            alert('Registre eliminat correctament');
             localStorage.setItem('Programa', '/Pantalla02b');
             navigate('/Pantalla02b');
          } catch (error) {
            console.error('Error eliminant registre:', error);
            alert('Error eliminant el registre');
          }
        }
      };
    const fileInputRef = useRef(null);

async function uploadFiles() {
  const storage = getStorage();
  const fileInput = fileInputRef.current;
  if (!fileInput || fileInput.files.length === 0) {
    alert('No has seleccionat cap carpeta ni arxiu');
    return;
  }
  //console.log('pasat punt 1');
  const files = Array.from(fileInput.files);
  const total = files.length;
  let pujat = 0;
 
  setIsUploading(true);   
  setProgresPercent(0);   
  //  console.log('pasat punt 2');
  for (const file of files) {
    let fileToUpload = file;

    // ✅ Si és una imatge JPG/JPEG, comprimim abans de pujar
   //!!! si es modifiquen els paràmetres fer-ho tambè a JMAltaReg.jsx
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      try {
        const options = {
        maxSizeMB: 2,                 // en lloc de 1 MB podrien ser 2 MB
        maxWidthOrHeight: 1920,       // permet una resolució més gran
        initialQuality: 0.8,          // comença al 80% de qualitat
        useWebWorker: true

        //const options =  { primer
        //  maxSizeMB: 1,               límit màxim: 1 MB
        //  maxWidthOrHeight: 1024,     màxim de 1024px d'amplada/alçada
         
        };
        const compressedFile = await imageCompression(file, options);
        console.log(`🗜️ Comprimida: ${file.name} de ${Math.round(file.size/1024)}KB 
                                a ${Math.round(compressedFile.size/1024)}KB`);
        fileToUpload = compressedFile;
      } catch (err) {
        console.error(`❌ Error en comprimir la imatge ${file.name}:`, err);
        // Continua amb el fitxer original si falla la compressió
      }
    }

    const filePath = `santviHist/${c01}/${c02}/${file.webkitRelativePath || file.name}`;
    const storageRef = ref(storage, filePath);

    try {
      const snapshot = await uploadBytes(storageRef, fileToUpload);
      pujat++;
      
      const percent = Math.round((pujat / total) * 100);
      setProgresPercent(percent);

      //console.log(`✅ Pujat (${pujat}/${total} - ${percent}%): 
      //                       ${snapshot.metadata.name}`);
      setProgresPercent(percent);
      if (pujat === total) {
        setIsUploading(false);
        setProgresPercent(100);
        localStorage.setItem('Proces099', c99);
        localStorage.setItem('Programa', '/JMManten');
        alert("✅ Fi de la pujada!");
        navigate('/JMManten');
      }
    } catch (error) {
      console.error(`❌ Error al pujar el fitxer ${file.name}:`, error);
    }
  }
 }
  const handleFileChange = (e) => {
        const fileList = e.target.files;
        if (fileList.length > 0) {
          setFitxer(fileList);
        }
      }; 
  function Docums() {
    setModDocs(true);
  }

  return (
    <div className="Pantalla03">
      <JMHeader />
      <Container className='mt-5'>
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Card>
                      <Card.Header className="text-center fs-5 fw-bold">
                        {c01} - {c03}
                      </Card.Header>
                      <Card.Body>
                        <Form>
                          <Form.Group className="d-flex align-items-center">
                            {modDocs ===  false && (
                            <Form.Label className="me-2" style={{ width: '450px' }}>
                              <div className='cap303P3'>
                                <div className='nom-text3xP3' data-label="N.Ordre/Doc.:">
                                  <span className='Separa-cams1P3'>{c99}</span>
                                  <span className='Separa-cams1P3'>{c00}</span>
                                </div>
                                <div className='nom-text3xP3' data-label="Ubicació Doc::">
                                  <span className='Separa-cams1P3'>{c02}</span>
                                </div>
                                <div className='nom-text3xP3' data-label="Referència:">
                                  <span className='Separa-cams1P3'>{c04}</span>
                                </div>
                                <div className='nom-text3xP3' data-label="Notes:">
                                  <span className='Separa-cams1P3'>{c05}</span>
                                </div>
                              </div>
                              <div className='cap303P3'>
                                <div className='nom-text3xP3' data-label="Directors:">
                                  <span className='Separa-cams1P3'>{c14}</span>
                                </div>
                                <div className='nom-text3xP3' data-label="Dates:">
                                  <span className='Separa-cams1P3'>{c15}</span>
                                </div>
                                <div className='nom-text3xP3' data-label="Representac.:">
                                  <span className='Separa-cams1P3'>{c16}</span>
                                </div>
                                <div className='nom-text3xP3' data-label="N.Espect.:">
                                  <span className='  Separa-cams1P3'>{c17}</span>  
                                </div>
                                <div className='nom-text3xP3' data-label="President:">
                                  <span className='  Separa-cams1P3'>{c18}</span> 
                                </div> 
                                <div className='nom-text3xP3' data-label="Preu:">
                                  <span className='  Separa-cams1P3'>{c19}</span> 
                                </div> 
                                <div className='nom-text3xP3' data-label="Aforament:">
                                  <span className='  Separa-cams1P3'>{c20}</span> 
                                </div>
                              </div>
                            </Form.Label>
                            )}
                          </Form.Group>
      
                          {error && (
                            <div className="alert alert-danger mt-3 text-center">{error}</div>
                          )}
      
                          {media.length === 0 && !error && (
                            <div className="text-center mt-3">... </div>
                          )} 
                        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                         {media.map((grup, index) => {
                          const primerDoc = grup.fotos[0]; 
                          const nomCarpeta = grup.carpeta || `Carpeta ${index + 1}`;
                          const numDocs = grup.fotos.length;
                         return (
                          <div key={index} className="text-center">
                            {primerDoc && (
                              <Button
                                variant="light"
                                onClick={() => VeureFotos(index)}
                                style={{ padding: 0, border: 'none' }}
                              >
                                <img
                                  src={primerDoc.url}
                                  alt={primerDoc.name}
                                  style={{
                                    maxWidth: '75px',
                                    maxHeight: '50px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }}
                                />
                              </Button>
                            )}
                            {numDocs !== 0 && (
                            <div className="mt-1 small text-muted">
                              <strong>{nomCarpeta} ({numDocs})</strong>
                            </div>
                            )}
                          </div>
                        );
                       })}
                       </div>
                      {modDocs === false && (
                        <>
                       <div className='cap3031P3'>
                        {c07.trim() !== ''  && (
                         <div>
                          <Button className="mt-1 custom-logout-btn small-buttonP3 small-textP3" 
                              variant="light"
                              onClick={() => VeureVideos(c07,c06)}>                                     
                              <i className="fas fa-sign-out-alt"></i> 
                                  Veure video - {c06}
                          </Button> 
                         </div>               
                        )} 
                        {c09.trim() !== ''  && (
                         <div>
                          <Button className="mt-1 custom-logout-btn small-buttonP3 small-textP3" 
                                  variant="light"
                                  onClick={() => VeureVideos(c09,c08)}>                                     
                                  <i className="fas fa-sign-out-alt"></i> 
                                  Veure video - {c08}
                          </Button>
                         </div>
                        )} 
                        {c11.trim() !== ''  && (
                        <Button className="mt-1 custom-logout-btn small-buttonP3 small-textP3" 
                                variant="light"
                                onClick={() => VeureVideos(c11,c10)}>                                     
                                <i className="fas fa-sign-out-alt"></i> 
                                   Veure video - {c10}
                        </Button> 
                      )} 
                      {c13.trim() !== ''   && (
                        <div className="d-flex justify-content-center mt-1 small-textP3">
                        <Button className="mt-1 custom-logout-btn small-buttonx" 
                               variant="light"
                               onClick={() => VeureVideos(c13,c12)}>                                     
                               <i className="fas fa-sign-out-alt"></i> 
                                    Veure video - {c12}
                        </Button>                 
                        </div>
                      )} 
                     </div>
                     </>
                     )}
                     <div className="d-flex justify-content-center mt-1 gap-3">
                       <div>
                          <Button variant="warning" size="sm" 
                              className="mb-2" onClick={Sacabat}>
                          Enrere
                          </Button>
                    </div>
                    {passWord.charAt(11) === 'X' && modDocs === false && (
                    <>
                      <Button variant="primary" size="sm" className="mb-2" 
                                                    onClick={Manten}>
                                                     Modif. reg.
                      </Button>
                      <Button variant="primary" size="sm" className="mb-2" 
                                                    onClick={Docums}>
                                                     +- Docums.
                      </Button>
                    </>
                    )}
                    {siDocs === false  && passWord.charAt(11) === 'X' && (
                      <Button variant="danger" size="sm" className="mb-2" 
                                               onClick={Baixa}>
                                                🗑️ Eliminar reg.
                      </Button>   
                    )}
                    {modDocs === true && malta === false && (
                      <>
                      <div>
                        <Button variant="primary" size="sm" className="mb-2" 
                                                    onClick={AltaD}>
                                                     Alta carpeta Docs.
                        </Button>
                      </div>
                      </>
                    )} 
                    {baixa === true && (
                      <>
                      <div>
                        <Button variant="primary" size="sm" className="mb-2" 
                                                    onClick={BaixaC}>
                                                     Anula carpeta
                        </Button>
                      </div>
                      </>
                    )} 
          
                    {malta === true && (
                      <>
                      <div> 
                       <Form.Group controlId="formFileMultiple" className="mb-3">
                           <Form.Control
                            type="file"
                            ref={fileInputRef}
                            multiple
                            webkitdirectory="true"
                            directory=""
                            onChange={handleFileChange}
                            style={{ border: '1px solid #ced4da', padding: '8px' }}
                            />
                       </Form.Group>
                       <div className="d-flex justify-content-end">
                          { fitxer !== '' && (
                          <Button
                              variant="primary"
                              onClick={uploadFiles}
                              className="mt-2"
                              style={{ padding: '6px 20px', fontWeight: 'bold' }}
                            >
                              📁 Pujar Arxius
                          </Button>
                       
                          )}
                       </div>
                          {isUploading && (
                           <div style={{ marginTop: '1rem' }}>
                              <label>Pujant arxius.(Esperi).. {progresPercent}%</label>
                              <progress value={progresPercent} max="100" style={{ width: '100%' }} />
                            </div>
                            )}

                      </div>
                     </>
                    )}
                    </div>  
                  {missatge && (
                      <div className="alert alert-info mt-3 text-center">
                                    {missatge}
                      </div>
                  )}
                      
                </Form>
              </Card.Body>
            </Card>
          </Col>
         </Row>
         </Container>
    </div>
  );
}
