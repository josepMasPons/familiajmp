import { useEffect, useState } from "react";
import { collection, getDocs , getFirestore} from "firebase/firestore"; 
import { db } from "../firebaseLoc";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { emoji } from "./emoji";
import Benrera from "./Benrera";

  const Exportacio = () => {
  const navigate = useNavigate();
  const [coleccio, setColeccio] = useState([]);  
  const [estat, setEstat] = useState(0);
  const [sit, setSit] = useState(true);
  const [logs, setLogs] = useState([]);

  const msg = `${emoji.rocket} Deploy completat ${emoji.check}`;
  console.log(msg);

 // 🟢 1. buscar les coleccions i posar-ho a coleccio.*************
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
  const Proces = async () => {
    setSit(false);
    for (const item of coleccio) {
       await exportFirestore(item);
}
    };
  // 🟢 2. Llegir dades de la coleccio i fer el proces *********************
  
const exportFirestore = async (collectionName) => {
  try {
    
    const colecciow = collectionName.trim();
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, colecciow));

    if (querySnapshot.empty) {
      alert(`a ${colecciow} No hi ha dades per exportar!`);      
      return;
    }

    // 🟢 1. Ordre manual prioritari
    const PRIORITY_HEADERS = [
    //  "clase",
    //  "codi",
    //  "mail",
     // "notes",
   //   "password"
    ];

    // 🟢 2. Llegir dades
    const data = [];
    querySnapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // 🟢 3. Detectar tots els camps existents
    const allKeysSet = new Set();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeysSet.add(key));
    });

    const allKeys = Array.from(allKeysSet);

    // 🟢 4. Treure duplicats dels PRIORITY
    const extraKeys = allKeys.filter(k => !PRIORITY_HEADERS.includes(k));

    // 🟢 5. Headers finals = manual + automàtics
    const finalHeaders = [...PRIORITY_HEADERS, ...extraKeys];

    // 🟢 6. (Opcional) EXCLOURE camps sensibles
    //const EXCLUDED = ["password"]; // elimina si el vols
    //const finalHeaders = headers.filter(h => !EXCLUDED.includes(h));

    // 🟢 7. Crear files
    const rows = data.map(row =>
      finalHeaders.map(header => row[header] ?? "")
    );

    // 🟢 8. CSV
    const prefix = "##@@##";
    const csvContent = [
       prefix + finalHeaders.join(";"),
       ...rows.map(r => prefix + r.join(";"))
    ].join("\n");
   // 🟢 9. Data
    const dataF = new Date();
    const any = dataF.getFullYear();
    const mes = String(dataF.getMonth() + 1).padStart(2, '0');
    const dia = String(dataF.getDate()).padStart(2, '0');
    const hora = String(dataF.getHours()).padStart(2, '0');
    const minuts = String(dataF.getMinutes()).padStart(2, '0');
    const dataBona = `${any}-${mes}-${dia}-${hora}-${minuts}`;

    // 🟢 10. Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Export_${colecciow}_${dataBona}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Exportats ${rows.length} registres correctament de ${colecciow}`);
    const logw = `Exportats ${rows.length} registres correctament de ${colecciow}`;
    setLogs(prev => [
  ...prev,
  {
    coleccio: colecciow,
    registres: rows.length,
    notes: logw
  }
]);
    setEstat(prev => prev + 1);
  } catch (error) {
    console.error("Error:", error);
    alert("Error en l'exportació");
  }
};  
 function Sacabat() {    
     navigate('/Backup');
  }
  Benrera(Sacabat);
  return (
    <>
     <div>      
          <div className="mt-3 text-center">
            <h1>Exportació de totes les coleccions</h1>
               <div className="d-flex justify-content-center">
                 <Button
                    className="mb-2"
                    variant="warning"
                    size="sm"
                    onClick={Sacabat}
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
            Coleccions a Exportar
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
      {sit && ( 
      <div className="d-flex justify-content-center mt-3">
           <Button className="mb-2" 
                  variant="primary"
                           size='sm'
                            onClick={Proces}>                                      
                  Exportar dades
           </Button>
      </div> 
      )} 
      {!sit && ( 
        <>
        <div 
            style={{ marginTop: "20px", textAlign: "center",  overflowX: "auto"   }}>     
          <table             
            style={{
              borderCollapse: "collapse",
              minWidth: "300px",    
              width: "auto",          // 👈 no ocupa tota la pantalla
              margin: "10px auto",   // 👈 centrada 
              fontSize: "12px",        // 👈 text més petit
              backgroundColor: "#ffffff",   // 👈 fons blanc
              color: "#333"                 // 👈 text gris fosc
            }}>    
            <thead>
              <tr style={{ backgroundColor: "#e6e6e6" }}>
                <th style={{ padding: "8px", border: "1px solid #ccc", color: "#ccc" }}>Col·lecció</th>
                <th style={{ padding: "8px", border: "1px solid #ccc", color: "#ccc" }}>Registres</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item, index) => (
                <tr key={index}  style={{ backgroundColor: "#ffffff", color: "#000" }}>
                    <td
                      style={{ 
                          padding: "8px", 
                          border: "1px solid #ccc",
                          backgroundColor: "#ffffff",   // 👈 força blanc
                          color: "#000"
                      }}>
                         {item.coleccio}
                    </td>
                    <td
                      style={{ 
                          padding: "8px", 
                          border: "1px solid #ccc",
                          backgroundColor: "#ffffff",   // 👈 força blanc
                          color: "#000"
                      }}>
                     
                       {item.registres}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      </>
      )}       
      <div className="d-flex justify-content-center">
                 <Button
                    className="mb-2"
                    variant="warning"
                    size="sm"
                    onClick={Sacabat}
                  >
                         Final programa
                  </Button>
            </div>
     </div>                
</> 
  );
};
export default Exportacio;