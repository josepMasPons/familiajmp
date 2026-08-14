import React, { useEffect, useState } from 'react';
import logo01 from "./Jocs0.png";
import logo02 from "./Jocs0.png";
import "./Jocs0.css";
import Jocs0Buto from "./Jocs0Buto.jsx";
import { useNavigate } from "react-router-dom";
import { storageCar, db } from '../../firebaseLoc';
import { collection, deleteDoc, writeBatch, doc, limit, query, getDocs } from 'firebase/firestore';


function Jocs0() {
  const navigate = useNavigate();
  const [primer, setPrimer] = useState(null);
  const passWord = localStorage.getItem('PassWord');
  const passNom = localStorage.getItem('PassNom');
  const passTip = localStorage.getItem('PassTip');
  const passMail = localStorage.getItem('PassMail');
  let Versio01 = localStorage.getItem('Versio01');
  let Versio02 = localStorage.getItem('Versio02');
  let Versio03 = localStorage.getItem('Versio03');   
    
  const [logoR, setLogoR] = useState('');
  
  useEffect(() => {
    const processar = async () => {
    let primerCalculat;
    try {
      const linksCollection = collection(db, 'SantviLog');
      const primerRegistre = query(linksCollection, limit(1));
      const querySnapshot = await getDocs(primerRegistre);
       
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
    } catch (err) {
      console.error("Error processant log:", err);
      primerCalculat = 99000;
    }
    setPrimer(primerCalculat);
  } 
    processar();
   }, []);
  
  const gravarJoc = async (joc) => {
      const csvCollection = collection(db, 'SantviLog');
      const batch = writeBatch(db);
      const newDocRef = doc(csvCollection, `SantviDoc_${primer}`);
      const data = new Date();
      const dataFormatejada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} - ${data.getHours()}:${data.getMinutes()}`;

      batch.set(newDocRef, {
        C00_ident: primer,
        C01_mail: passMail,
        C02_usuari: passNom,
        C03_clase: 'J',
        C04_temporada: 'Joc',
        C05_obra: joc,
        C06_inici: dataFormatejada,
        C07_final: '',
        C08_notes: ''
      });
      await batch.commit(); 
      let numero = primer - 1;
      setPrimer(numero) ; 
  };
  


  useEffect(() => {     
    const loadRandomImage = () => {
      const imatges = [logo01, logo02];
      const randomIndex = Math.floor(Math.random() * imatges.length);
      const randomImatge = imatges[randomIndex];
      setLogoR(randomImatge);    
    };      
    loadRandomImage();  
  }, []);  
  function Quatreenratlla() { 
    gravarJoc('Quatre en ratlla')    
    navigate('/QuatreenRatlla');
  }
  function tetris() {  
    gravarJoc('Tetris')      
    navigate('/Tetris');
  }  
  function marcians() { 
    gravarJoc('Marcians')       
    navigate('/Marcians');
  } 
  function memory() { 
    gravarJoc('Memory')       
    navigate('/Memory');
  }   
  function caçador() {
    gravarJoc('Caçador')        
    navigate('/Caçador');
  } 
  function pinball() { 
    gravarJoc('Pinball')       
    navigate('/Pinball');
  }   
  function puzzle() {
    gravarJoc('Puzzle')        
    navigate('/Puzzle01');
  }   
   function ruleta() {
    gravarJoc('Ruleta')        
    navigate('/Ruleta');
  }   
   function Avis() {
    gravarJoc('Avis ......')        
    navigate('/Avis');
  }   
  const Sacabat = () => {
    localStorage.setItem('IniciJMP', 'No');
    navigate('/Pinici');
  }

  return (
    <div className='J0nomP'>       
        <div className="J0P01">
          <header className="J0P01-header">
            <br></br>
            <img src={logoR} className="J0P01-logo" alt="logo" />
            <h1 className="J0P01-link">(Jocs fets pel  Josep) </h1>
           
            <h1 className="J0P01-link2a">Recull de jocs online</h1>    
            <h2 className="J0P01-link2aa">per passar una bona estona </h2>
              
            <h2 className="J0P01-link2b"></h2>            
            <div>
              <div> 
                <Jocs0Buto 
                  name="Quatre en ratlla" 
                  onClick={Quatreenratlla}
                  nLogo='1'              
                />
                <Jocs0Buto 
                  name="Tetris" 
                  onClick={tetris}
                  nLogo='2'              
                />   
              </div> 
                 
              <div>             
                <Jocs0Buto  
                  name="Puzzle"                    
                  onClick={puzzle}
                  nLogo='7'                 
                />   
                <Jocs0Buto  
                  name="Memory" 
                  onClick={memory}
                  nLogo='4'               
                />   
              </div> 
               <div>             
                  <Jocs0Buto  
                    name="Ruleta"                    
                    onClick={ruleta}
                    nLogo='8'                 
                  />   
              
                  <Jocs0Buto  
                    name="Joc Avis"                    
                    onClick={Avis}
                    nLogo='8'                 
                  />   
                </div>
              <div> 
                  {/*   
                <Jocs0Buto   
                  name="Aliens" 
                  onClick={marcians}
                  nLogo='3' 
                /> 
                          
                <Jocs0Buto  
                  name="Caçador"  
                  onClick={caçador}
                  nLogo='5'                                      
                />                  
                <Jocs0Buto   
                  name="Pinball" 
                  onClick={pinball}
                  nLogo='6'                     
                /> 
                */} 
             </div>    
            </div>
            <a
              className="J0P01-link3"
              href="http://www.josepmaspons.cat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <br></br>
              {Versio03}(/ josepmaspons.cat)
              <h3 className='J0P01-link3'>Jocs  {Versio01} / {Versio02} </h3> 
            </a>
            <h1 className="J0P01-link"> </h1>   
            <button className="J0P01-buto" onClick={Sacabat}>
                  Finalitzar Jocs
            </button>        
          </header>
        </div>  
    </div>
  );
}
export default Jocs0;