import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useNavigate , useLocation} from 'react-router-dom';
import Versio  from "./JMGlobal/Versio";
 
function App() {
  const [missatge,setMissatge] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { 
       Proces();
  
  }, []); 
  const Proces = () => {  
   localStorage.setItem('IniciJMP', 'Si'); 
   navigate('/Pinici')
  };
 return (
    <div>
       <Versio/>    
    </div>
     );
}
export default App;