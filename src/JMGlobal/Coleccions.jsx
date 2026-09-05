
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseLoc";
import { collection, writeBatch, doc, getDocs, } from 'firebase/firestore';
import { Button } from "react-bootstrap";
import Papa from 'papaparse';
import { emoji } from "./emoji";

const Coleccions = () => {
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
            <h1>Coleccions actuals a Firebase</h1>
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
   </div>      
 )}
export default Coleccions;
