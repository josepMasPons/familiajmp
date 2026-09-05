//import React from 'react';
import React, { useState, useEffect } from 'react';
import alienImg1 from './alien1.png';
import alienImg2 from './alien2.png';
import alienImg3 from './alien3.png';
import alienImg4 from './alien4.png';
import bomba     from './bom.png';
  
const Alien = ({ position, top , Aimage }) => {
  const [aliensG, setAliensG] = useState([alienImg1]);
  //console.log('imatge --- '+ Aimage);
  useEffect(() => {
    if(Aimage === 1) {setAliensG([alienImg1])};
    if(Aimage === 2) {setAliensG([alienImg2])};
    if(Aimage === 3) {setAliensG([alienImg3])};
    if(Aimage === 4) {setAliensG([alienImg4])};    
    if(Aimage === 5) {setAliensG([bomba])};    
  }, []);     
  return (    
    <div className="ALalien" style={{ left: `${position}%`, top: `${top}%` }}>
      <img src={aliensG} alt="Alien" />
    </div>
  );
};

export default Alien;
