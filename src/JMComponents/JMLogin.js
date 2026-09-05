// -------  Versió   per base de dades SANTVIFLIX -----------------
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Container, Row, Col, Card, Nav, Navbar,InputGroup  } from "react-bootstrap";
import { useLocation } from 'react-router-dom';  
import "./Global.css";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from '../firebaseLoc';
import logo01 from "../fotos/f01.jpg";
import logo02 from "../fotos/f02.jpg";
import logo03 from "../fotos/f03.jpg";
import logo04 from "../fotos/f04.jpg";
import logo05 from "../fotos/f05.jpg";
import logo06 from "../fotos/f06.jpg";
import logo07 from "../fotos/f07.jpg";
import logo08 from "../fotos/f08.jpg";
import logo09 from "../fotos/f09.jpg";
import logo10 from "../fotos/f10.jpg";
import logo11 from "../fotos/f11.jpg";
import logo12 from "../fotos/f12.jpg"; 


const JMLogin = () => {
  const [data, setData] = useState([]);
  const [dataI, setDataI] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem('PassMail'))
  const [nom, setNom] = useState(localStorage.getItem("PassNom") || "");
  const [emailError, setEmailError] = useState("");
  const [logoR1, setLogoR1] = useState('');
  const [logoR2, setLogoR2] = useState(''); 
  const [logoR3, setLogoR3] = useState('');
  const navigate=useNavigate();
  const [param, setParam] = useState(localStorage.getItem("Param"));
  const location = useLocation();
  const [loading, setLoading] = useState(true); 
  const [contra,setContra]= useState('');
  const [contraError, setContraError] = useState ('');
  const [siContra, setSiContra] = useState(false);

  // useEffect que inicialitza el mail si es invitat
  useEffect(() => {
    if (localStorage.getItem('PassMail') === 'invitat@cpsv.com') 
    {
       setEmail('');
    }     
    }, []);

  // useEffect  per carrega automàtica 
  useEffect(() => {
        setParam(localStorage.getItem("Param"));
    if (localStorage.getItem("Param") != 'X' &&
        loading === false)
    {
      handleSubmitParam();  
    }   
    }, [loading]);

  // useEffect  inicialitza mail,nom.niv i anula return mobils  
  useEffect(() => {    
    localStorage.setItem('PassMail', '');
    localStorage.setItem('PassNom', '');
    localStorage.setItem('PassNiv', '');
    
    const anularReturn = (event) => {
      event.preventDefault();     
      if (window.history.state && window.history.state.preventExit) {
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

   // useEffect per carregar keys i fotos 
  useEffect(() => {
    const fetchData = async () => {
      const linksCollection = collection(db, 'SantviHistK');
      try {
        const querySnapshot = await getDocs(linksCollection);
        const linksData = querySnapshot.docs.map(doc => ({
          codi: doc.data().codi,
          clase: doc.data().clase,
          mail: doc.data().mail,
          notes: doc.data().notes,
          password: doc.data().password,
          contra: doc.data().contra,
          ...doc.data(),
        }));
        setData(linksData);

      } catch (error) {
        console.error('Error llegint santviHistK: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const loadRandomImage = () => {
      const imatges1 = [logo01, logo02, logo03, logo04, logo05, logo06, logo07, logo08, logo09, logo10, logo11, logo12];
      const randomIndex1 = Math.floor(Math.random() * imatges1.length);
      setLogoR1(imatges1[randomIndex1]);
      const imatges2 = [logo01, logo02, logo03, logo04, logo05, logo06, logo07, logo08, logo09, logo10, logo11, logo12];
      const randomIndex2 = Math.floor(Math.random() * imatges2.length);
      setLogoR2(imatges2[randomIndex2]);
      const imatges3 = [logo01, logo02, logo03, logo04, logo05, logo06, logo07, logo08, logo09, logo10, logo11, logo12];
      const randomIndex3 = Math.floor(Math.random() * imatges3.length);
      setLogoR3(imatges3[randomIndex3]);
    };
    loadRandomImage();   

  }, []);

  // useEffect per carregar registres invitats
  useEffect(() => {
    const InviData = async () => {
      const inviCollection = collection(db, 'SantviInvitat');
      try {
        const querySnapshotI = await getDocs(inviCollection);
        const linksDataI = querySnapshotI.docs.map(doc => ({
          Sinvi01: doc.data().Sinvi01,
          Sinvi02: doc.data().Sinvi02,
          Sinvi03: doc.data().Sinvi03,
          Sinvi04: doc.data().Sinvi04,
          Sinvi05: doc.data().Sinvi05,
          Sinvi06: doc.data().Sinvi06,
          ...doc.data(),
        }));
        setDataI(linksDataI);

      } catch (error) {
        console.error('Error llegint santviInvitat: ', error);
      } finally {
      
      }
    };
    InviData();
  }, []);

const normalizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  const original = str;
  const lowered = str.toLowerCase().trim();
  const noAccents = lowered.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const noSpaces = noAccents.replace(/\s+/g, '');
  //console.log(`Normalitzant: "${original}" → "${noSpaces}"`);
  return noSpaces;
};

const parseDate = (dateStr) => {
  // Suposa format "dd/mm/yyyy"
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}T00:00:00`);
};

const checkIfEmailExists = (param) => {
  const normalizedParam = normalizeString(param);
  const found = data.some(item => normalizeString(item.mail) === normalizedParam);
  //console.log(`Email ${param} ${found ? 'TROBAT' : 'NO TROBAT'}`);
  return found;
};

const checkIfInviExists = (param) => {
  const normalizedParam = normalizeString(param);
  const found2 = dataI.some(item => normalizeString(item.Sinvi02) === normalizedParam);
  return found2;
  
};
const checkIfInviData = (param) => {
  const normalizedParam = normalizeString(param);
  const itemFound = dataI.find(item => normalizeString(item.Sinvi02) === normalizedParam);
  if (itemFound) {
    const avui = new Date();
    const dataInici = parseDate(itemFound.Sinvi04);
    const dataFinal = parseDate(itemFound.Sinvi05);
    avui.setHours(0, 0, 0, 0);
    dataInici.setHours(0, 0, 0, 0);
    dataFinal.setHours(0, 0, 0, 0);
    if (avui < dataInici || avui > dataFinal) {      
      //console.warn('⚠️ ATENCIÓ: La data actual NO es troba dins del període permès.');
      // setEmailError(`registre fora de DATES `);
      return false
    } else {     
      //console.log('✅ La data actual es troba dins del període permès.');
      return true; 
    }
  }
  return false;
};
const inputRef = useRef();
const handleSubmitPassword = (eventx) => {
    eventx.preventDefault(); 
    const normalizedEmail = normalizeString(email); 
    const userData = data.find(item => normalizeString(item.mail) === normalizedEmail);
    console.log('password --- ' + contra  + ' / ' + userData.contra)
    if (contra !== userData.contra) {
      setContraError('****  Password error *****');
      setContra(''); 
      inputRef.current?.focus();
      return;
    }
    const user = {
      email: userData.mail,
      nom: userData.notes,
      clase: userData.clase,
      password: userData.password
       
    };
    localStorage.setItem('PassMail', user.email);
    localStorage.setItem('PassNom', user.nom);
    localStorage.setItem('PassNiv', user.clase);
    localStorage.setItem('PassWord', user.password);
    localStorage.setItem('Programa', '/Pantalla02');
   // console.log('surt per : handleSubmitPassword 217');
    navigate('/Pantalla02');
    return;
};
const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = normalizeString(email);
    const userExists = checkIfEmailExists(email);

   if (userExists) {
    const userData = data.find(item => normalizeString(item.mail) === normalizedEmail);
    const user = {
      email: userData.mail,
      nom: userData.notes,
      clase: userData.clase,
      password: userData.password,
      contra: userData.contra
    };
    
    localStorage.setItem('PassMail', user.email);
    localStorage.setItem('PassNom', user.nom);
    localStorage.setItem('PassNiv', user.clase);
    localStorage.setItem('PassWord', user.password);
    localStorage.setItem('Programa', '/Pantalla02');
   /* console.log(`Usuari trobat -  ${user.email} - 
                                  ${user.nom} - 
                                  ${user.contra}`);
   */   
   
    if (!user.contra || user.contra.trim() === '') {
        navigate('/JMContra');
    } else {
        setContra(user.contra);
        setSiContra(true);
       // navigate('/Pantalla02');
    }
   return;
  }

  // Invitat
   const InviExists = checkIfInviExists(email);
   if (InviExists) {
    const userDataI = dataI.find(itemI => normalizeString(itemI.Sinvi02) === normalizedEmail);
    const userI = {
      email: 'invitat@cpsv.com',
      clau: userDataI.Sinvi02,
      nom: userDataI.Sinvi06,
      clase: userDataI.Sinvi03,
      password: 'X00000000000X00'
    };
    localStorage.setItem('PassMail', userI.email);
    localStorage.setItem('PassNom', userI.nom);
    localStorage.setItem('PassNiv', userI.clase);
    localStorage.setItem('PassWord', userI.password);
    localStorage.setItem('Programa', '/Pantalla02');
    console.log(`Invitat trobat - ${userI.email} - ${userI.nom} - ${userI.clau}`);

    const dataExistx = checkIfInviData(email);
    if (dataExistx) {
     // console.log('surt per : dataExist 276');
      navigate('/Pantalla02');
    } else {
      setEmailError('** registre fora de DATES');
      setEmail(''); // ← buida l'input
      inputRef.current?.focus(); // ← torna a posar el focus
      return;
      
    }
   return;
  }
  console.log(`Invitat NO trobat : ${email}`);
  setEmailError(`No trobat ni usuari ni invitat: ${email}`);
};
const validateEmail = (valor) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(valor);
};
const handleSubmitParam = () => {
    setEmail(param);    
    if (validateEmail(param)) {
      const userExists = checkIfEmailExists(param);      
      if (userExists) {
        const userData = data.find(item => item.mail === param);
        if (userData) {
          const user = {
            email: userData.mail,
            nom: userData.notes, 
            clase: userData.clase,
            password: userData.password,
            contra: userData.contra 
          };          
          localStorage.setItem('PassMail', user.email);
          localStorage.setItem('PassNom', user.nom); 
          localStorage.setItem('PassNiv', user.clase);
          localStorage.setItem('PassWord', user.password);
          localStorage.setItem('Contra', user.contra);
          localStorage.setItem('Programa', '/Pantalla02');
          setEmailError('E-Mail correcte. Pots iniciar sessió');
          //console.log('surt per : handlesubmitparam 315').
          navigate('/Pantalla02');
        }
      } else {
        setEmailError('E-mail desconegut');
      }
    } else {
      setEmailError('El correu no és vàlid');
    }
  };
 const Copyright = () => {    
    navigate('/JMCopyRight');
  } 
 
 const Terms = ()  => {
    navigate('/JMTermsConditions');
  } 

return (
  <>
  
     <div className="d-flex justify-content-center">
        <Navbar className="SVNavbar shadow mb-4" variant="light" expand="lg">
         <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />    
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="d-flex gap-3 me-4">     
              <Nav.Link onClick={Copyright} className="border px-3 py-1 rounded">
                          CopyRight</Nav.Link>
              <Nav.Link onClick={Terms} className="border px-3 py-1 rounded">
                          Termes i condicions</Nav.Link>
              </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>   
     <Navbar className=" SVNavbarLO shadow mb-0 center-contentLO" 
             variant="light" expand="lg">
    <Container className="px-4 text-center justify-content-center"> 
    <Navbar.Brand className="d-flex flex-column align-items-center">
      <span className="brand-titleLO">
        Un passeig per la història del centre
      </span>
      <span className="brand-titleLO2">            
        Documents i imatges recollides des de l'any 1934 
      </span>
      
      <div className="image-text-containerLO d-flex gap-1">
        <img src={logoR1} className="logoLO" alt="logo" /> 
        <img src={logoR2} className="logoLO" alt="logo" />
        <img src={logoR3} className="logoLO" alt="logo" />  
      </div>     
    </Navbar.Brand>
   </Container>      
  </Navbar>
 <Container className="mt-3 px-4">
  <Row className="justify-content-center">
    <Col md={6}>
      <Card>
        <Card.Header className="text-center fw-bold">
          Identificació
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <InputGroup>
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder="Introdueix el teu e-mail o clau"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError('');
                    setContraError('');
                    setSiContra(false);
                  }}
                  required
                />
                <Button
                   
                  variant="primary"
                  type="submit"
                  className="ms-2 btn-sm"
                >
                  <i className="fas fa-sign-in-alt"></i> Entrar
                </Button>
              </InputGroup>
              {emailError && (
                <div className="text-danger mt-1 fw-bold">{emailError}</div>
              )}
            </Form.Group>
          </Form>

          {siContra && (
            <Form onSubmit={handleSubmitPassword}>
              <Form.Group controlId="formBasicPassword" className="mt-3">
                <InputGroup>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(eventx) => {
                      setContra(eventx.target.value);
                      setContraError('');
                    }}
                    required
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    className="ms-2 btn-sm"
                  >
                    <i className="fas fa-key"></i> Password
                  </Button>
                </InputGroup>
                {contraError && (
                  <div className="text-danger mt-1 fw-bold">{contraError}</div>
                )}
              </Form.Group>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>

 
</>
)
};
export default JMLogin;
