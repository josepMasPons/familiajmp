// -------  Versió   per base de dades SANTVIFLIX -----------------
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
 
import logo01 from "../Imatges/f01.jpg";
import logo02 from "../Imatges/f02.jpg";
import logo03 from "../Imatges/f03.jpg";
import logo04 from "../Imatges/f04.jpg";
import logo05 from "../Imatges/f05.jpg";
import logo06 from "../Imatges/f06.jpg";
import logo07 from "../Imatges/f07.jpg";
import logo08 from "../Imatges/f08.jpg";
import logo09 from "../Imatges/f09.jpg";
import logo10 from "../Imatges/f10.jpg";
import logo11 from "../Imatges/f11.jpg";
import logo12 from "../Imatges/f12.jpg";
import "./Pantalla02.css";

function Pantalla02() {
  const navigate=useNavigate();
  const [text1, setText1] = useState(localStorage.getItem('Proces051') || '');
  const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 

  const [logoR, setLogoR] = useState('');
  // useEffect per dirigir auto màticament al invitats
  
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
    const loadRandomImage = () => {
      const imatges = [logo01, logo02, logo03, logo04, logo05, logo06, logo07, logo08, logo09, logo10, logo11, logo12];
      const randomIndex = Math.floor(Math.random() * imatges.length);
      setLogoR(imatges[randomIndex]);
  
    };      
    loadRandomImage();  
  }, []);

  function Temporada(e) {    
    setText1(e.target.value);    
  }  

  function Validar() {         
    localStorage.setItem('Proces051', text1);
    localStorage.setItem('Proces052', text2);
    localStorage.setItem('Programa', '/Pantalla02b');    
    navigate('/Pantalla02B');
  } 
  function Paraula1(event) {    
    setText2(event.target.value);        
  } 
  function Sacabat() {     
    localStorage.setItem('Programa', '/Pinici');
    localStorage.setItem('IniciJMP', 'No');
    navigate('/Pinici');
  }  
  function AltaReg() {    
    localStorage.setItem('Programa', '/JMAltaReg');
    return '/JMAltaReg';
  }
  //function AltaKey() {    
  //  localStorage.setItem('Programa', '/JMContra');
  //  return '/JMContra';
  //}
  function Preguntes() {    
    localStorage.setItem('Programa', '/Preguntes');
    return '/Preguntes';
  }
  
  return (
    <>
    <div className="center-contentP2">  
      <Card.Header className="text-center fs-5 fw-bold">
              Racó familiar                   
           </Card.Header>    
      <Navbar className="SVNavbarP2 shadow mb-2" 
              variant="light" expand="lg">
       
        <Container className="px-4">            
               <Navbar.Collapse id="basic-navbar-nav">  
               {/* <Nav.Link href={AltaKey()} 
                             className="border px-3 py-1 rounded">
                           Gestió claus accés
                     </Nav.Link>
                */}
                {administrador === 'Si' && (
                     <>                            
                     <div>
                     <Nav.Link href={AltaReg()} 
                             className="border px-3 py-1 rounded">
                           Alta registre
                     </Nav.Link>
                     </div>
                  {/*   <div>
                     <Nav.Link href={Preguntes()} 
                             className="border px-3 py-1 rounded">
                           preguntes clau
                     </Nav.Link>
                     </div>
                    */}
                     </>
                )}
                 
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Container>
          </Navbar>        
          <Row className="justify-content-center">
            <Col md={20}>
              <Card>
                <Card.Header className="text-center fs-5 fw-bold">Seleccionar Registres</Card.Header>
                <Card.Body>
                  <Form>
                   <Form.Group controlId="formBasicText" className="d-flex align-items-center">
                   <Form.Label className="me-2" style={{ width: '160px' }}>Any </Form.Label>
                   <Form.Control
                        type="text"
                          placeholder="any"
                            value={text1}
                              onChange={Temporada}                  
                      />
                   </Form.Group>
                   <Form.Group controlId="formBasicText" className="d-flex align-items-center">
                      <Form.Label className="me-2" style={{ width: '160px' }}>paraula clau</Form.Label>
                      <Form.Control
                        type="text"
                          placeholder="paraula"
                            value={text2}
                              onChange={Paraula1}                  
                      />
                   </Form.Group>                                   
                      <div className="d-flex justify-content-center mt-3">
                                 <Button className="mb-2" 
                                        variant="warning"
                                        size='sm'
                                        onClick={Sacabat}>                                      
                                   <i className="fas fa-sign-out-alt"></i>  Enrere
                                 </Button>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <Button className="mb-2" 
                                        variant="primary"
                                        size='sm'
                                        onClick={Validar}>                             
                                   <i className="fas fa-sign-out-alt"></i>  Validar
                                 </Button>
                              
                      </div>   
                   </Form>
                 </Card.Body>   
              </Card>
            </Col>
          </Row>
      </div>
      </>
  );
}
export default Pantalla02;
