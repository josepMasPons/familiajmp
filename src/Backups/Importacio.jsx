
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseLoc";
import { collection, writeBatch, doc, getDocs, } from 'firebase/firestore';
import { Button } from "react-bootstrap";
import Papa from 'papaparse';
import { emoji } from "./emoji";

const Importacio = () => {
  const navigate=useNavigate();
  const [data, setData] = useState([]);   
  const [showbuto, setShowbuto] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [isDeletefinish, setIsDeletefinish] = useState(false);
  const [isProcessRunning, setIsProcessRunning] = useState(false);
  const [isProcessFinished, setIsProcessFinished] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [coleccio, setColeccio] = useState([]);  
  const [coleI, setColeI] = useState('');  
  const documentCountRef = useRef(1000);
   
  const countC = useRef(0);
   
  const [countB, setCountB] = useState(0);  
  const [countA, setCountA] = useState(0);
  const [situacio, setSituacio] = useState(0);
 
 
const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const colex = fileName.match(/_(.*?)_/);
    const reader = new FileReader();
    setColeI(colex[1]);
    //console.log('coleccio ----- ',colex[1])
    reader.onload = (event) => {
      const result = event.target.result;
    const rows = result.split('\n');
    const records = [];
    let current = '';
    rows.forEach(line => {
        if (line.startsWith('##@@##')) {
          if (current) records.push(current);
              current = line;
          } else {
              current += ' ' + line;
         }
    });
    if (current) records.push(current);
    const parsedData = records.map(r => r.split(';'));
    setData(parsedData.slice(0, 10));
    setTotalRecords(parsedData.length);
 
      // Guardar dades a firebase
      const allRowData = [];
      parsedData.forEach((row, index) => {
        allRowData.push({ id: index, rowData: row });
      });
      setRowData(allRowData);
      //trobarcoleccio(colex[1])
   };
    reader.readAsText(file);
    setSituacio(1);
    setShowbuto(1);
  };
  const deleteandsave = async () => {
     const segur = window.confirm(`Vols substituir la col·lecció ${coleI} per la nova?`);
     if (!segur) {
         console.log("Procés cancel·lat");
        return;
     }

     try {
        await handleDeleteCollection(); 
        console.log('inici grabació ---');
        await handleSaveToFirestore(); 
    
      } catch (error) {
         console.error('Error durant la supressió o la gravació:', error);
      }
      };
//  funció per gravar el fitxer csv a firestore i crear una colecció
 const handleSaveToFirestore = async () => {
     if (isProcessRunning) return;
     setIsProcessRunning(true);
     const csvCollection = collection(db, coleI);
     const batch = writeBatch(db);
     let headers = [];
     rowData.forEach((row, index) => {
      let raw = row.raw || row.rowData.join(';');
  
       // Només processem línies que comencen per ##@@##
        if (!raw.startsWith('##@@##')) return;
       // Eliminem el prefix
       raw = raw.replace('##@@##', '');
       const values = raw.split(';');
       // 👉 Primera línia = capçalera
       if (index === 0) {
           headers = values.map(h => h.trim());
           console.log('Headers detectats:', headers);
           return;
       }
       // Crear objecte dinàmic
       let docData = {};
       headers.forEach((header, i) => {
       docData[header] = values[i]?.trim() || "";
       });

       // 👉 ID del document des del camp "id"
       const docId = docData.id || `auto_${index}`;
       const newDocRef = doc(csvCollection, docId);
       batch.set(newDocRef, docData);
    });
    try {
       await batch.commit();
          console.log('Dades guardades a Firestore');
          setIsProcessFinished(true);
    } catch (error) {
        console.error('Error al guardar dades a Firestore:', error);
    } finally {
       setIsProcessRunning(false);
    }
};

  // Funció per eliminar la col·lecció seleccionada
  const handleDeleteCollection = async () => {
    const csvCollection = collection(db, 'coleI');
    const querySnapshot = await getDocs(csvCollection);

    const batch = writeBatch(db);
    querySnapshot.forEach((docSnapshot) => {
      
     countC.current++;
    // console.log('Regiatres a anular - '+ countC.current);
      batch.delete(docSnapshot.ref);
    });

    batch.commit().then(() => {
      //console.log(`Col·lecció ${coleI} eliminada correctament.`);
      setIsDeletefinish(true);
    }).catch((error) => {
      console.error('Error al eliminar la col·lecció:', error);
    });
  };
   
