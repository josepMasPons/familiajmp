import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Navbar,  Row, Col, Card} from "react-bootstrap";
//import "./JMManten.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {storageCar, db } from '../../firebaseLoc'; 
import { doc, updateDoc, getDoc,         
         getDocs, collection} from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';  

export default function JMManten() {
  const [gravar, setGravar] = useState(0);
  const [sw01, setSw01] = useState(0);
  const [data, setData] = useState([]);
  const [media, setMedia] = useState({grup1: {fotos: []}});
  const [urlw, setUrlw] = useState('');  
  const [swreturn, setSwreturn] = useState(0);
  const navigate=useNavigate();
  const [mapes, setMapes] = useState([]);
 
  const [c99, setC99] = useState(localStorage.getItem('Proces099'));
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
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const [elements, setElements] = useState([]); 
  // ************ us esporàdic **********
  /* useeffect per actualitza el cam M05 a partir de c13:url4
  useEffect(() => {
   const actualitzaMapes = async () => {
    try {
      // 1️⃣ Llegir tota la col·lecció Mapes
      const mapesSnap = await getDocs(collection(db, 'Mapes'));

      for (const mapesDoc of mapesSnap.docs) {
        const mapesId = mapesDoc.id; // ex: Mapes_0001_01
        // 2️⃣ Extreure el número de 4 xifres
        // Mapes_0001_01 → 0001
        const parts = mapesId.split('_');
        if (parts.length < 3) continue;
        const num4 = parts[1]; // '0001'
        // 3️⃣ Buscar el document Familiar corresponent
        const famDocId = `famidoc_${num4}`;
        const famRef = doc(db, 'Familiar', famDocId);
        const famSnap = await getDoc(famRef);

        if (!famSnap.exists()) {
          console.warn('No existeix:', famDocId);
          continue;
        }
        // 4️⃣ Extreure c13_URL4
        const { c13_url4 } = famSnap.data();
        if (!c13_url4) {
          console.warn('Sense c13_url4:', famDocId);
          continue;
        }
        // 5️⃣ Actualitzar / crear el camp M05 a Mapes
        await updateDoc(doc(db, 'Mapes', mapesId), {
          M05: c13_url4
        });
        console.log(`✔ Actualitzat ${mapesId} → M05`);
      }
      console.log('✅ Procés finalitzat');
    } catch (error) {
      console.error('❌ Error actualitzant Mapes:', error);
    }
  };
  actualitzaMapes();
}, []);
*/
  useEffect(() => {
    if (sw01 === 1) {
      setSwreturn(1);
    }
  }, [sw01]);  
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

 useEffect(() => {    
 const fetchData = async () => {
  const linksCollection = collection(db, 'Familiar');
  const querySnapshot = await getDocs(linksCollection);
  const linksData = querySnapshot.docs.map(doc => {
      const data = doc.data();
   
      return {
        ide:doc.id.match(/_(\d+)/),
        codi: data?.c00_codi || '',
        temp: data?.c01_temp,
        obrac: data?.c02_obrac,
        nom: data?.c03_nom,
        ubic: data?.c04_ubic,
        notes: data?.c05_notes,
        nvimeo1: data?.c06_nvimeo1,
        url1: data?.c07_url1,
        nvimeo2: data?.c08_nvimeo2,
        url2: data?.c09_url2,
        nvimeo3: data?.c10_nvimeo3,
        url3: data?.c11_url3,
        nvimeo4: data?.c12_nvimeo4,
        url4: data?.c13_url4,
        director: data?.c14_director,
        dates: data?.c15_dates,
        repres: data?.c16_repres,
        espect: data?.c17_espect,
        presi: data?.c18_presi,
        preu: data?.c19_preu,
        aforo: data?.c20_aforo,
    };
   }); 
    setData(linksData);
        
    for (let x = 0; x < linksData.length; x++) {
      const {1:numero} = (linksData[x].ide);  
      if (c99 == numero) {
        //console.log('trobat'+ numero);
        setC00(linksData[x].codi || '')
        setC01(linksData[x].temp || '');
        setC02(linksData[x].obrac || '');
        setC03(linksData[x].nom || '');
        setC04(linksData[x].ubic || '');
        setC05(linksData[x].notes || '');
        setC06(linksData[x].nvimeo1 || '');
        setC07(linksData[x].url1 || '');
        setC08(linksData[x].nvimeo2 || '');
        setC09(linksData[x].url2 || '');      
        setC10(linksData[x].nvimeo3 || '');
        setC11(linksData[x].url3 || '');   
        setC12(linksData[x].nvimeo4 || '');
        setC13(linksData[x].url4 || '');  
        setC14(linksData[x].director || '');
        setC15(linksData[x].dates || '');  
        setC16(linksData[x].repres || '');
        setC17(linksData[x].espect || '');  
        setC18(linksData[x].presi || '');
        setC19(linksData[x].preu || '');  
        setC20(linksData[x].aforo || '');
       
     }};
     console.log('useeffect -'+ c99 +  ' - '+ c03)
  };
 fetchData();
}, [c99]);

const gravarDoc = async () => {
  if (!c99) {
    console.error('no s ha trobat  id del document');
    return;
  }
  const docRef = doc(db,'Familiar',  'famidoc_'+c99);
  try {
    await updateDoc(docRef, {
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
      localStorage.setItem('Proces023', c21);
         
    setGravar(0);
  } catch (error) {
    console.error('error al actualitzar registre :', error);
  } 
 };
const Mc01 = (event) => {
  setGravar(1);
  setC01(event.target.value); 
}; 
const Mc02 = (event) => {
  setGravar(1);
  setC02(event.target.value); 
}; 
const Mc03 = (event) => {
  setGravar(1);
  setC03(event.target.value); 
}; 
const Mc04 = (event) => {
  setGravar(1);
  setC04(event.target.value); 
}; 
const Mc05 = (event) => {
  setGravar(1);
  setC05(event.target.value); 
}; 
const Mc06 = (event) => {
  setGravar(1);
  setC06(event.target.value); 
}; 
const Mc07 = (event) => {
  setC07(event.target.value); 
}; 
const Mc08 = (event) => {
  setGravar(1);
  setC08(event.target.value); 
}; 
const Mc09 = (event) => {
  setGravar(1);
  setC09(event.target.value); 
}; 
const Mc10 = (event) => {
  setGravar(1);
  setC10(event.target.value); 
}; 
const Mc11 = (event) => {
  setGravar(1);
  setC11(event.target.value); 
}; 
const Mc12 = (event) => {
  setGravar(1);
  setC12(event.target.value); 
}; 
const Mc13 = (event) => {
  setGravar(1);
  setC13(event.target.value); 
}; 
const Mc14 = (event) => {
  setGravar(1);
  setC14(event.target.value); 
}; 
const Mc15 = (event) => {
  setGravar(1);
  setC15(event.target.value); 
}; 
const Mc16 = (event) => {
  setGravar(1);
  setC16(event.target.value); 
}; 
const Mc17 = (event) => {
  setGravar(1);
  setC17(event.target.value); 
}; 
const Mc18 = (event) => {
  setGravar(1);
  setC18(event.target.value); 
}; 
const Mc19 = (event) => {
  setGravar(1);
  setC19(event.target.value); 
}; 
const Mc20 = (event) => {
  setGravar(1);
  setC20(event.target.value); 
};
function Sacabat() {  
  localStorage.setItem('c00_ident', 'F'); 
  localStorage.setItem('Proces099', c99);      
  localStorage.setItem('Programa', '/Pantalla03');
  navigate('/Pantalla03');
} 
function Mapes() {  
  localStorage.setItem('c00_ident', 'F'); 
  localStorage.setItem('Programa', '/WorldMap');
  localStorage.setItem('Mapa01', 'M'); 
  localStorage.setItem('Mapa04', c03);       
  navigate('/WorldMap');

}
 useEffect(() => {
  const buscarmapa = async () => {
    try {
      const linksCollectionM = collection(db, 'Mapes');
      const querySnapshotM = await getDocs(linksCollectionM);

      const linksMapa = querySnapshotM.docs.map(doc => ({
        id: doc.id,          // ← nom del document
        ...doc.data()        // ← tots els camps
      }));
      //console.log('Mapes carregats:', );     
      const c99str = String(c99).padStart(4, '0');      
      const filteredMapa = linksMapa.filter(item =>
         item.id.includes(c99str)
      );


      setMapes(filteredMapa);

    } catch (error) {
      console.error('Error llegint mapes: ', error);
    }
   
  };
  buscarmapa();
}, [c99]);

useEffect(() => {
  //console.log('display mapes ----' + mapes.length + '-c99 = ' + c99);
  //   a esborrar si es vol que no inicialitzi localstorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('Mapa02:') || key.startsWith('Mapa03:')) {
      localStorage.removeItem(key);
    }
  });
  localStorage.setItem('Mapa02', c99);
  if (mapes.length > 0) {
    mapes.forEach(mapa => {
      const mapaString = JSON.stringify(mapa);
      console.log('Document mapa ==:', mapa.id);
      localStorage.setItem('Mapa03:' + mapa.id, mapaString);
    });
  }
}, [mapes]);
return (
  <>  
    <Container className="mt-4">
       <Card.Header className="P02B_my-fs5 
                                      P02B_my-fw-bold">
                      Modificar registre
              </Card.Header>
      <Row className="justify-content-center text-start">
        <Col xs={12} md={10} lg={10}>
          <Card>
            <Card.Body>
              {/* CAPÇALERA */}
          <Row className="mb-3 p-2 bg-light border rounded">
            <Row className="mb-1">
              <Col xs={5} md={4} className="fw-bold">
                  Num. Ordre
              </Col>
              <Col xs={7} md={8} className="text-break">
                  {c99}
              </Col>
            </Row>
          <Row className="mb-1">
              <Col xs={5} md={4} className="fw-bold">
                  Document
              </Col>
              <Col xs={7} md={8} className="text-break">
                  {c00}
              </Col>
          </Row>
          <Row className="mb-1">
              <Col xs={5} md={4} className="fw-bold">
                  Any / Mes
              </Col>
              <Col xs={7} md={8} className="text-break">
                  {c01}
              </Col>
          </Row>
          <Row>
            <Col xs={5} md={4} className="fw-bold">
                Ubic. Doc
            </Col>
            <Col xs={7} md={8} className="text-break">
                {c02}
            </Col>
            </Row>
          </Row>
              {/* FORMULARI */}
          <Form>
                <Form.Group as={Row} className="mb-2 align-items-center">
                  <Form.Label column xs={12} md={3} className="fw-bold">
                    Títol
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      type="text"
                      value={c03}
                      onChange={Mc03}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-2 align-items-center">
                  <Form.Label column xs={12} md={3} className="fw-bold">
                    Persones
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={c04}
                      onChange={Mc04}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-2">
                  <Form.Label column xs={12} md={3} className="fw-bold">
                    Notes
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={c05}
                      onChange={Mc05}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column xs={12} md={3} className="fw-bold">
                    Dates
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={c13}
                      onChange={Mc13}
                    />
                  </Col>
                </Form.Group>

              </Form>

              {/* BOTONS */}
              <Row className="mt-3 g-2">
                <Col xs="auto">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={Sacabat}
                  >
                    Enrere
                  </Button>
                </Col>

                {gravar === 1 && (
                  <Col xs="auto">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={gravarDoc}
                    >
                      Gravar registre
                    </Button>
                  </Col>
                )}

                <Col xs="auto">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={Mapes}
                  >
                    Modificar mapes
                  </Button>
                </Col>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </>  
);

}; 
    