import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import './index.css';

import App from './App';
import Pinici             from './JMGlobal/Pinici';
import Pbuto              from './JMGlobal/Pbuto';
import JMTermsConditions  from './JMGlobal/JMTermsConditions';
import JMCopyRight        from './JMGlobal/JMCopyRight';
import Backup             from './JMGlobal/Backup';
import Importacio         from './JMGlobal/Importacio';
import Exportacio         from './JMGlobal/Exportacio';
import Coleccions         from './JMGlobal/Coleccions';
import Versio             from './JMGlobal/Versio';        

import JMManten           from './JMComponents/JMManten';
import JMAltaReg          from './JMComponents/JMAltaReg';
import JMContra           from './JMComponents/JMContra';
import Pantalla02         from './JMComponents/Pantalla02';
import Pantalla02B        from './JMComponents/Pantalla02b';
import Pantalla03         from './JMComponents/Pantalla03';
import Pantalla04         from './JMComponents/Pantalla04';
import Pantalla05         from './JMComponents/Pantalla05';
import Pantalla06         from './JMComponents/Pantalla06';
import Netejacache        from './JMComponents/Netejacache';
import Visites            from './JMComponents/Visites';
import Permisos           from './JMComponents/Permisos';
import JMInvit            from './JMComponents/JMInvit';
import Preguntes          from './JMComponents/Preguntes';

import Puzzle01           from './JMJocs/puzzle/Puzzle01'; 
import Caçador            from './JMJocs/Caçador/Caçador';
import Pinball            from './JMJocs/Pinball/Pinball';
import Tetris             from './JMJocs/Tetris/Tetris';
import QuatreenRatlla     from './JMJocs/quatreenratlla/QuatreenRatlla';
import Memory             from './JMJocs/Memory/Memory';
import Marcians           from './JMJocs/Marcians/Marcians';
import Ruleta             from './JMJocs/Ruleta/Ruleta';
import Avis               from './JMJocs/Avis/Avis';
import Jocs0              from './JMJocs/Jocs0';
import WorldMap           from './JMComponents/WorldMap';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/'                  element={<App/>} />         
        <Route path='/Pinici'            element={<Pinici/>} />
        <Route path='/Pbuto'             element={<Pbuto/>} />

        <Route path='/Backup' element={<Backup />} />
        <Route path='/Exportacio' element={<Exportacio />} />     
        <Route path='/Importacio' element={<Importacio />} />
        <Route path='/Coleccions' element={<Coleccions />} /> 
        <Route path='/Versio'     element={<Versio />} /> 
        <Route path='/JMTermsConditions' element={<JMTermsConditions />} />                  
        <Route path='/JMCopyRight' element={<JMCopyRight />} />

        <Route path='/JMManten'          element={<JMManten />} />
        <Route path='/JMContra'          element={<JMContra />} />
        <Route path='/Pantalla02' element={<Pantalla02 />} />
        <Route path='/Pantalla02B' element={<Pantalla02B />} />
        <Route path='/Pantalla03' element={<Pantalla03 />} />
        <Route path='/Pantalla04' element={<Pantalla04 />} />
        <Route path='/Pantalla05' element={<Pantalla05 />} />
        <Route path='/Pantalla06' element={<Pantalla06 />} />
        <Route path='/Netejacache' element={<Netejacache />} />
        <Route path='/Visites' element={<Visites />} />
        <Route path='/Permisos' element={<Permisos />} />
        <Route path='/JMInvit' element={<JMInvit />} />
        <Route path='/JMAltaReg' element={<JMAltaReg />} />

        <Route path='/WorldMap' element={<WorldMap />} /> 
        
        <Route path='/Puzzle01'          element={<Puzzle01/>} />
        <Route path='/Caçador'          element={<Caçador/>} />
        <Route path='/Pinball'          element={<Pinball/>} />
        <Route path='/Marcians'          element={<Marcians/>} />
         <Route path='/Ruleta'          element={<Ruleta/>} />
         <Route path='/Avis'            element={<Avis/>} />
        <Route path='/Memory'            element={<Memory/>} />
        <Route path='/QuatreenRatlla'    element={<QuatreenRatlla/>} />        
        <Route path='/Tetris'            element={<Tetris/>} />
        <Route path='/Jocs0'             element={<Jocs0/>} />
        <Route path='/Preguntes'        element={<Preguntes/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);


