 
import React, { useEffect, useState , useRef} from 'react';
import { Form, Button, Container, Navbar,  Row, Col, Card, CardBody} from "react-bootstrap";
//import "./JMAltaReg.css";
 
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getBytes
} from "firebase/storage";
 

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import imageCompression from 'browser-image-compression';

import {storageCar, db } from '../../firebaseLoc'; 

import { doc, updateDoc, 
          getDoc, setDoc,
          getDocs, collection, 
          query, orderBy, 
          limit  } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
    
  
export default function JMAltaReg() {
  const [gravar, setGravar] = useState(0);  
  const [nivells, setNivells] = useState(0);
  const [media, setMedia] = useState({grup1: {fotos: []}});
  const [urlw, setUrlw] = useState('');  
  const [progresPercent, setProgresPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false); 

  const navigate=useNavigate();
  const [c99, setC99] = useState('')
  const [c00, setC00] = useState('');
  const [c01, setC01] = useState('');
  const [c02, setC02] = useState(''); 
  const [c03, setC03] = useState('');
  const [c04, setC04] = useState(''); 
  const [c05, setC05] = useState('');
  const [c06, setC06] = useState(''); 
  const [c07, setC07] = useState('');
  const [c08, setC08] = useState(''); 
  const [c09, setC09] = useState(''); 
  const [c10, setC10] = useState('');
  const [c11, setC11] = useState(''); 
  const [c12, setC12] = useState('');
  const [c13, setC13] = useState(''); 
  const [c14, setC14] = useState('');
  const [c15, setC15] = useState(''); 
  const [c16, setC16] = useState('');
  const [c17, setC17] = useState(''); 
  const [c18, setC18] = useState('');
  const [c19, setC19] = useState(''); 
  const [c20, setC20] = useState('');
  const [c21, setC21] = useState('******'); 
  
  const [fitxer, setFitxer] = useState('');
  const [pujat, setPujat] = useState(0);
  const [total, setTotal] = useState(0);

 
  const [elements, setElements] = useState([]); 
 
  const fetchMedia = async (refPath) => {
    const normaPath = refPath;    
    const storageRef = ref(storageCar, normaPath);
    try {
      const resultat = await listAll(storageRef);
      const elements = await Promise.all(
        resultat.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            const ext = itemRef.name.split('.').pop().toLowerCase();
            return { url: url, name: itemRef.name, type: ext };
            
          } catch (error) {
            console.error('Error en obtenir l\'URL de descàrrega per a l\'ítem:', itemRef, error);
            return null;  }
        })
      );
      setElements(elements);
      const filteredUrls = elements.filter(item => item !== null);
      const fotos = filteredUrls.filter(item => 
        item.name.toLowerCase().endsWith('.jpg') ||
        item.name.toLowerCase().endsWith('.jpeg') ||
        item.name.toLowerCase().endsWith('.png')  ||
        item.name.toLowerCase().endsWith('.pdf') 
      );
      return { fotos};
    } catch (error) {
      console.error("Error en obtenir l'URL de descàrrega:", error);
      return { fotos: []};
    }
  }; 
  useEffect(() => {
    const fetchAllMediaI = async () => {
      console.log('a pel primer numero')
      try {
        const colRef = collection(db, 'Familiar');
        const querySnapshot = await getDocs(colRef);
  
        if (querySnapshot.empty) {
          console.warn("⚠ No s'ha trobat cap document a Familiar.");
          return;
        }
        let firstC00 = Infinity;
  
        // Convertir a array i ordenar per número final de l'ID
        const docsOrdenats = querySnapshot.docs
          .map((doc) => {
            const match = doc.id.match(/\d+$/); 
            // Captura el número final
            return match ? { id: doc.id, numero: parseInt(match[0], 10) } : null;
          })
          .filter(Boolean) // Elimina els nulls (documents sense número)
          .sort((a, b) => a.numero - b.numero); // Ordena ascendent
  
        
        const numeroN = docsOrdenats.map(doc => doc.numero);

        const numeroMesBaix = Math.min(...numeroN);
        const numeroMesAlt = Math.max(...numeroN);
        console.log('Num. possible primer - ' 
                          + ' - ' + (numeroMesBaix - 1) + ' - '+
                                    (numeroMesAlt + 1) );
        setC99((numeroMesAlt + 1).toString().padStart(4, '0'));
        //setC99(numeroMesAlt + 1);
  
      } catch (error) {
        console.error("❌ Error en obtenir l'últim ID:", error);
      }
    };  
    fetchAllMediaI();  
  }, []);
  
    
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
  
  const grups = [media.grup1];
  const handleSelect = (selectedIndex) => { 
    setUrlw(elements[selectedIndex].url);    
    const selectedType = elements[selectedIndex].type;
  };
  const altaDoc = async () => {
  if (!c99) {
    console.error('no s ha trobat  id del document');
    return;
  }
  const docRef = doc(db,'Familiar',  'famidoc_'+c99);
  try {
    await setDoc(docRef, {
      c00_codi: c00,
      c01_temp: c01,
      c02_obrac: c02,
      c03_nom: c03,
      c04_ubic: c04,
      c05_notes: c05,
      c06_nvimeo1: c06,
      c07_url1: c07,
      c08_nvimeo2: c08,
      c09_url2: c09,
      c10_nvimeo3: c10,
      c11_url3: c11,
      c12_nvimeo4: c12,
      c13_url4: c13,
      c14_director: c14,
      c15_dates: c15,
      c16_repres: c16,
      c17_espect: c17,
      c18_presi: c18,
      c19_preu: c19,
      c20_aforo: c20
    });
    console.log('registre actualitzat correctament');
    setNivells(1)
    setGravar(0);
   } catch (error) {
    console.error('error al actualitzar registre :', error);
  }}
  
  const Mc01 = (event) => {
   if (c03 != '' && c02 != '') {
   setGravar(1);
  }
  setC01(event.target.value); 
  setC00(event.target.value.substring(0, 4)+c99);
    }; 
  const Mc02 = (event) => {
   if (c01 != '' && c03 != '') {
    setGravar(1);
  }  
  setC02(event.target.value); 
  }; 
  const Mc03 = (event) => {
  if (c01 != '' && c02 != '') {
    setGravar(1);
  }
  setC03(event.target.value); 
}; 
const Mc04 = (event) => {  
  setC04(event.target.value); 
}; 
const Mc05 = (event) => {  
  setC05(event.target.value); 
}; 
const Mc06 = (event) => { 
  setC06(event.target.value); 
}; 
const Mc07 = (event) => {
  setC07(event.target.value); 
}; 
const Mc08 = (event) => {   
  setC08(event.target.value); 
}; 
const Mc09 = (event) => {   
  setC09(event.target.value); 
}; 
const Mc10 = (event) => {  
  setC10(event.target.value); 
}; 
const Mc11 = (event) => {  
  setC11(event.target.value); 
}; 
const Mc12 = (event) => {   
  setC12(event.target.value); 
}; 
const Mc13 = (event) => {  
  setC13(event.target.value); 
}; 
const Mc14 = (event) => {   
  setC14(event.target.value); 
}; 
const Mc18 = (event) => {   
  setC18(event.target.value); 
}; 

