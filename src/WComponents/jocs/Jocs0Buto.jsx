import React, { useEffect, useState } from 'react';
import './Jocs0.css';
import logo1 from './Jocs0Logos/tresenratlla.png'; 
import logo2 from './Jocs0Logos/tetris.png'; 
import logo3 from './Jocs0Logos/aliens.png'; 
import logo4 from './Jocs0Logos/memory.png'; 
import logo5 from './Jocs0Logos/caçador.jpg'; 
import logo6 from './Jocs0Logos/LogoPin.jpg'; 
import logo7 from './Jocs0Logos/puzzle.jpg'; 
import logo8 from './Jocs0Logos/ruleta.jpg'; 



const Jocs0Buto = ({ name, onClick, nLogo, disabled }) => {
  const [logoR, setLogoR] = useState(null);

  useEffect(() => {
    switch (nLogo) {
      case '1':
        setLogoR(logo1);
        break;
      case '2':
        setLogoR(logo2);
        break;
      case '3':
        setLogoR(logo3);
        break;
      case '4':
        setLogoR(logo4);
        break;
      case '5':
        setLogoR(logo5);
        break;
      case '6':
        setLogoR(logo6);
        break;
      case '7':
        setLogoR(logo7);
        break;
      case '8':
        setLogoR(logo8);
        break;
      default:
        setLogoR(null);
    }
  }, [nLogo]);

  return (
    <button className="J0button-with-logo" 
    onClick={onClick}
    disabled={disabled}>
      {logoR && <img src={logoR} alt="Logo" className="J0logo" />}
      <span className="J0button-text">{name}</span>
    </button>
  );
};

export default Jocs0Buto;
