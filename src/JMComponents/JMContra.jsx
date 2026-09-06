import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card} from "react-bootstrap";
import "./JMContra.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {storageCar, db } from '../firebaseLoc'; 
import { doc, updateDoc, 
          getDoc, setDoc,
          getDocs, collection,          
          limit  } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import Benrera from '../JMGlobal/Benrera';

export default function JMContra() {
  const navigate=useNavigate();
  const [modificacio, setModificacio] = useState(0);
  const [modificacioV, setModificacioV] = useState(1);  
  const [sicontraV, setSicontraV] = useState(true);
  const [ocontra, setOcontra] = useState('');
  const [xcodi, setXcodi] = useState('');
  const [xclase, setXclase] = useState('');
  const [xmail, setXmail] = useState(''); 
  const [cmail, setCmail] = useState(localStorage.getItem('PassMail'));   
  const [xnotes, setXnotes] = useState(''); 
  const [xcontra, setXcontra] = useState('') 
  const [vcontra, setVcontra] = useState('')  
  const [xpassword, setXpassword] = useState('');
  const [contraError, setContraError] = useState ('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const linksCollection = collection(db, 'Claus');
      const querySnapshot = await getDocs(linksCollection);
      let foundUser = null;
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.mail === cmail) {
          foundUser = docData;
        }
      });

      if (foundUser) {
        console.log('Mail: ' + cmail + ' | Contra: ' + foundUser.contra);
        setXclase(foundUser.clase);
        setXcodi(foundUser.codi);
        setXmail(foundUser.mail);
        setXnotes(foundUser.notes);
        setXpassword(foundUser.password);       
        const contraValue = foundUser.password ?? '';
        setXcontra(contraValue);
        setVcontra(contraValue);
        
      } else {
        console.log('Usuari no trobat amb aquest mail.');
      }
    } catch (error) {
      console.error('Error en llegir dades:', error);
    }
  };

  if (cmail) fetchData();

}, [cmail]);
useEffect(() => {
  const ModificV = async () => {
     const trimmedpassword = (vcontra || '').trim(); 
     if (trimmedpassword === '') { 
        setSicontraV(false);       
        return; 
     } 
        setSicontraV(true);         
  }
   ModificV();

}, [vcontra]);
  // verificar password antiga *******************
  const VContra = (event) => {
    setContraError('');
    const trimmedContra = (vcontra || '').trim(); 
    if (trimmedContra === '') {    
      setModificacioV(1);
      return;
    }
    if (xcontra != event.target.value) {
      setModificacio(0);
      setContraError('* la password antiga no coincideix *');
      setModificacioV(0);
      return;
    }
    setModificacioV(1);
  }; 
  const OContra = (event) => {
    if (modificacioV === '0') {
      setModificacio(0);
      setContraError('*Pendent confirmar contrasenya antiga *');     
      return;
    }
    setContraError(''); 
    setOcontra(event.target.value); 
  }; 
    
  const NContra = (event) => {
     if (modificacioV === 0) {
      setContraError('*Pendent confirmar contrasenya antiga *');     
      return;
    }
    setContraError('');
    if (ocontra != event.target.value) {
      setContraError('* les passwords no coincideixen *');
      setModificacio(0);
      return;
    }
    setModificacio(1);
    setXcontra(ocontra);
  };
  
 
  const modiDoc = async () => {
    const docRef = doc(db, 'Claus', 'Claus_'+ xcodi);  
        try {
          await updateDoc(docRef, {
            codi : xcodi,
            clase: xclase,
            notes: xnotes,
            mail:  xmail,
            password: xcontra,
            contra: xcontra          
          });         
        console.log('actualització  correcta.');
        } catch (error) {
          console.error('Error en actualització: ', error);
        }
    localStorage.setItem('IniciJMP', 'No'); 
    navigate('/Pinici');   
  };
  
  function Sacabat() {    
    localStorage.setItem('IniciJMP', 'No');
    navigate('/Pinici');
  } 
  Benrera(Sacabat);
  return ( 
    <>    
    <div>    
     <div className="JMContra-requadreCO1">
                <span className="brand-titleCO">              
               <strong> Canvi de Password  </strong> 
                </span>
    </div>
     <div className="JMContra-requadreCO2">
                <span className="brand-titleCO">                
                E-mail :&nbsp;&nbsp;  {cmail}  
                </span>
    </div>
    <Container fluid className="mt-5">
  <Row className="justify-content-center">
    <Col lg={4} xl={4}>
      <Card className="shadow border-0 rounded-4">
        <Card.Body className="p-5">

          <Form>
            {sicontraV  && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold fs-5">
                  Password antiga
                </Form.Label>

                <Form.Control
                  type="password"
                  onChange={VContra}
                  placeholder="Introdueix la contrasenya antiga"
                  className="py-3 fs-5 rounded-3 w-100"
                />
              </Form.Group>
            )}
          </Form>

          <Form>
          
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold fs-5">
                  Nova Password
                </Form.Label>

                <Form.Control
                  type="password"
                  onChange={OContra}
                  placeholder="Introdueix la nova contrasenya"
                  className="py-3 fs-5 rounded-3 w-100"
                />
              </Form.Group>
         
          </Form>       
          <Form>
            
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold fs-5">
                  Repetir Nova Password
                </Form.Label>

                <Form.Control
                  type="password"
                  onChange={NContra}
                  placeholder="Repeteix la nova contrasenya"
                  className="py-3 fs-5 rounded-3 w-100"
                />
              </Form.Group>
            
            {contraError && (
                  <div className="text-danger mt-1 fw-bold">{contraError}</div>
            )}
          </Form>

        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
            <Card className="shadow-sm border-0">
                <Card.Body className="p-4">                  
          
          <div className="d-flex justify-content-center mt-3">
            <Button
              className="mb-2"
              size='sm'
              variant="warning"           
              onClick={Sacabat}            >
              <i className="fas fa-arrow-left"></i> Enrere
            </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {modificacio === 1 && (
               <Button
                className="mb-2"
                size='sm'
                variant="primary"           
                onClick={modiDoc}
              >
               <i className="fas fa-check"></i> Acceptar
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
