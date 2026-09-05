  // ==========================================================
  //
  //     Paràgfaf per controlar el
  //      BOTÓ ENRERE DEL MÒBIL  (deriva el butó a Sacabat)  
  //       (window.history.back() es el emulador a portatil)
  //       (versió 03-09-2026)
  // ==========================================================
  // Paràgraf per butó Benrera  ---------------
  import {useEffect } from "react";
  export default function Benrera(Sacabat) {
    useEffect(() => {     
    const handleBack = () => {
         console.log('Useffect activat pel retorn triangulet de Benrera');
      Sacabat();  
      // Manté la pàgina dins de l'historial
      window.history.pushState(null, "", window.location.href);
    };  
    // Creem una entrada inicial
    window.history.pushState(null, "", window.location.href);
  
    window.addEventListener("popstate", handleBack);
  
    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);
};
  // final  paràgraf  Benrera--------------------------------

  // ==========================================================
  // FÍ BOTÓ ENRERE DEL MÒBIL
  // ==========================================================