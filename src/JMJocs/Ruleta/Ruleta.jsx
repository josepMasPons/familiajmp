import { useState } from "react";
import Ruleta from "../1Motors/RuletaMotor";
import Daus from "../1Motors/DausMotor";
import "./Ruleta.css";
import { useNavigate } from "react-router-dom";
import { Form, Button} from "react-bootstrap";
import f01 from "./ImatgesRuleta/esquirol.jpg";
import f02 from "./ImatgesRuleta/gorila.jpg";
import f03 from "./ImatgesRuleta/hipopòtam.jpg";
import f04 from "./ImatgesRuleta/lleó.jpg";
import f05 from "./ImatgesRuleta/llop.jpg";
import f06 from "./ImatgesRuleta/lloro.jpg";
import f07 from "./ImatgesRuleta/os.jpg";
import f08 from "./ImatgesRuleta/senglar.jpg";
import f09 from './ImatgesRuleta/camell.jpg';
import f10 from './ImatgesRuleta/cervol.jpg';
import f11 from './ImatgesRuleta/elefant.jpg';
import f12 from './ImatgesRuleta/tigre.jpg';
import f13 from './ImatgesRuleta/zebra.jpg';
import f14 from './ImatgesRuleta/balena.jpg';
import f15 from './ImatgesRuleta/tortuga.jpg';
const LLOCS = [
  'La Sabana',
  'La Selva',
  'El Mar',
  'El Riu',
  'La Muntanya',
  'La Plana',
  'El Dessert',
  'El cim',
  'La Vall',
  'El Cel',
  'La Platja',
  'El Manglar',
  'La Ciutat',
  'El Congost',
  'Al Puig'
];
 
//const LLOCS = [SECTORS.leng]
const IMATGES = [f01,f02,f03,f04,f05,f06,f07,f08,
                 f09,f10,f11,f12,f13,f14,f15];

const NOMS = [
  " Esquirols",
  " Goriles",
  " Hipopòtams",
  " Lleons",
  " Llops",
  " Lloros",
  " Ossos",
  " Senglars",
  ' Camells',
  ' Cèrvols',
  " Elefants",
  ' Tigres',
  ' Zebres',
  ' balenes',
  ' Tortugues'];
export default function PantallaJoc() {
  const navigate = useNavigate();
  const [go1, setGo1] = useState("Of");
  const [go2, setGo2] = useState("Of");
  const [go3, setGo3] = useState("Of");
  const [go4, setGo4] = useState("Of");
  const [resultat1, setResultat1] = useState("");
  const [resultat2, setResultat2] = useState("");
  const [resultat3, setResultat3] = useState("");
  const [resultat4, setResultat4] = useState("");
  const [nomc, setNomc] = useState
        (localStorage.getItem('NomJ') || 'convidat');
  const go12 = () => {
    setResultat1('');
    setResultat2('');
    setResultat3('');
    setResultat4('');
    setGo1('On');
    setGo2('On');
    setGo3('On');
    setGo4('On');
    setTimeout(() => {
       setGo1('Of');
       setGo2('Of');
       setGo3('Of');
       setGo4('Of');
    }, 8000); 
  }
   const Sacabat = () => {
    navigate('/Jocs0');
  }
  return (
    <div className="casino-bg">
    <div className="casino-wrapper">
      <h3 className="casino-nom">Benvingut {nomc}</h3>
      <h1 className="casino-title">Magic answers</h1>
      <div className="ruletes-container">
        <Ruleta
          images={IMATGES}
          param='I'
          go= {go1}
          delay='1'
          onGuanyador={(i) => setResultat1(NOMS[i])}
          mides='160'
        />      
        <Ruleta
          images={LLOCS}
          param='S'
          go={go2}
          delay='2'
          onGuanyador={(i) => setResultat2( LLOCS[i])}
          mides='160'
        />
      </div>
      <div className="daus-container">
          <Daus 
           images=''
           param=''
           go={go3}
           delay='1'
           onGuanyador={(i) => setResultat3(i)} 
           mides='60'  
          />
          <Daus 
           images=''
           param=''
           go={go4}
           delay='2'
           onGuanyador={(i) => setResultat4(i)} 
           mides='60'  
          />
      </div>
      <Button className="mb-2" 
                        variant="primary"
                           size='sm'
                        onClick={go12}>                                      
                      Inici Ruleta  
      </Button> 
      <Button className="mb-2" 
                        variant="warning"
                           size='sm'
                        onClick={Sacabat}>                                      
                      Sortir Joc   
      </Button> 
       {(resultat1 ==='' || resultat2 === '') && (
                    <span>.</span>                
       )}
      {resultat1 !='' && resultat2 != '' && (
        <div className="casino-result">
            🎯 <span>Hem vist   {resultat3+resultat4} {resultat1} vora  {resultat2}</span>                
        </div>
      )};
   
    </div>
    </div>
  );
}