const videoData = {
  video1: { value: c06, onChange: Mc06 },
  video2: { value: c08, onChange: Mc08 },
  video3: { value: c10, onChange: Mc10 },
  video4: { value: c12, onChange: Mc12 },
};

const urlData = {
  url1: { value: c07, onChange: Mc07 },
  url2: { value: c09, onChange: Mc09 },
  url3: { value: c11, onChange: Mc11 },
  url4: { value: c13, onChange: Mc13 },
};
const fileInputRef = useRef(null);
async function uploadFiles() {
  
  const storage = getStorage();
  const fileInput = fileInputRef.current;
  if (!fileInput || fileInput.files.length === 0) {
    alert('No has seleccionat cap carpeta ni arxiu');
    return;
  }
  const files = Array.from(fileInput.files);
  const total = files.length;
  let pujat = 0;
  setIsUploading(true);   
  setProgresPercent(0);   
  //  console.log('pasat punt 2');
  for (const file of files) {
    let fileToUpload = file;

    // ✅ Si és una imatge JPG/JPEG, comprimim abans de pujar
    //!!! si es modifiquen els paràmetres fer-ho tambè a PANTALLA03.jsx
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
          localStorage.setItem('Proces099', c99);  
          localStorage.setItem('Proces010', c01);  
          localStorage.setItem('Proces011', c02);   
          localStorage.setItem('Proces012', c03);
          localStorage.setItem('Proces013', c04);
          localStorage.setItem('Proces014', c05);
          localStorage.setItem('Proces015', c06);
          localStorage.setItem('Proces016', c07);
          localStorage.setItem('Proces017', c08);
          localStorage.setItem('Proces018', c09);
          localStorage.setItem('Proces019', c10);
          localStorage.setItem('Proces020', c11); 
          localStorage.setItem('Proces021', c12);
          localStorage.setItem('Proces022', c13);
          localStorage.setItem('Proces114', c14);
          localStorage.setItem('Proces115', c15);
          localStorage.setItem('Proces116', c16);
          localStorage.setItem('Proces117', c17);
          localStorage.setItem('Proces118', c18);
          localStorage.setItem('Proces119', c19);
          localStorage.setItem('Proces120', c20); 
          localStorage.setItem('Proces000', c00);
          console.log("✅✅ Fi pujada.");
          alert("✅ Fi de la pujada!");
          localStorage.setItem('Programa', '/Pantalla03');
          navigate('/Pantalla03');
        }
    } catch(error) {
        console.error('❌ Error al pujar el fitxer:', error);
      };
  };
}

