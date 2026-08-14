/*  ---- informació general del programa Verificacio.js ---
        ---------------------------------------------------
        Programa que verifica l'integritat de les dades
        en els diferents bases de dades Firestore-database
            
      aplicació (Case 10)
    ----------------------------------------------- */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import {storageCar, db } from '../../firebaseLoc'; 
import { collection, getDocs } from 'firebase/firestore';
import { ref as refCar, listAll, getDownloadURL } from 'firebase/storage'; 
import "./Global.css";
import { Timestamp } from "firebase/firestore/lite";

const Verificacio = () => {
  const navigate=useNavigate();
  const [vtemp, setVtemp] = useState([]);  
  const [vobra, setVobra] = useState([]);    
  const [data, setData] = useState([]);   
  const [hist, setHist] = useState(false);
  const [countA, setCountA] = useState(0); // Comptador de registres llegits
  const [countC, setCountC] = useState(0); // Comptador de registres informats
  const [fina,setFina] = useState(false);
  const [ferror, setFerror] = useState(0);
  const [fefi, setFefi] = useState(0);
  let Rerror = 0;
  let BoDocums = false;
  let BoFotos = false;
  let BoVuit = false;
  const Proces = async () => {     
    //console.log('comensa el procés - ');
    const linksCollection = collection(db, 'SantviHist');
    const querySnapshot = await getDocs(linksCollection);

    // Obtenir les dades filtrades
    const linksData = querySnapshot.docs
        .map(doc => ({
            temp: doc.data().c01_temp,
            obra: doc.data().c02_obrac,
            ...doc.data()
        }))
        .filter(doc => doc.obra && doc.obra.trim() !== ""); 
      const temps = [];
      const obras = []; 
      linksData.forEach(doc => {
      const { temp, obra } = doc; 
      //console.log('en procés - '+temp + '/' +obra+ '/Fotos');
      // Aquí pots guardar 'temp' i 'obra'  
      temps.push(temp);  
      obras.push(obra); 
    });         
      setVtemp(temps);
      setVobra(obras);    
    // console.log('en procés - '+ vtemp[1] + '/' + vobra[1] + '/Fotos');
    setData(linksData); // Desa els registres filtrats
     
    setCountC(linksData.length); 
    Llegir();
    setHist(true);
  };
  
  const Llegir = async () => {
    // Aquesta funció ara actualitzarà el comptador amb els registres llegits
    const linksCollection = collection(db, 'SantviHist');
    const querySnapshot = await getDocs(linksCollection);

    // Actualitzar el comptador amb el total de registres llegits
    const totalRegistres = querySnapshot.docs.length;
    setCountA(totalRegistres);

    // Pots fer altres operacions amb els registres llegits si cal
  };

  
  const VerificarD = async (refPath) => {
    const storageRef = refCar(storageCar, refPath);   
    try {
      const resultat = await listAll(storageRef);  
      // Comprovem si no hi ha cap element al camí
      if (resultat.items.length === 0) {
       // console.warn(`No trobat - ${refPath}.`);
        return [];  // Tornem una llista buida si no hi ha elements
      }
      BoDocums=true;
      /*
          Si s'han trobat fitxers, obtenim les URLs
      const urls = await Promise.all(
        resultat.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            return { url, name: itemRef.name };
          } catch (error) {
            console.error("Error en obtenir la URL per ítem:", itemRef.name, error);
            return null;  // Retornem null si no podem obtenir la URL
          }
        })   
      ); 
  
      //console.log('URLs trobades:', urls);
      return urls.filter(url => url !== null);  // Filtrar els resultats null
       */
    } catch (error) {
      console.error(`Error en accedir a ${refPath}:`, error);
      return null;  // Tornem null en cas d'error, però no bloquegem el codi
    }
  };
  const VerificarF = async (refPath) => {
    const storageRef = refCar(storageCar, refPath); 
    try {
      const resultat = await listAll(storageRef);
      if (resultat.items.length === 0) {
      return []; 
      }
      BoFotos=true;
      /*
      // Si s'han trobat fitxers, obtenim les URLs
      const urls = await Promise.all(
        resultat.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            return { url, name: itemRef.name };
          } catch (error) {
            console.error("Error en obtenir la URL per ítem:", itemRef.name, error);
            return null;  // Retornem null si no podem obtenir la URL
          }
        })
      );
  
      //console.log('URLs trobades:', urls);
      return urls.filter(url => url !== null);  // Filtrar els resultats null
       */
    } catch (error) {
      console.error(`Error en accedir a ${refPath}:`, error);
      return null;  // Tornem null en cas d'error, però no bloquegem el codi
    }
  };
  const VerificarV = async (refPath) => {
    const storageRef = refCar(storageCar, refPath); 
    try {
      const resultat = await listAll(storageRef);        
     if (resultat.items.length === 0) { 
        BoVuit=true;          
        return [];   
      }
         
    } catch (error) {
      console.error(`Error en accedir a ${refPath}:`, error);
      return null;  // Tornem null en cas d'error, però no bloquegem el codi
    }
  };
  const VerificarInic = async () => {
    if (vtemp.length > 0 && vobra.length > 0) {
      console.log('registres a verificar  - ' + vtemp.length );
      for (let i = 0; i < vtemp.length; i++) {
        const grup1Path = `${vtemp[i]}/${vobra[i]}/Docums`;
        const grup2Path = `${vtemp[i]}/${vobra[i]}/Fotos`;  
        const grup3Path = `${vtemp[i]}/${vobra[i]}`;  
       // console.log(`Verificant ${grup3Path}`);
        BoDocums=false;
        BoFotos=false;
        BoVuit=false;
        const grup1 = await VerificarD(grup1Path);
        const grup2 = await VerificarF(grup2Path);
        const grup3 = await VerificarV(grup3Path);
        if(BoDocums === false && 
           BoFotos  === false &&
           BoVuit   === false) {                
            let x=Rerror;
            Rerror = x+1;
            console.log(Rerror + ' = ' + vtemp[i]+ '/' + vobra[i]);
            setFerror(Rerror);                
        } 
        setFefi(i);     
       // console.log('en proces -- ' + i);
      }
      setFina(true);
    } else {
      console.log('vtemp o vobra no tenen prou valors ');
    }
    
  };
  function Sacabat() {    
    localStorage.setItem('Programa', '/Pantalla02');
    navigate('/Pantalla02');
}  
  
  return (
    <div>
       <div className="ImP02VE">   
          <div className='ImP02-headerVE'>
            <h1 className="ImP02-linkVE">santvihist Verificacions</h1>         
            <h1 className="ImP02-cap1VE">Aquest programa verifica la base de dades Firebase Firestore Database</h1>
            <h1 className="ImP02-cap1VE">SantviHist --- reg: c02_obrac = informat</h1>
            <h1 className="ImP02-cap2VE">Busca si existeix a Firestore storage</h1>
            <h1 className="ImP02-cap2VE">c01_temp / c02_obrac / Docums</h1>
            <h1 className="ImP02-cap2VE">c01_temp / c02_obrac / Fotos</h1>
            <div className="ImbutonsVE">             
              <button className="ImP02-butoVE" onClick={Proces}>
                Fer el procés
              </button>
              <button className="ImP02-butoVE" 
                      onClick={Sacabat}>
                 Final programa
              </button>
            </div>
            {hist === true && (
              <div>
                <h2 className='ImP02-link3VE'>
                  Total registres llegits   - {countA}
                  <br></br>
                  Total registres informats - {countC}
                </h2> 
                <button className="ImP02-butoVE" 
                onClick={VerificarInic}>
                 verificar
                </button>        
               
                <h2 className='ImP02-link3VE'>
                  registres a revisar      - {vtemp.length} 
                  <br></br>
                  en procés             - {fefi}  
                   <br></br>
                  Esperi final .. errors =   - {ferror} </h2> 
               
              </div> 
            )}
            {fina === true && (
              <h2 className='ImP02-link3VE'>
                  Total registres a revisar    - {ferror} </h2>
             )} 
          
            <div>
         </div>
      </div>
      </div>
     
    </div>
  );
}

export default Verificacio;
