
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emoji } from "./emoji";

  const Versio = () => {
    const navigate=useNavigate();
    let Versio01 = emoji.grup + 'Familiarjmp/ Versió 7.00';
    let Versio02 = emoji.rellotge + '04-2026';
    let Versio03 = emoji.usuari + 'Copyright 2026 Jmas  /  http://www.josepmaspons.cat';
    let Versio04 = '---------------------------- ';
    let Versio05 = emoji.notificacio + 'Jocs i Backups actualitzats ';
    let Versio06 = '------------------------------ '; 
    localStorage.setItem('Versio01', Versio01);
    localStorage.setItem('Versio02', Versio02);
    localStorage.setItem('Versio03', Versio03);
    localStorage.setItem('Versio04', Versio04);
    localStorage.setItem('Versio05', Versio05);
    localStorage.setItem('Versio06', Versio06);

    return (
    <div></div>      
 )
};
export default Versio;
 //************************************************************* 
  let Versio01 = 'Familiarjmp / Versió 7.00';
  let Versio02 = ' / 05-2026  jocs actualitzats ';
  let Versio03 = 'Copyright 2026 Jmas  /  http://www.josepmaspons.cat';
   //************************************************************* 
  localStorage.setItem('Versio01', Versio01);
  localStorage.setItem('Versio02', Versio02);
  localStorage.setItem('Versio03', Versio03);