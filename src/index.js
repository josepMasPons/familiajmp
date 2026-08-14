import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import './index.css';

import App from './App';
import Pinici from './WComponents/Pinici';
import Pbuto from './WComponents/Pbuto';

import JMTermsConditions  from './Backups/JMTermsConditions';
import JMCopyRight        from './Backups/JMCopyRight';
import Backup             from './Backups/Backup';
import Importacio         from './Backups/Importacio';
import Exportacio         from './Backups/Exportacio';
import Coleccions         from './Backups/Coleccions';
import Versio             from './Backups/Versio';        

import JMManten from './WComponents/JMComponents/JMManten';
import JMAltaReg from './WComponents/JMComponents/JMAltaReg';
import JMContra from './WComponents/JMComponents/JMContra';
import Pantalla02 from './WComponents/JMComponents/Pantalla02';
import Pantalla02B from './WComponents/JMComponents/Pantalla02b';
import Pantalla03 from './WComponents/JMComponents/Pantalla03';
import Pantalla04 from './WComponents/JMComponents/Pantalla04';
import Pantalla05 from './WComponents/JMComponents/Pantalla05';
import Pantalla06 from './WComponents/JMComponents/Pantalla06';
import Netejacache from './WComponents/JMComponents/Netejacache';
import Visites    from './WComponents/JMComponents/Visites';
import Permisos   from './WComponents/JMComponents/Permisos';
import JMInvit    from './WComponents/JMComponents/JMInvit';
import Preguntes    from './WComponents/JMComponents/Preguntes';

import Puzzle01 from './WComponents/jocs/puzzle/Puzzle01'; 
import Caçador from './WComponents/jocs/Caçador/Caçador';
import Pinball from './WComponents/jocs/Pinball/Pinball';
import Tetris    from './WComponents/jocs/Tetris/Tetris';
import QuatreenRatlla from './WComponents/jocs/quatreenratlla/QuatreenRatlla';
import Memory    from './WComponents/jocs/Memory/Memory';
import Marcians  from './WComponents/jocs/Marcians/Marcians';
import Ruleta  from './WComponents/jocs/Ruleta/Ruleta';
import Avis  from './WComponents/jocs/Avis/Avis';
import Jocs0 from './WComponents/jocs/Jocs0';
import WorldMap from './WComponents/JMComponents/WorldMap';

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


