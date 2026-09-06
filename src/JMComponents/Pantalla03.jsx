import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ref as refCar, listAll, getDownloadURL, getStorage, ref, deleteObject, uploadBytes } from 'firebase/storage'; 
import { Navbar, Container, Nav, Row, Col, Card, Form, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { storageCar, db } from '../firebaseLoc';
import "./Global.css";
import { collection, deleteDoc, writeBatch, doc, limit, query, getDocs } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';
import videoF from '../fotos/veureVideo.jpg';
import mapa from '../fotos/mapa.jpg';
import Benrera from '../JMGlobal/Benrera';

export default function Pantalla03() {  
  const [media, setMedia] = useState([]);
  const [mediaV, setMediaV] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [progresPercent, setProgresPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [siDocs, setSiDocs] = useState(false); 
  const [siDocsV, setSiDocsV] = useState(false);
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
  const [administrador, setAdministrador]
                            = useState(localStorage.getItem('AdminFam') || ''); 
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
  const [mapes, setMapes] = useState([]);

  const [ubic01, setUbic01] = useState('01');
  const [primer, setPrimer] = useState(null);
 
  useEffect(() => {
   const processar = async () => {
    try {
      const linksCollection = collection(db, 'SantviLog');
      const primerRegistre = query(linksCollection, limit(1));
      const querySnapshot = await getDocs(primerRegistre);
      let primerCalculat;
      if (!querySnapshot.empty) {
         const primerDoc = querySnapshot.docs[0];
         const valor = primerDoc.data().C00_ident;
         const numero = parseInt(valor, 10);
         if (Number.isNaN(numero)) {
            console.error("Valor invàlid per C00_ident:", valor);
            primerCalculat = 99000; // valor per defecte segur
         } else {
            primerCalculat = numero - 1;     
         } 
      }  else {
            primerCalculat = 99000;
      }
      // (opcional) guardar-lo a l'estat si el necessites en UI
      setPrimer(primerCalculat);
     
      // 👉 usar directament la variable, NO l'estat
      const csvCollection = collection(db, 'SantviLog');
      const batch = writeBatch(db);
      const newDocRef = doc(csvCollection, `SantviDoc_${primerCalculat}`);

      const data = new Date();
      const dataFormatejada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} - ${data.getHours()}:${data.getMinutes()}`;

      batch.set(newDocRef, {
        C00_ident: primerCalculat,
        C01_mail: passMail,
        C02_usuari: passNom,
        C03_clase: 'F',
        C04_temporada: c01,
        C05_obra: c03,
        C06_inici: dataFormatejada,
        C07_final: '',
        C08_notes: ''
      });

      await batch.commit();

    } catch (err) {
      console.error("Error processant log:", err);
    }
  };

  processar();

}, []);
  const fetchMedia = async (refPath) => {
    try {
      const storageRef = refCar(storageCar, refPath);
      const resultat = await listAll(storageRef);

      // Obtenim totes les URL en paral·lel
      const urls = await Promise.allSettled(
        resultat.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { url, name: itemRef.name };
        })
      );

      // Filtrar només les correctes
      const validUrls = urls
        .filter((res) => res.status === "fulfilled")
        .map((res) => res.value);

      // Classificar per tipus
      const fotos = validUrls.filter((item) =>
        /\.(jpe?g|png|pdf)$/i.test(item.name)
      );
      const videos = validUrls.filter((item) => /\.(mp4|mpg)$/i.test(item.name));
    
      return {
        fotos,
        videos,
        nvideo: videos.length > 0 ? videos[0].url : "",
      //  thumbnail,
      };
    } catch (err) {
      console.error("❌ Error accedint a la carpeta:", refPath, err);
      setError(`Error accedint a ${refPath}`);
      return { fotos: [], videos: [], nvideo: "", carpeta: refPath.split("/").pop() };
    }
  };
  useEffect(() => {
  const buscarmapa = async () => {
    try {
      const linksCollectionM = collection(db, 'Mapes');
      const querySnapshotM = await getDocs(linksCollectionM);

      const linksMapa = querySnapshotM.docs.map(doc => ({
        id: doc.id,
        M01: doc.M01,  
        M02: doc.M02,  
        M03: doc.M03,  
        M04: doc.M04,         // ← nom dels documents
        ...doc.data()        // ← tots els camps
      }));
      //console.log('Mapes carregats:', );     
      const c99str = String(c99).padStart(4, '0');      
      const filteredMapa = linksMapa.filter(item =>
         item.id.includes(c99str)
      );


      setMapes(filteredMapa); // ← estat per mostrar-ho

    } catch (error) {
      console.error('Error llegint mapes: ', error);
    }
   
  };
  buscarmapa();
}, [c99]);

useEffect(() => {
  //console.log('display mapes ----' + mapes.length + '-c99 = ' + c99);
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('Mapa02:') || key.startsWith('Mapa03:')) {
      localStorage.removeItem(key);
    }
  });
  localStorage.setItem('Mapa02', c99);
  if (mapes.length > 0) {
    mapes.forEach(mapa => {
      const mapaString = JSON.stringify(mapa);
      //console.log('Document mapa ==:', mapa.id);
      localStorage.setItem('Mapa03:' + mapa.id, mapaString);
      
    });
  }
}, [mapes]);

  // ==========================
  // 🔹 FUNCIO PRINCIPAL: fetchAllMedia
  // ==========================
  useEffect(() => {
    const fetchAllMedia = async () => {
      const basePath = `Familiar/${c01} ${c02}/`;
      //console.log(basePath);
      // 🔸 Revisem si tenim cache guardada
      const cacheKey = `media_cache_${basePath}`;
      const cachedData = localStorage.getItem(cacheKey);
      /*   ***** revisar perque des de cache nomes carrega el primer ????
      if (cachedData) {
       
        const parsed = JSON.parse(cachedData);
          
        setMedia(parsed);
        setMediaV(parsed);
        setSiDocs(parsed.some((g) => g.fotos?.length > 0));
        setSiDocsV(parsed.some((g) => g.videos?.length > 0));
        console.log("🟢 Dades carregades des de cache");
        return;
      }
      */
      try {
        const baseRef = refCar(storageCar, basePath);
        const result = await listAll(baseRef);
        const allGrups = [];

        // 🔸 Limitem el paral·lelisme per evitar saturar connexions
        const limit = 5;
        for (let i = 0; i < result.prefixes.length; i += limit) {
          const chunk = result.prefixes.slice(i, i + limit);

          const grupsChunk = await Promise.all(
            chunk.map(async (subRef) => {
              const path = `${basePath}${subRef.name}`;
              const mediaData = await fetchMedia(path);
              const grup = { carpeta: subRef.name, ...mediaData };

              // ✅ Evitem duplicats abans d'afegir
              setMedia((prev) => {
                if (prev.some((g) => g.carpeta === grup.carpeta)) return prev;
                return [...prev, grup];
              });

              setMediaV((prev) => {
                if (prev.some((g) => g.carpeta === grup.carpeta)) return prev;
                return [...prev, grup];
              });

              return grup;
            })
          );

          allGrups.push(...grupsChunk);
        }

        // 🔸 Eliminem qualsevol duplicat residual
        const uniqueGrups = Object.values(
          allGrups.reduce((acc, g) => {
            acc[g.carpeta] = g;
            return acc;
          }, {})
        );

        // 🔸 Actualitzem estat final
        setMedia(uniqueGrups);
        setMediaV(uniqueGrups);

        const anyDocs = uniqueGrups.some((g) => g.fotos?.length > 0);
        const anyDocsV = uniqueGrups.some((g) => g.videos?.length > 0);
        setSiDocs(anyDocs);
        setSiDocsV(anyDocsV);
        //console.log('anyDocs - '+ anyDocs + 'anyDocsV - '+ anyDocsV)
        // 🔸 Guardem al cache
        localStorage.setItem(cacheKey, JSON.stringify(uniqueGrups));
        //console.log("💾 Dades guardades a cache:", basePath);
      } catch (err) {
        console.error("❌ Error llistant subcarpetes:", err);
        setError("Error carregant les carpetes");
      }
    };

    // 🔸 Només executem si tenim les dades necessàries
    if (!c01 || !c02) return;

    if (primerP === "M") {
      localStorage.setItem("c00_ident", "A");
    }

    fetchAllMedia();
  }, [c01, c02, primerP]);
// **************************************************** 
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

  function VeureVideos(index) {
    localStorage.setItem('Proces025', mediaV[index].carpeta);
    localStorage.setItem('Programa', '/Pantalla05');
    console.log(mediaV[index].carpeta)
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
  const basePath = `Familiar/${c01} ${c02}/${carpetaX}/`;

  function afegirAlLog(miss) {
    setLogEliminacio(prev => [...prev, miss]);
  }
  if (!carpetaX) {
      alert('❌ Cap carpeta seleccionada.');
    return;
  }
  if (!window.confirm(`Segur que vols eliminar la carpeta ?\n\n${basePath}`)) {
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
             const docRef = doc(db,'Familiar',  'famidoc_'+c99);
             await deleteDoc(docRef); 
             console.log('baixa -' + c99)  
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

    const filePath = `Familiar/${c01} ${c02}/${file.webkitRelativePath || file.name}`;
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
  function Ubicacio() { 
    
  } 
  function Mapa() { 
      localStorage.setItem('Mapa01', 'D');
      localStorage.setItem('Mapa04', c03);    
      localStorage.setItem('Mapa05', c13);      
      navigate('/WorldMap');      
  } 
  Benrera(Sacabat);
  return (
    <div>
     <div className="min-vh-100 bg-light d-flex align-items-center">
      <Container className='py-4 py-md-5'>
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Card className='shadow-sm border-0 rounded-4'>
                      <Card.Header className="text-center  fw-semibold
                                               bg-white border-0 pt-4">
                        {c01} - {c03}
                      </Card.Header>
                      <Card.Body>
                        <Form className='w-100'>
                          <Form.Group className=" align-items-center">
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
                                  <br></br>
                                <div className='nom-text3xP3' data-label="Persones:">
                                  <span className='Separa-cams1P3'>{c04}</span>
                                </div>
                                <div className='nom-text3xP3' data-label="Notes:">
                                  <span className='Separa-cams1P3'>{c05}</span>
                                </div>
                              </div>
                              <div className='cap303P3'>
                                <div className='nom-text3xP3' data-label="Dates :">
                                  <span className='Separa-cams1P3'>{c13}</span>
                                </div>
                               
                              </div>
                            </Form.Label>
                            )}
                          </Form.Group>
                 
                          {error && (
                            <div className="alert alert-danger mt-3 text-center">{error}</div>
                          )}
       
                          {siDocs && !error && (
                            <div className="text-center mt-3">... </div>
                          )} 
      
                       {media.length > 0 && (  
                        <>
                         <div className='d-flex nom-text3xP3'>Fotos disponibles</div>
                        <div className="
                                        cap3031P3">
                         
                         {media.map((grup, index) =>  {
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
                       </>
                       )}
                 {modDocs === false && siDocsV && (
                  <>
                  <div className='nom-text3xP3'>Videos disponibles</div>
                  <div className='cap3031P3'>
                  <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              
                   {mediaV.map((grup, index) => {
                        const primerDocV = grup.videos[0]; 
                        const nomCarpetaV = grup.carpeta || `Carpeta ${index + 1}`;
                        const numDocsV = grup.videos.length;
                       return (
                        <div key={index} className="text-center">
                          {primerDocV && (
                              <Button
                                variant="light"
                                onClick={() => VeureVideos(index)}
                                style={{ padding: 0, border: 'none' }}
                              >
                                   <img
                                   src={videoF}                               
                                  style={{
                                    maxWidth: '50px',
                                    
                                    objectFit: 'cover',
                                    borderRadius: '2px'
                                  }}
                                />
                              </Button>
                            )}
                            {numDocsV !== 0 && (
                            <div className="mt-1 small text-muted">
                              <strong>{nomCarpetaV} ({numDocsV})</strong>
                            </div>
                            )}
                          </div>
                        );
                       })}
                       </div>
                  </div>
                 </>
                )}  
                             
                     <div className=" justify-content-center mt-1">
                       <div className='d-flex gap-3'>
                          <Button variant="warning" size="sm" 
                              className="mb-2" onClick={Sacabat}>
                          Enrere
                          </Button>
                        {modDocs === false && administrador === 'Si' && (
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
                     </div>
                    <Button
                       onClick={Mapa}
                          variant="light"
                          className="P02B_map-button"
                       >
                      <img
                         src={mapa}
                        alt="Mapa"
                         className="P02B_map-image"
                       />
                        <span className="P02B_map-text">Veure ruta</span>
                     </Button>
  
                  
                    {siDocs === false && administrador === 'Si' && (
                      <Button variant="danger" size="sm" className="mb-2" 
                                               onClick={Baixa}>
                                                🗑️ Eliminar reg.
                      </Button>   
                    )}
                    {modDocs === true && malta === false  && administrador === 'Si' && (
                      <>
                      <div>
                        <Button variant="primary" size="sm" className="mb-2" 
                                                    onClick={AltaD}>
                                                     Alta carpeta Docs.
                        </Button>
                      </div>
                      </>
                    )} 
                    {baixa === true && administrador === 'Si' && (
                      <>
                      <div>
                        <Button variant="primary" size="sm" className="mb-2" 
                                                    onClick={BaixaC}>
                                                     Anula carpeta
                        </Button>
                      </div>
                      </>
                    )} 
          
                    {malta === true  && administrador === 'Si' && (
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
    </div>
  );
}
