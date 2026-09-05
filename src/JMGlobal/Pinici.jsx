import React, { useEffect, useState,useRef } from 'react';
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
import noms from   '../fotos/noms.png'; 
import './Pinici.css';
import Pbuto from './Pbuto.jsx'; 
import { Form, Button, Container, Row, Col, Card, Nav, Navbar,
         InputGroup,  
         TabContainer} from "react-bootstrap";
import { storageCar, db } from '../firebaseLoc.js';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Netejacache  from '../JMComponents/Netejacache.jsx';

function Pinici({ canviarPantalla }) {
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const navigate = useNavigate();
    let Versio01 = localStorage.getItem('Versio01');
    let Versio02 = localStorage.getItem('Versio02');
    let Versio03 = localStorage.getItem('Versio03');
  
   const [logoR, setLogoR] = useState('');  
   const [codi, setCodi] = useState('');  
   const [pregunta, setPregunta] = useState('Quin aniversari vam cel.lebrar el 2025 a París?');  
   const [resposta, setResposta] = useState('50'); 
   const [preguntat, setPreguntat] = useState([]);  
   const [respostat, setRespostat] = useState([]); 
   const [inputx, setInputx] = useState('');
   const [esValid, setEsValid] = useState(null); 
   const [numero, setNumero] = useState(0); 
   const [max, setMax] = useState(0); 
   const [fet, setfet] = useState(false); 
   const [usagePercent, setUsagePercent] = useState(0);
   const [usageMB, setUsageMB] = useState(0);
   const [quotaMB, setQuotaMB] = useState(0);
   const [adminFam, setAdminFam] = useState('No');
   const [siContra, setSiContra] = useState(false);
   const [contra, setContra] = useState('');
   const [contraError, setContraError] = useState ('');
   const [familia, setFamilia] = useState ([]);
   const [nomc, setNomc] = useState ('');
   const inputRef = useRef(null);
   const [data, setData] = useState([]); 
   const [email, setEmail] = useState('');
  const [emailP, setEmailP] = useState('');
  const [emailError, setEmailError] = useState("");
  const [emailErrorP, setEmailErrorP] = useState("");
  const [loading, setLoading] = useState(true);
  const [iniciJMP, setIniciJMP] = useState(localStorage.getItem('IniciJMP') || 'Si');

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
   };
  const normalizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  const original = str;
  const lowered = str.toLowerCase().trim();
  const noAccents = lowered.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const noSpaces = noAccents.replace(/\s+/g, '');
  //console.log(`Normalitzant: "${original}" → "${noSpaces}"`);
  return noSpaces;
 };
  useEffect(() => {
    if (localStorage.getItem('IniciJMP') === 'No') {
      setAdminFam(localStorage.getItem('AdminFam'))
      setNomc(localStorage.getItem('NomJ'))
      setEsValid(true);
    }
  }, []);  
   useEffect(() => {
       const checkStorageUsage = async () => {       
         if (!navigator.storage || !navigator.storage.estimate) {
           console.warn("⚠️ El navegador no suporta navigator.storage.estimate()");
           return;
         }   
         try {
           const { usage, quota } = await navigator.storage.estimate();
           const percent = (usage / quota) * 100;
           setUsagePercent(percent);
           setUsageMB(usage);
           setQuotaMB(quota);
         } catch (err) {
             console.error("Error comprovant la memòria:", err);
      }
    };   
       checkStorageUsage();
     }, []);
 useEffect(() => {
  const BuscarFamilia = async () => {
    const linksCollectionFA = collection(db, 'Claus');
    try {
      const querySnapshot = await getDocs(linksCollectionFA);

      const linksDataFA = querySnapshot.docs.map(doc => ({
        codi: doc.data().codi,
        clase: doc.data().clase,
        mail: doc.data().mail,
        notes: doc.data().notes,
        password: doc.data().password,
        ...doc.data(),
      }));

      setFamilia(linksDataFA);

      //console.log("Registres Claus:", linksDataFA);

      //linksDataFA.forEach(item => {
      //  console.log("Clase:", item.clase, "clau:", item.password);
      //});

    } catch (error) {
      console.error('Error llegint Claus: ', error);
    }
  };

  BuscarFamilia();
}, []);


    useEffect(() => {   
      const buscarpreguntes = async () => {
        const linksCollection = collection(db, 'Preguntes');
        const qX = query(linksCollection);
        try {
          const querySnapshot = await getDocs(qX);
          const linksData = querySnapshot.docs.map(doc => ({
           
            preguntaI: doc.data().pregunta,
            respostaI: doc.data().resposta,
            ...doc.data()
          }))
        
          const preguntesArray = linksData.map(item => item.preguntaI);
          const respostesArray = linksData.map(item => item.respostaI);

         setPreguntat(preguntesArray);
         setRespostat(respostesArray);


        const aleatori = Math.floor(Math.random() * (linksData.length));
          setMax(linksData.length + 1); 
          setNumero(aleatori)
          setfet(true);    
        } catch (error) {
          console.error('Error llegint documents: ', error);
        }
      };
      buscarpreguntes();
                
    }, []);
    useEffect(() => {
       setPregunta(preguntat[numero]);
       setResposta(respostat[numero])
            
    }, [fet]);
    /*
    const tornari = () => {
      const aleatori = Math.floor(Math.random() * max);
          setNumero(aleatori)
          setPregunta(preguntat[aleatori]);
          setResposta(respostat[aleatori]);  
   } 
   */
   useEffect(() => {
       const vinicial = localStorage.getItem('Vinicial') === 'true'; // converteix la cadena a booleà
       if (vinicial === false) {
           setIsPasswordCorrect(true);
       } 
       //console.log('Vinicial Pinici- ' + vinicial);
       const loadRandomImage = () => {
           const imatges = [logo01, logo02, logo03, logo04, logo05, logo06, logo07,
                            logo08, logo09, logo10, logo11, logo12];
           const randomIndex = Math.floor(Math.random() * imatges.length);
           const randomImatge = imatges[randomIndex];
           setLogoR(randomImatge);    
       };      
       loadRandomImage();  
   }, []);

   function nom(e) {     
       const valor = e.target.value;    
       if (valor === 'a') {
           setIsPasswordCorrect(true);
           localStorage.setItem('Vinicial', 'false');  
       }   
    
   }
   const demanarContra = () => {   
    navigate('/JMContra');
  } 
   const mytrips = () => {
   // navigate('/Mytrips01');
    navigate('/Pantalla02');
  } 

   const jocs = () => {
    navigate('/Jocs0');
  }
   const Enrera = () => {
    navigate('/');
  };
  const sacabat = () => {
    localStorage.setItem('IniciJMP', 'Si');  
    localStorage.setItem('AdminFam', 'No');
    localStorage.setItem('NomJ', '');
    setNomc('');
    setIniciJMP('Si')
    setAdminFam('No')
    setEsValid(null);    
    navigate('/');
  };
  const handleChange = (e) => {
       const valor = e.target.value;
       setInputx(valor);   
   }
  useEffect(() => {
  if (siContra === true && inputRef.current) {
    inputRef.current.focus();
  }
  }, [siContra]);
 /*
  const Validar = (e) => {  
   
    if (inputx === 'admxx' || inputx === 'Admxx') {
     localStorage.setItem('AdminFam', 'Si');  
     setAdminFam(`Si`);
     setEsValid(true);
     setSicontra(false);
     return;
    }
    
    if (e === '.') {
     setSicontra(true);     
     return;
    }
    setSicontra(false);
    const normalitza = (text) =>      
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (normalitza(inputx).includes(normalitza(resposta))) {
     localStorage.setItem('AdminFam', 'No');
     setAdminFam(`No`);  
     setEsValid(true);
     } else {
     localStorage.setItem('AdminFam', 'No'); 
     setAdminFam(`No`);   
     setEsValid(false);
    }
  }  */
  const handleSubmit = (event) => {    
        event.preventDefault();
        if (!validateEmail(email)) {
           setEmailError('El correu no és vàlid');
           return;
        }
      const userExists = checkIfEmailExists(email);      
        if (!userExists) {
           setEmailError('Demani permisos al administrador per accedir !!!');
           return;
        }
      const userData = data.find(item => item.mail === email);
        if (!userData) {
            setEmailError('No està creat el compte correctament !!!');
            return;
        }
      localStorage.setItem('PassMail', userData.mail);
      localStorage.setItem('PassNom', userData.clase); 
      localStorage.setItem('PassWord', userData.password);
      localStorage.setItem('Prestec', 'N');
          
      if (!userData.password || userData.password.trim() === '') {
        navigate('/JMContra');
        return;
      }
      setContra(userData.password);
      setSiContra(true); 
  };
  
  const handleSubmitPassword = () => {
    // eventx.preventDefault(); 
     const normalizedFA = normalizeString(contra); 
     const userDataFA = familia.find(item => 
            normalizeString(item.password) === normalizedFA && 
            email === item.mail);
    // console.log('trobat 1 - '+ normalizedFA)
    // console.log('trobat 2 - '+ userDataFA.password)
    
     setSiContra(false);
      if (userDataFA) {
        setEsValid(true);
        setNomc(userDataFA.clase) 
// ***** aqui es defineix si un usuari es administrador o no per tota la APLICACIÓ  
        if(userDataFA.notes === '1') {
// *******************************************************************************
           localStorage.setItem('AdminFam', 'Si'); 
           localStorage.setItem('NomJ',userDataFA.clase ); 
           setAdminFam(`Si`);  
        } else {
           localStorage.setItem('AdminFam', 'No'); 
           localStorage.setItem('NomJ',userDataFA.clase );         
           setAdminFam(`No`);  
        }             
     } else {
        localStorage.setItem('AdminFam', 'No');  
        localStorage.setItem('NomJ','Convidat' );          
        setAdminFam(`No`);   
        setEsValid(false)
     };
  };
  
  const validateEmail = (valor) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  useEffect(() => {
    const fetchData = async () => {
      const linksCollection = collection(db, 'Claus');
      try {
        const querySnapshot = await getDocs(linksCollection);
        const linksData = querySnapshot.docs.map(doc => ({
          nom: doc.data().clase,
          codi: doc.data().codi,
          mail: doc.data().mail,
          notes: doc.data().notes,
          nivell: doc.data().nivell,
          password: doc.data().password,
             ...doc.data(),
        }));
        setData(linksData);
      } catch (error) {
        console.error('Error llegint Claus: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const checkIfEmailExists = (email) => 
        data.some(item => item.mail === email);
  return ( 
      <div>
      <Netejacache />       
      <div>        
        <div className="PP01"> 
             <header className="PP01-header1">               
              <Navbar expand={false} variant="light"
                  style={{
                  backgroundColor: "transparent",
                  padding: "2px 4px",
                  fontSize: "8px"
                   }}>
                <Container
                         style={{ display: "flex", alignItems: "center", gap:
                         "4px", padding: 0 }}>
   
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="custom-toggle"                
               /> 
                <Navbar.Collapse id="basic-navbar-nav">


                    <Nav className="d-flex gap-1"
                         style={{                           
                         flexWrap: "wrap",
                         display: "flex",
                         flexDirection: "row",   // 👈 assegura que estiguin en línia
                         gap: "1px",             // 👈 menys separació
                         alignItems: "center"
                         }} >
                       <Nav.Link
                            onClick={() => navigate("/JMCopyRight")}
                            className="border rounded"
                             style={{
                              padding: "2px 2px",
                              fontSize: "11px",
                              borderRadius: "10px",
                              backgroundColor: "yellow",
                              textAlign: "center" ,
                              whiteSpace: "nowrap"                             
                            }}>
                            CopyRight
                        </Nav.Link>
                         <Nav.Link
                            onClick={() => navigate('/JMTermsConditions')}
                            className="border rounded"
                             style={{
                              padding: "2px 2px",
                              fontSize: "11px",
                              borderRadius: "10px",
                              backgroundColor: "yellow",
                              whiteSpace: "nowrap"  ,  
                              textAlign: "center"                              
                            }}>
                            Termes i condicions
                        </Nav.Link>
                       {esValid  && (            
                        <Nav.Link
                            onClick={() => navigate("/JMContra")}
                            className="border rounded"
                             style={{
                              padding: "2px 2px",
                              fontSize: "11px",
                              borderRadius: "10px",
                              backgroundColor: 'white',
                              whiteSpace: "nowrap"  ,  
                              textAlign: "center"                              
                            }}>
                            Canvi password
                        </Nav.Link>
                       )} 
                        <div style={{ width: "100%" }}></div> 
                        {adminFam === 'Si' && (               
                          <Nav.Link
                             onClick={() => navigate("/Permisos")}
                             className="border rounded"
                             style={{
                              padding: "2px 2px",
                              fontSize: "11px",
                              borderRadius: "10px",
                              backgroundColor: "red",
                              whiteSpace: "nowrap"  ,  
                              textAlign: "center"
                            }}>
                            Permisos
                          </Nav.Link>
                                )}
                        {adminFam === 'Si' && (     
                          <Nav.Link
                              onClick={() => navigate("/Visites")}
                              className="border rounded"
                             style={{
                              padding: "2px 2px",
                              fontSize: "11px",
                              borderRadius: "10px",
                              backgroundColor: "red",
                              whiteSpace: "nowrap"  ,  
                              textAlign: "center"
                            }}>
                            Últims moviments
                          </Nav.Link>                 
                        )}
                        {adminFam === 'Si' && (
                          <Nav.Link
                             onClick={() => navigate("/Backup")}
                             className="border rounded"
                             style={{
                              padding: "2px 2px",
                              fontSize: "11px",
                              borderRadius: "10px",
                              backgroundColor: "red",
                              whiteSpace: "nowrap"  ,  
                              textAlign: "center"
                            }}>
                            Backups
                          </Nav.Link>
                        )}
                     </Nav>
                    </Navbar.Collapse>
            </Container>
          </Navbar>                          
              
              <h1   className="PP01-link2a" 
                style={{ marginTop: 0, marginBottom: "8px" }}>
                  El racó familiar </h1>  
              <img src={logoR} className="PP01-logo" alt="logo" />
              <img src={noms} className="PP01-logo" alt="logo" />  
              <div style={{ 
                 border: "2px solid white", 
                  borderRadius: "6px", 
                  padding: "2px", 
                  margin: "2px 0",
                  backgroundColor: "rgba(255,255,255,0.2)"
                  }}>                    
                <h2 className="PP01-link2c">Documents i fotografies</h2>
                <h2 className="PP01-link2b">recull de vàries generacions</h2> 
              </div>  
              <div style={{ 
                 border: "2px solid white", 
                  borderRadius: "6px", 
                  padding: "2px", 
                  margin: "2px 0",
                  backgroundColor: "rgba(255,255,255,0.2)"
                  }}>                  
                 <h2 className="PP01-link2c">Jocs i passatemps </h2>
                 <h2 className="PP01-link2b">per quan tingueu un moment de relax</h2>
              </div>
          </header> 
               
          {iniciJMP === 'Si' && (          
            <header className="PP01-header2">    
                    <h2 className="PP01-link2f">Per saber si formes part de l'entorn familiar,</h2>
                    <h2 className="PP01-link2f">entra el teu e-mail i contrasenya</h2>
                    <h2 className="PP01-link2b"> --- </h2>
                
                   <div className='PP01-link2cc d-flex gap-2 align-items-center '>
          
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">                 
                   <Form.Control
                     type="email"
                     style={{ color: '#1a73e8' }} 
                     placeholder="Introdueix e-mail autoritzat"
                     value={email}
                     onChange={(event) => {
                     setEmail(event.target.value);
                     setEmailError('');
                     }}
                   required
                   />
                   {emailError && 
                    <div className="text-danger mt-2">{emailError}</div>}
                </Form.Group>
                  <div>
                    {(esValid === false || esValid === null) && (
                    <Button className=" small-buttonP2 px-4 mr-3 " 
                           variant='primary' type='submit'>
                            Validar 
                    </Button>
                    )}
                  </div>
                  </Form> 
                         
                </div> 
                    {siContra === true && (                        
                     <Form onSubmit={handleSubmitPassword}>
                       <Form.Group controlId="formBasicPassword" className="mt-3">
                         <InputGroup>
                          <Form.Control
                             ref={inputRef}
                             type="password"
                             placeholder="clau"
                             onChange={(eventx) => {
                             setContra(eventx.target.value);
                             setContraError('');
                             }}
                           required
                           />                         
                        <Button
                          variant="primary"
                          type="submit"
                          className="ms-2 btn-sm"> Validar Clau
                        </Button>
                       </InputGroup>
                        {contraError && (
                        <div className="text-danger mt-1 fw-bold">{contraError}</div>
                        )}                 
                      </Form.Group>
                    </Form>               
                )} 
          
              </header>   
              )}
              <header className="PP01-header4">
                <div>  
                  {esValid === null && 
                     <p> </p>}
                  {esValid === true && 
                     <p style={{ color: 'green' }}> ✅ Endavant {nomc} !!!!</p>}
                  {esValid === false && (
                     <p style={{ color: 'red' }}> ❌ No és la teva clau !!!!</p>
                  )}
                 <Pbuto 
                           name="fotos" 
                           onClick={mytrips}
                           nLogo='1' 
                           disabled={!esValid}
                  />
                     
                  <Pbuto 
                           name="Jocs" 
                           onClick={jocs}
                           nLogo='2'                             
                           disabled={!esValid}
                   /> 
                   <Pbuto 
                           name="Sortir" 
                           onClick={sacabat}
                           nLogo='3'                             
                           
                   /> 
                   </div>
              </header>   
              
               <header className="PP01-header3"> 
                  {adminFam === 'Si' && (
                    <>
                     <br></br>
                   <h1 className='PP01-link2c'
                   >Ús actual caché :{formatSize(usageMB)} de 
                                        {formatSize(quotaMB)} (
                                        {usagePercent.toFixed(1)}%)</h1>   
                   
                    </> 
                   )}
                   <h2 className='PP01-link2c'>
                                        Altres enllaços d'interés</h2> 
                   <a
                       className="PP01-link2d"
                       href="http://www.santviflix.cat"
                       target="_blank"
                       rel="noopener noreferrer">           
                        Obres  del    Centre  Sant  Vicenç  (Santviflix)
                   </a>
                   <a
                       className="PP01-link2d"
                       href="http://santvistore.web.app/"
                       target="_blank"
                       rel="noopener noreferrer">           
                       Documents  del Centre Sant Vicenç (SantviHist)
                   </a>   
                            
                   <a
                       className="PP01-link2d"
                       href="http://www.josepmaspons.cat"
                       target="_blank"
                       rel="noopener noreferrer">  
                       {Versio03} 
                   </a>                    
                       <h3 className='PP01-link2d'>( {Versio01} {Versio02})</h3> 
            
               </header>               
           </div>          
       </div>
   </div> 
   );
}

export default Pinici;
