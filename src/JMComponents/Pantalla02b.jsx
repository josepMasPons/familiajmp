import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Nav, Col, Card, Button } from "react-bootstrap";
import { collection, getDocs } from 'firebase/firestore';
import "./Pantalla02b.css";
import {db } from '../firebaseLoc';
import mapa from '../fotos/mapa.jpg';
import Benrera from '../JMGlobal/Benrera';

function Pantalla02b() { 
  const navigate=useNavigate(); 
  const [mapaG, setMapaG] = useState([]);
  const [mapa1, setMapa1] = useState([]);
  const [mapaSit, setMapaSit] = useState('0');
  const [anyx, setAnyx] = useState(localStorage.getItem('Proces051') || '');
  const [paraulax, setParaulax] = useState(localStorage.getItem('Proces052') || '');
  const [data, setData] = useState([]);
  const [direct1, setDirect1] = useState(localStorage.getItem('Mapa99') || '');
  const [directS, setDirectS] = useState(false);
   const [filaSel, setFilaSel] = useState(null);
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const [itemsPerPage, setItemsPerPage] = useState(1500);
  const [mapes, setMapes] = useState([]);
  const currentItems=data.slice(0, itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;
  const paddedItems = [...currentItems, ...Array(emptyRows).fill({ temp: '.', nom: ' ', codi: 'empty' })];
 
 useEffect(() => {
    if (direct1=== '' || direct1 === null
                      || directS === false) return;
     //console.log('directe a pantalla03 - ', direct1);
     const numeroX = direct1.substring(6, 10); 
     //console.log('numero X - '+ direct1)   
     const indexW = data.findIndex(item => {
     if (!item?.id) return false;
     const numeroY = item.id.slice(-4);
     //console.log('numero Y - '+ numeroY)
    return numeroX === numeroY;
    });
    if (indexW === -1) {
      console.warn('No s’ha trobat coincidència per', numeroX);
    return;
    }
    //console.log('coincidència trobada:',numeroX,'- index:',indexW );
    localStorage.setItem('Mapa99', '');
    handleCellClick(indexW);
   }, [directS, direct1, data]); 

   // useEffect per guardar elspunts de mapa a Mapa1 (mapaSit = 0)
  useEffect(() => {   
      const carregarmapa = async () => {
        try {
         const linksCollectionM = collection(db, 'Mapes');
        const querySnapshotM = await getDocs(linksCollectionM);
       
        const linksMapa = querySnapshotM.docs.map(doc => ({
          id: doc.id,          // ← nom del document
          ...doc.data()        // ← tots els camps
        }));
        //console.log('1 - Mapes carregats:', );
        setMapa1(linksMapa);
        setMapaSit('2');
      } catch (error) {
        console.error('Error llegint mapes: ', error);
      }     
    };
  
   const seleccmapa = () => {
   try {
    const mapaGSet = new Set(mapaG);
    //console.log(Object.keys(mapa1));
    const filteredMapa = mapa1.filter(item => {
      const parts = item.id.split('_');   
      const baseId = parts[1];  
     // console.log(Object.keys(parts));

      //console.log('url4 - '+ baseId + ' - '+ item.c13_url4)          
      return mapaGSet.has(baseId);
    });
    //console.log(filteredMapa);
    setMapes(filteredMapa);
    setMapaSit('3');

    //console.log('Mapes seleccionats:', filteredMapa.length);
  } catch (e) {
    console.error(e);
   }
  };

    const grabamapa = async () => {     
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('Mapa02:') || key.startsWith('Mapa03:')) {
            localStorage.removeItem(key);
          }
        });
        localStorage.setItem('Mapa02', 'GEN');
        if (mapes.length > 0) {
          mapes.forEach(mapa => {
            if (mapa.id.endsWith('_01')) {
            //if (mapa.id.includes('_01')) {
            const mapaString = JSON.stringify(mapa);
          //  console.log('Document mapa ==:', mapa.id+' - '+mapaString);
            localStorage.setItem('Mapa03:' + mapa.id, mapaString);
            }
          });
        }
        //console.log('4- grabar a localstorage:');
      } catch (error) {
        console.error('Error seleccionant mapes: ', error);
      }     
    };
      if (mapaSit === '1') {   
         carregarmapa();
      }
      if (mapaSit === '2') {   
         seleccmapa();
      }
      if (mapaSit === '3') {
          grabamapa();
      }
   }, [mapaSit]);
 
 // pas primer   mapaSit de 0 a 1 ***********
  useEffect(() => {
    const fetchData = async () => {
    const linksCollection = collection(db, 'Familiar');      
    try {         
      const querySnapshot = await getDocs(linksCollection);
      const linksData = querySnapshot.docs.map(doc => ({
          id: doc.id,                  codi: doc.data().c00_codi,
          temp: doc.data().c01_temp,   obrac: doc.data().c02_obrac,
          nom: doc.data().c03_nom,     ubic: doc.data().c04_ubic,
          notes: doc.data().c05_notes, nvimeo1: doc.data().c06_nvimeo1,
          url1: doc.data().c07_url1,   nvimeo2: doc.data().c08_nvimeo2,
          url2: doc.data().c09_url2,   nvimeo3: doc.data().c10_nvimeo3,
          url3: doc.data().c11_url3,   nvimeo4: doc.data().c12_nvimeo4,
          url4: doc.data().c13_url4,   director: doc.data().c14_director,
          dates: doc.data().c15_dates, repres: doc.data().c16_repres,
          espect: doc.data().c17_espect,presi: doc.data().c18_presi,
          preu: doc.data().c19_preu,   aforo: doc.data().c20_aforo,
          res: doc.data().c21_res,
          ...doc.data()
      }));
     const filteredData = linksData.filter(item => {
      const safeTrimmedValue = (value) =>
            value ? value.trim().toLowerCase() : "";  
      const isTempValid = item.temp && 
                          item.temp.includes(anyx.trim()) 
                          || anyx === '' 
                          || anyx === null || anyx.trim() === 'null';
      const isParaulaxValid = 
       removeAccents(safeTrimmedValue(item.nom))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.codi))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.ubic))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.notes))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.obrac))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.director))
         .includes(removeAccents(paraulax.toLowerCase())) ||
        paraulax === ''   ||
        paraulax === null || paraulax.trim() === 'null';
      return isTempValid && isParaulaxValid;
    });
     setData(filteredData);
     const ids = filteredData.map(item => {
        const num = item.id.split('_')[1]; 
        return String(num).padStart(4, '0');
     });         
     setMapaG(prev => {
           const nou = [...prev, ...ids];
             return [...new Set(nou)];             
     });
     setItemsPerPage(paddedItems.length);
     //console.log('0 - filtres seleccionats:', );
     setMapaSit('1');
     setDirectS(true);
    } catch (error) {
        console.error('Error llegint documents: ', error);
    }      
    let c00 = localStorage.getItem('Proces024');
  };
  fetchData();
  }, [anyx, paraulax]); 
  
  const handleCellClick = (index) => {  
      setFilaSel(index);
      //console.log('index ------'+ index)
     // const numero = parseInt(data[index]?.id.split('_')[1],10);  
      const numero = String(parseInt(data[index]?.id.split('_')[1], 10))
                           .padStart(4, '0'); 
      //console.log('5.1 - id ...... '+ numero) ;
      localStorage.setItem('Proces099', numero);  
      localStorage.setItem('Proces000', data[index]?.codi || '');      
      localStorage.setItem('Proces010', data[index]?.temp || '');
      localStorage.setItem('Proces011', data[index]?.obrac || '');
      localStorage.setItem('Proces012', data[index]?.nom || '');
      localStorage.setItem('Proces013', data[index]?.ubic || '');
      localStorage.setItem('Proces014', data[index]?.notes || '');
      localStorage.setItem('Proces015', data[index]?.nvimeo1 || '');
      localStorage.setItem('Proces016', data[index]?.url1 || '');  
      localStorage.setItem('Proces017', data[index]?.nvimeo2 || '');
      localStorage.setItem('Proces018', data[index]?.url2 || ''); 
      localStorage.setItem('Proces019', data[index]?.nvimeo3 || ''); 
      localStorage.setItem('Proces020', data[index]?.url3 || ''); 
      localStorage.setItem('Proces021', data[index]?.nvimeo4 || ''); 
      localStorage.setItem('Proces022', data[index]?.url4 || ''); 

      localStorage.setItem('Proces114', data[index]?.director || ''); 
      localStorage.setItem('Proces115', data[index]?.dates || ''); 
      localStorage.setItem('Proces116', data[index]?.repres || ''); 
      localStorage.setItem('Proces117', data[index]?.espect || ''); 
      localStorage.setItem('Proces118', data[index]?.presi || ''); 
      localStorage.setItem('Proces119', data[index]?.preu || ''); 
      localStorage.setItem('Proces120', data[index]?.aforo || ''); 

      localStorage.setItem('Proces023', data[index]?.res || ''); 
      localStorage.setItem('Proces024', 'Proces02');
      localStorage.setItem('c00_ident', 'M'); 
      localStorage.setItem('Programa', '/Pantalla03');              
      navigate('/Pantalla03')} 
  function Sacabat() {  
     if (localStorage.getItem('PassMail') === 'invitat@cpsv.com') 
      {
        localStorage.setItem('Programa', '/JMLogin');
        navigate('/JMLogin');
      }  else {
        localStorage.setItem('Programa', '/Pantalla02');
        navigate('/Pantalla02');
      }
  }      
  function Mapa() { 
      localStorage.setItem('Mapa01', 'G'); 
      localStorage.setItem('Mapa04', '');
       navigate('/WorldMap');     
  }      
  Benrera(Sacabat);  
  return (    
  <div className="P02b_center-contentP2">
  <Card.Header className="P02B_my-fs5 
                          P02B_my-fw-bold">
          Racó familiar
  </Card.Header>
  <Container className="P02B_my-mt5">
    <Row className="P02B_my-justify-center">
      <Col md={8}>
        <Card>
          <Card.Header className="P02B_my-fs5 
                                  P02B_my-fw-bold">
            Registres seleccionats
          </Card.Header>
          <Card.Body>
            <div className="P02B_table-responsiveP2">
              <table className="P02B_BtablaP2">
                <thead>
                  <tr>
                    <th >Any/Mes</th>
                    <th >Obra</th>
                  </tr>
                </thead>
                <tbody>
                  {paddedItems
                    .map((item, originalIndex) => ({ ...item, originalIndex }))
                    .filter(item => item.codi && item.codi !== 'empty')
                    .sort((a, b) => b.temp.localeCompare(a.temp))
                    .map((item) => (
                      <tr
                        key={item.originalIndex}
                        onClick={() => handleCellClick(item.originalIndex)}
                        style={{
                          backgroundColor: filaSel === item.originalIndex ? 'yellow' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <td className="P02B_BTablaP2-temp">{item.temp}</td>
                        <td className="P02B_BTablaP2-nom">{item.nom}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
          <div >
            <Button className="mb-2"  
              size='sm'                         
              variant="warning"
              onClick={Sacabat}>
                   Enrere
            </Button>
         
             <div className="     P02B_my-flex
                               P02B_my-justify-center 
                                ">
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
                   <span className="P02B_map-text">Veure mapa</span>
              </Button>

          </div>

          </div>
        </Card>
      </Col>
    </Row>
  </Container>
</div>
  );
}
export default Pantalla02b;