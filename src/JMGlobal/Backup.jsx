import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Nav, Col, Card, Button } from "react-bootstrap";
import { emoji } from "./emoji";
import Benrera from './Benrera';

const Backup = () => {
  const navigate=useNavigate();
  function Sacabat() {    
     localStorage.setItem('Programa', '/PInici');
     localStorage.setItem('IniciJMP', 'No');
     navigate('/PInici');
  }
  Benrera(Sacabat);
  return (
    <>  
     <div  style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>  
         <h1 style={{ marginBottom: "20px" }}> 📦 Backup i Restore </h1>
         <h2 style={{ marginBottom: "10px" }}> 💾 Còpies de seguretat de la base de dades</h2>
         <h3 style={{ marginTop: "20px" }}>    ⚙️ Mecànica de funcionament </h3>
        <div style={{ marginTop: "10px", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "2px" }}>🔹 <strong>Backup</strong></p>
            <p style={{ marginBottom: "2px" }}>➡️ Busquem les col·leccions a exportar</p>
            <p style={{ marginBottom: "2px" }}> Als camps <i>document</i></p>
            <p style={{ marginBottom: "2px" }}> de la col·lecció: <strong>Index_Coleccio</strong></p>
            <p style={{ marginBottom: "2px" }}> i copiem les col·leccions en format CSV</p>
            
            <p style={{ marginTop: "30px" }}> ➡️ les imatges s'exportaràn apart </p>   
            <p style={{ marginBottom: "2px" }}>  exemple :  <strong>:gsutil -m cp -r gs://santvibd.appspot.com/'' 'C:\Users\jmas2\Downloads'</strong></p> 
            <br></br>
            <hr style={{ width: "50%", margin: "20px auto" }} />
        </div>        
        <div style={{ marginTop: "10px", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "2px" }}>🔹 <strong>Restore</strong></p>
            <p style={{ marginBottom: "2px" }}>➡️ Seleccionem un fitxer CSV per importar</p>
            <p style={{ marginBottom: "2px" }}>  el programa verifica que la colecció no existeixi</p>
            <p style={{ marginBottom: "2px" }}> i si tot es correcte, fem la importació</p>
            
            <p style={{ marginTop: "30px" }}> ➡️ les imatges s'importaran apart </p>   
            <p style={{ marginBottom: "2px" }}> exemple : <strong>gsutil -m cp -r 'C:\Users\jmas2\Downloads'    gs://santvibd.appspot.com/</strong>  </p> 
            <br></br>         
        </div>  
        <div className="d-flex justify-content-center mt-3 gap-2">
           <Button className="mb-2" 
                     variant="warning"
                     size='sm'
                      onClick={Sacabat}>                                      
                  Enrere
            </Button>
            <Button className="mb-2" 
                     variant="primary"
                     size='sm'
                     onClick={() => navigate('/Exportacio')}>                                            
                     Backup
            </Button>
            <Button className="mb-2" 
                     variant="primary"
                     size='sm'
                     onClick={() => navigate('/Importacio')}>                                            
                     Restore
            </Button>
             <Button className="mb-2" 
                     variant="primary"
                     size='sm'
                     onClick={() => navigate('/Coleccions')}>                                            
                     Coleccions actuals
            </Button>
         </div>           
       
      </div>  
     
 </>
)
}
export default Backup;