const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      setFitxer(fileList);
    }
  };
function Sacabat() {    
  localStorage.setItem('Programa', '/Pantalla02');
  navigate('/Pantalla02');
}  
return (
  <>  
  <div>
    <Container className='mt-4'>
      <Card.Header className="P02B_my-fs5 
                                P02B_my-fw-bold">
                Alta de Registre
        </Card.Header>
      <Row className='justify-content-center text-start'>
        <Col xs={12} md={10} lg={10}>
           <Card>
             <Card.Body>
                <Row className='mb-3 p-2  bg-light border rounded'>
                  <Row className='mb-1'>
                   <Col xs={5} md={4} className='fw-bold'> 
                       Num.Ordre 
                   </Col>
                   <Col xs={7} md={8} className='fw-bold'>
                       {c99}
                   </Col> 
                   <Col xs={5} md={4} className='fw-bold'>    
                        Doc.
                   </Col> 
                   <Col xs={5} md={4} className='fw-bold'>  
                        {c00}
                   </Col>
                  </Row>
               </Row>               
               <Form>
                <Form.Group as={Row} className='mb-2 align-items-center'>
                  <Form.Label column xs={12} md={3} className='fw-bold'>
                     Títol
                  </Form.Label>
                  <Col xs={12} md={9}>
                   <Form.Control
                     type="text"
                     value={c03}
                     onChange={Mc03}
                   />
                  </Col> 
                  <Form.Label column xs={12} md={3} className='fw-bold'>
                     Any-Mes
                  </Form.Label>
                  <Col xs={12} md={9}>
                   <Form.Control
                     type="text"
                     placeholder="Ex: 2024-25"
                     value={c01}
                     onChange={(e) => {
                        const valor = e.target.value;
                        if (/^\d{0,4}(-\d{0,2})?$/.test(valor)) {
                           Mc01(e);
                        }
                      }}
                      maxLength="7"
                      className={`doc-input small-input ${
                         /^\d{4}-\d{2}$/.test(c01) ?
                            'valid-input' : 'invalid-input'
                          }`}
                      title="Format correcte: 2024-25"
                     />                  
                  </Col> 
                   <Form.Label column xs={12} md={3} className='fw-bold'>
                     Doc.
                  </Form.Label>
                  <Col xs={12} md={9}>
                   <Form.Control
                     type="text"
                     value={c02}
                     onChange={Mc02}
                   />
                  </Col> 
                  </Form.Group>
               </Form>
              </Card.Body> 
            </Card>
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group as={Row} className='mb-2 align-items-center'>
                  <Form.Label column xs={12} md={3} className='fw-bold'>
                     Persones
                  </Form.Label>
                  <Col xs={12} md={9}>
                   <Form.Control
                     type="text"
                     value={c04}
                     onChange={Mc04}
                   />
                  </Col>  
                  <Form.Label column xs={12} md={3} className='fw-bold'>
                     Notes
                  </Form.Label>
                  <Col xs={12} md={9}>
                   <Form.Control
                     as="textarea"
                     rows='3'
                     value={c05}
                     onChange={Mc05}
                   />
                  </Col> 
                  <Form.Label column xs={12} md={3} className='fw-bold'>
                     Dates
                  </Form.Label>
                  <Col xs={12} md={9}>
                   <Form.Control
                     type="text"
                     value={c13}
                     onChange={Mc13}
                   />
                  </Col> 
                  </Form.Group>
               </Form>
             </Card.Body> 
           </Card>
        
           <Card className="doc-card">          
         <Card.Body> 

          <br></br>
           <div className="d-flex gap-3 justify-content-center">
            <Button 
                variant='warning'
                className="mb-2"
                size='sm'              
                onClick={Sacabat}>
              Enrere
            </Button>
            {gravar === 1 && (
              <Button 
                variant='primary'
                className="mb-2"
                size='sm'               
                 onClick={altaDoc}>
                Gravar registre
              </Button>
            )}
          </div>
          <Form.Label><strong></strong></Form.Label>
             {nivells === 1 && (
               <>
                 <div>    
                   <div className="nom-text2m1MA">
                   Pujar a Firebase Storage ... /{c01} {c02}/...
                   </div> 
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
                {total > 0 && (
                 <div className="mt-2 text-center small text-muted">
                    Pujats: {pujat} / {total}
                  </div>
                )}
               <div className="d-flex justify-content-end">
               {fitxer !== '' && (
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
                    <progress value={progresPercent}
                         max="100" style={{ width: '100%' }} />
                  </div>
                )} 
              </div>
              </>
             )}       
        
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
 
</div>
  </>  
);
}; 
