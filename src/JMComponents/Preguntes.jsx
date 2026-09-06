 
import React, { useEffect, useState , useRef} from 'react';
import { Form, Button, Container, Navbar,  Row, Col, Card, CardBody} from "react-bootstrap";
//import "./JMAltaReg.css";
import { ref as refCar,
                listAll, getDownloadURL,
                getStorage, ref,
                uploadBytes } from 'firebase/storage'; 
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {storageCar, db } from '../firebaseLoc'; 
import { doc, updateDoc, 
          getDoc, setDoc,
          getDocs, collection, 
          query, orderBy, 
          limit  } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import Benrera from '../JMGlobal/Benrera';   
  
export default function Preguntes() {
  const [gravar, setGravar] = useState(0);  
  const [media, setMedia] = useState({grup1: {fotos: []}});
  const [inici, setInici] = useState(true);
  const [urlw, setUrlw] = useState('');  
  const [progresPercent, setProgresPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false); 

  const navigate=useNavigate();
  const [c99, setC99] = useState('')
  const [c00, setC00] = useState('');
  const [c01, setC01] = useState('');
  const [c02, setC02] = useState(''); 
 
  const [elements, setElements] = useState([]); 
  const fetchAllMedia = async () => {
    const grup1Path = `${localStorage.getItem('M_ident')}/${c02}-${c01}`;
    const grup1 = await fetchMedia(grup1Path);
    setMedia({ grup1 });
  };
  const fetchMedia = async (refPath) => {
    const normaPath = refPath;    
    const storageRef = refCar(storageCar, normaPath);
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
    if (inici === false) {return;}
    setInici(false);
    setC01('');
    setC02(''); 
    const fetchAllMediaI = async () => {
      console.log('a pel primer numero')
      try {
        const colRef = collection(db, 'Preguntes');
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
        setC99((numeroMesAlt + 1).toString().padStart(5, '0'));
        //setC99(numeroMesAlt + 1);
  
      } catch (error) {
        console.error("❌ Error en obtenir l'últim ID:", error);
      }
    };  
    fetchAllMediaI();  
  }, [inici]);
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
  const docRef = doc(db,'Preguntes',  'P'+c99);
  try {
    await setDoc(docRef, {
      codi: c99,
      pregunta: c01,
      resposta: c02       
  
    });
    console.log('registre actualitzat correctament');
    setGravar(0);
    setInici(true);
   } catch (error) {
    console.error('error al actualitzar registre :', error);
  }
  
  }
  const Mc01 = (event) => {
  setGravar(1);
  setC01(event.target.value); 
  setC00(event.target.value.substring(0, 6)+c99);
    }; 
  const Mc02 = (event) => {
  setGravar(1);
  setC02(event.target.value); 
  }; 
 
const fileInputRef = useRef(null);
async function uploadFiles() {
  
  const storage = getStorage();
  const fileInput = fileInputRef.current;
  
  const files = Array.from(fileInput.files);
  const total = files.length;
  let pujat = 0;
  setIsUploading(true);   
  setProgresPercent(0);   
  //  console.log('pasat punt 2');
  
}
function Sacabat() {    
  localStorage.setItem('Programa', '/Pantalla02');
  navigate('/Pantalla02');
}
Benrera(Sacabat);  
return (
  <>  
  <div>
 <Container>
  <Row>
    <Col md={7}>
      <Card className="doc-card0">
        <Card.Body>
          <div className="doc-header">
            codi :&nbsp;{c99} &nbsp;- 
          </div>
       </Card.Body> 
      </Card>
      <Card className="doc-card">
        <Card.Body>   
          <div className="doc-group">
            <div className="doc-label">Pregunta :</div>
            <textarea
              value={c01}
              onChange={Mc01}
              rows="1"
              className="doc-input"
            />
          </div>
            <div className="doc-group">
            <div className="doc-label">Resposta :</div>
            <textarea
              value={c02}
              onChange={Mc02}
              rows="1"
              className="doc-input"
            />
          </div>
          
         </Card.Body>
        </Card>
         
        <Card className="doc-card">          
         <Card.Body>
      
          <br></br>
          <div className="doc-buttons">
            <Button onClick={Sacabat}>
              Enrere
            </Button>

            {gravar === 1 && (
              <Button onClick={altaDoc}>
                 Gravar registre
              </Button>
            )}
          </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
 
</div>
  </>  
);
}; 
