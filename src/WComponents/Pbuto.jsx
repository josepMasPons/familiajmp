import React, { useEffect, useState } from 'react';
import './Pinici.css';
import logo1 from '../Plogos/mytrips01.png'; 
import logo2 from '../Plogos/jocs01.png'; 
import logo3 from '../Plogos/sacabat.png'; 


const Pbuto = ({ name, onClick, nLogo, disabled }) => {
  const [logoR, setLogoR] = useState(null);

  useEffect(() => {
    switch (nLogo) {
      case '1':
        setLogoR(logo1);
        break;
      case '2':
        setLogoR(logo2);
        break;
      default:
        setLogoR(logo3);
    }
  }, [nLogo]);

  return (
    <button className={disabled? 'Pbutton-disabled' : 'Pbutton-enabled'}  
    onClick={onClick}
    disabled={disabled}>
      {logoR && <img src={logoR} alt="Logo" className="Plogo" />}
      <span className="Pbutton-text">{name}</span>
    </button>
  );
};

export default Pbuto;
