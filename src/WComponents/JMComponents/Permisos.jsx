// -------  Versió   per base de dades SANTVIFLIX -----------------
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card} from "react-bootstrap";
import "./Permisos.css";
import { ref as refCar, listAll, getDownloadURL, uploadBytesResumable } from 'firebase/storage'; 
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {storageCar, db } from '../../firebaseLoc'; 
import { doc, updateDoc, 
          getDoc, setDoc,
          getDocs, collection, 
          query, orderBy, 
          limit  } from 'firebase/firestore'; 
import { deleteObject } from 'firebase/storage'; 
import { useNavigate } from 'react-router-dom';
 
export default function JMAltaKey() {
  const navigate=useNavigate();
  const [data, setData] = useState([]);   
  const [alta, setAlta] = useState(false);
  const [modificacio, setModificacio] = useState(false); 
  const [xclase, setXclase] = useState('');
  const [mcodi, setMcodi] = useState('');
  const [inip, setInip] = useState(false);
  const [xcodi, setXcodi] = useState('');
  const [xmail, setXmail] = useState('');
  const [vmail, setVmail] = useState('');    
  const [xnotes, setXnotes] = useState('');  
  const [xpassword, setXpassword] = useState('');
  const [valida, setValida] = useState('false');  
    
  const canviClase = (event) => {
    setXclase(event.target.value); 
  }; 
  
  const canviClau = (e) => {
  const checked = e.target.checked;
  setInip(checked);
  }; 
    
  const modiDoc = async () => {
    if (alta) {
      altaDoc();
      setModificacio(false);
      return;
    }
    const docRef = doc(db, 'Claus', 'Claus_'+ xcodi); 
    if (xcodi === null || xcodi === undefined) {setXcodi('.')} 
    if (xclase === null || xclase === undefined) {setXclase('.')} 
    if (xnotes === null || xnotes === undefined) {setXnotes('.')} 
    let passw = xpassword;
    if(inip) {passw=''};
        try {
          await updateDoc(docRef, {
            codi : xcodi,
            clase: xclase,
            notes: xnotes,
            password: passw
              
          });             
          setModificacio(false);
          console.log('actualització  correcta.');
        } catch (error) {
          console.error('Error en actualització: ', error);
        }   
  };
  const altaDoc = async () => {
    if (xclase === '') {
      return;
    }
    const docRef = doc(db, 'Claus', 'Claus_' + xcodi);
    try {
    // Verificar si el document ja existeix
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.error('El document ja existeix.');
      return;
    }
    await setDoc(docRef, {
      clase:    xclase,
      codi:     xcodi,  
      mail:     xmail,               
      notes:    xnotes, 
      password: xpassword     
    });
    setAlta(false);
    console.log('Document creat correctament.'+ xcodi);
    setXcodi(xcodi+1);
    setMcodi(xcodi+1);
    } catch (error) {
    console.error('Error en crear el document:', error);
    }
  };
  function Sacabat() {    
    localStorage.setItem('Programa', '/Pinici');
    localStorage.setItem('IniciJMP', 'No');
    navigate('/Pinici');
  } 
  const checkIfmailexist = (vmail) => {
    return data.some(item => item.mail === vmail);
  };
  const Verimail = (event) => {
    setVmail(event.target.value); 
  };
  const Validar = () => {
    //console.log('mail rebut - '+ vmail )
    if (vmail === '') {
       return;
    }
    const mailExists = checkIfmailexist(vmail);
    if (mailExists) {
      const userData = data.find(item => item.mail === vmail);
      if (userData) {
          const user = {
            xmail: userData.mail,
            xcodi: userData.codi,
            xnotes: userData.notes, 
            xclase: userData.clase,
            xpassword: userData.password
           
          };
          console.log('Usuari trobat - ' + user.xpassword + ' - ' + 
                      user.xclase + '  - ' + user.xnotes);        
          setXmail(user.xmail);
          setXcodi(user.xcodi);
          setXclase(user.xclase);
          setXnotes(user.xnotes);
          setXpassword(user.xpassword);
          setModificacio(true);   
          setValida(false); 
          setAlta(false);  
         
      } else {        
           setXcodi(mcodi);
           setXclase('');
           setXnotes('5');
           setXmail(vmail);
           setXpassword('');
           setInip(true);
           setAlta(true);
          setValida(false); 
          setModificacio(true);     
          console.log(' mail no trobat 2.....' , vmail)
        //setEmailError('E-mail desconegut');
      };
    }  else {        
           setXcodi(mcodi);
           setXclase('');
           setXnotes('5');
           setXmail(vmail);
           setXpassword('');
           setInip(true);         
           setAlta(true);
           setValida(false);
           setModificacio(true);      
          console.log(' mail no trobat 1 .....' , vmail)
        //setEmailError('E-mail desconegut');
      };
  };
 
  //  **** useeffect per llegir tots els registres de claus i posar-los a data ** 
  useEffect(() => {
     const fetchData = async () => {
       const linksCollection = collection(db, 'Claus');
       try {
         const querySnapshot = await getDocs(linksCollection);
         const linksData = querySnapshot.docs.map(doc => ({
           codi: doc.data().codi,
           clase: doc.data().clase,
           mail: doc.data().mail,
           notes: doc.data().notes,
           nivell: doc.data().nivell,
           password: doc.data().password,
            ...doc.data(),
         }));
         setData(linksData);
       } catch (error) {
         console.error('Error llegint Claus: ', error);
       }
     };
     fetchData();
     
  }, []);

   //  *****   use efect per buscar ultim numero per alta  ****
  useEffect(() => {
      const fetchAllMediaI = async () => {
        try {
          const colRef = collection(db, 'Claus');
          const q = query(colRef, orderBy("codi", 'desc'), limit(1));
          const querySnapshot = await getDocs(q);
    
          let lastC00 = 0;
          querySnapshot.forEach((doc) => {
            lastC00 = doc.data().codi;
          });
    
          // Incrementar l'últim valor de c00 i actualitzar l'estat
          setMcodi(lastC00 + 1);
          console.log('num. posible alta - '+ (lastC00 + 1))    
        } catch (error) {
          console.error('Error en obtenir l\'últim c00:', error);
        }
      };    
      fetchAllMediaI(); 
  }, []);

   //  *****   use efect per anular retorn de tecles ****
   useEffect(() => {  
      const anularReturn = (event) => {
         event.preventDefault();
         if (window.history.state && 
             window.history.state.preventExit) {
              navigate(0);
          }
      } 
      window.history.pushState({preventExit: true},'');
      window.addEventListener('popstate',anularReturn);
      return () => {
         window.removeEventListener('popstate',anularReturn);
         window.history.replaceState(null,'');
      }
  }, [navigate]);
  return ( 
    <> 
     <div className="Permisos-requadreCO1">
                <span className="brand-titleCO">              
               <strong> Gestió de permisos  </strong> 
                </span>
     </div>  
    <div >     
     <Container fluid className="mt-5">
       <Row className="justify-content-center">
         <Col lg={4} xl={4}>
          <Card className="shadow border-0 rounded-4">
           <Card.Body className="p-5">          
             <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group className="mb-4">
                 <Form.Label className="fw-semibold fs-5">
                          Usuari a Modificar
                 </Form.Label>               
                 <Form.Control
                                 type="email"
                                 onChange={Verimail}
                                 placeholder="Introdueix e-mail"
                                 className="py-3 fs-5 rounded-3 w-100"
                                 required>
                 </Form.Control>
                </Form.Group> 
                <Button
                                  className="mb-2"
                                  size='sm'
                                  variant="primary"           
                                  onClick={Validar}
                                >
                                 <i className="fas fa-check"></i> Validar e-mail
                </Button>                 
            </Form>
            <br></br>        
            {valida === false && (
  <div
    style={{
      border: "1px solid #e0e0e0",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "500px",
      margin: "20px auto",
      backgroundColor: "#fafafa"
    }}
  >

    {/* Nom Usuari */}
    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
      <label style={{ minWidth: "180px", fontWeight: "600" }}>
        Nom Usuari
      </label>
      <input
        type="text"
        value={xclase}
        onChange={canviClase}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </div>

   <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
  <label style={{ minWidth: "180px", fontWeight: "600" }}>
    Nivell Accés (1-5)
  </label>

  <input
    type="number"
    value={xnotes}
    onChange={(e) => {
      let value = e.target.value;

      // Evitar valors fora de rang
      if (value === "") {
        setXnotes("");
        return;
      }

      value = Math.max(1, Math.min(5, Number(value)));
      setXnotes(value);
    }}
    min="1"
    max="5"
    style={{
      flex: 1,
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    }}
  />
</div>

    {/* Password */}
       <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
      <label style={{ minWidth: "180px", fontWeight: "600" }}>
        Reinicialitzar Password
      </label>

      <input
        type="checkbox"
        checked={inip}
        onChange={canviClau}     
        style={{ transform: "scale(1.3)" }}
      />
    </div> 
    </div>
   )}
     <br></br>     
     <div className="d-flex gap-2 menys-espaiAK">
        <Button
                  className="mb-2"
                  size='sm'
                  variant="warning"           
                  onClick={Sacabat}>
                  <i className="fas fa-check"></i>        Enrere
        </Button>  
        {modificacio  && (
             <Button className="mb-2" 
                         size='sm'
                         variant='primary'                                  
                         onClick={modiDoc}>
                         <i className="fas fa-sign-out-alt"></i>Guardar Usuari
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
   