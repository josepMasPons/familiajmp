import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './index.css';

import App from './App';
import JMLogin from './JMComponents/JMLogin';

import JMTermsConditions  from '../Backups/JMTermsConditions';
import JMCopyRight        from './Backups/JMCopyRight';
import Backup             from './Backups/Backup';
import Importacio         from './Backups/Importacio';
import Exportacio         from './Backups/Exportacio';
import Coleccions         from './Backups/Coleccions';
import Versio             from './Backups/Versio';

import JMManten from './JMComponents/JMManten';
import JMAltaReg from './JMComponents/JMAltaReg';
import Pantalla02 from './JMComponents/Pantalla02';
import Pantalla02B from './JMComponents/Pantalla02b';
import Pantalla03 from './JMComponents/Pantalla03';
import Pantalla04 from './JMComponents/Pantalla04';
import Pantalla05 from './JMComponents/Pantalla05';
import Pantalla06 from './JMComponents/Pantalla06';

import Visites from './JMComponents/Visites';
import JMAltKey from './JMComponents/JMAltKey';
import JMInvit from './JMComponents/JMInvit';
import JMContra from './JMComponents/JMContra';
import Preguntes from './JMComponents/Preguntes';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/'        element={<App />} />
        <Route path='/JMLogin' element={<JMLogin />} />

        <Route path='/Backup' element={<Backup />} />
        <Route path='/Exportacio' element={<Exportacio />} />     
        <Route path='/Importacio' element={<Importacio />} />
        <Route path='/Coleccions' element={<Coleccions />} /> 
        <Route path='/Versio'     element={<Versio />} /> 
        <Route path='/JMTermsConditions' element={<JMTermsConditions />} />                  
        <Route path='/JMCopyRight' element={<JMCopyRight />} />

        <Route path='/JMManten' element={<JMManten />} />       
        <Route path='/Pantalla02' element={<Pantalla02 />} />
        <Route path='/Pantalla02B' element={<Pantalla02B />} />
        <Route path='/Pantalla03' element={<Pantalla03 />} />
        <Route path='/Pantalla04' element={<Pantalla04 />} />
        <Route path='/Pantalla05' element={<Pantalla05 />} />
        <Route path='/Pantalla06' element={<Pantalla06 />} />
        <Route path='/Visites' element={<Visites />} />
        <Route path='/JMAltKey' element={<JMAltKey />} />
        <Route path='/JMInvit' element={<JMInvit />} />
        <Route path='/JMAltaReg' element={<JMAltaReg />} />
        <Route path='/JMContra' element={<JMContra />} />
        <Route path='/Preguntes' element={<Preguntes/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);