useEffect(() => {
  if (coleI === '' || coleI === 'null') {

  } else {
 trobarcoleccio(coleI);
  }
},[coleI]);

 const trobarcoleccio = async (cole) => {
    
    // comptador de registres a la coleccio antiga
    const csvCollection = collection(db, cole);
    const querySnapshot = await getDocs(csvCollection); 
    const total = querySnapshot.size; // 🔥 millor opció
    setCountB(total);
  }   

    
useEffect(() => { 
     const fetchColeccio = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Index_Coleccio"));

      const resultats = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.document !== undefined) {
          resultats.push(data.document);
        }
      });

      setColeccio(resultats);
     // console.log("Valors del camp 'document':", resultats);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  fetchColeccio();
   }, []);

 
  return (
    <div>
       
        <div className="mt-3 text-center">
            <h1>Importar  una colecció</h1>
               <div className="d-flex justify-content-center">
                 <Button
                    className="mb-2"
                    variant="warning"
                    size="sm"
                    onClick={() => navigate("/Backup")}
                  >
                         Final programa
                  </Button>
               </div>
          </div> 
      <div style={{ textAlign: "center", marginTop: "20px" }}>
    
        <h2 style={{ 
           fontWeight: "600", 
           marginBottom: "20px" 
        }}>
            Coleccions actuals a Firebase
         </h2>
         <div style={{
            display: "inline-block",
            padding: "20px 30px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            backgroundColor: "#fafafa"
            }}>      
            {coleccio.map((item, index) => (
            <div key={index} style={{
                 padding: "4px 0",          // 👈 menys separació
                 fontWeight: "bold",        // 👈 negreta         
                 fontSize: "18px"
                 }}>
                 {item}
            </div>
            ))}
         </div>
        <div style={{
            marginTop: "2px",
            color: "#171616"
            }}>
               ───────────────
        </div>
      </div>
   <div className='ImP02-header'>
  {situacio === 0 && (
    <>
   <div style={{
    textAlign: "center",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "fit-content",
    margin: "0 auto",
    backgroundColor: "#f9f9f9"
    }}>
    
    <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
      📂 Carrega un fitxer CSV
    </p>

    <p style={{ marginTop: 0, fontSize: "14px", color: "#555" }}>
      Selecciona un arxiu <strong>.csv</strong> per visualitzar-ne el contingut
    </p>

    <input
      className='ImP02-buto'
      type="file"
      accept=".csv"
      onChange={handleFileUpload}
      style={{ marginTop: "10px" }}
    />

  </div>
  <br></br>
  </>
  )}
  {situacio === 1 && (
    <>
  <div style={{
    textAlign: "center",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "fit-content",
    margin: "0 auto",
    backgroundColor: "#f9f9f9"
    }}>
      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
           Colecció   a incorporar    - {coleI}
      </p>
      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
          {`Registres a incorporar de -CSV: ${totalRecords - 1}`}
      </p>
      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
           registres actuals a la colecció - {countB}
      </p>
      <div className="d-flex justify-content-center">
                 <Button
                    className="mb-2"
                    variant="primary"
                    size="sm"
                    onClick={deleteandsave}                      
                  >
                      Restaurar colecció {coleI}
                  </Button>
      </div> 
      <div className="mt-3 text-center">
              <div className="d-flex justify-content-center">
                 <Button
                    className="mb-2"
                    variant="warning"
                    size="sm"
                    onClick={() => navigate("/Backup")}
                  >
                         Final programa
                  </Button>
               </div>
        </div>    
 </div>
 </>
  )}
</div>
 
{isProcessFinished && (

 
  <div style={{
      textAlign: "center",
      padding: "15px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      width: "fit-content",
      margin: "0 auto",
      backgroundColor: "#f9f9f9"
      }}>
      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
           Colecció  Modificada    - {coleI}
      </p>
      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Final correcte. Registres finals : {totalRecords-1}
      </p>     
   </div>  
)};
  </div>      
 )}
export default Importacio;
