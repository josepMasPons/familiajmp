import { Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Benrera from "./Benrera";

function JMCopyRight() {
  const navigate = useNavigate();
  let Versio01 = localStorage.getItem("Versio01");
  let Versio02 = localStorage.getItem("Versio02");
  let Versio03 = localStorage.getItem("Versio03");
  let Versio04 = localStorage.getItem("Versio04");
  let Versio05 = localStorage.getItem("Versio05");
  let Versio06 = localStorage.getItem("Versio06");  
  const [passWord, setPassWord] = useState(localStorage.getItem('PassWord') || 'Convidat');
  function Sacabat() {    
      navigate('/PInici');
   }
   Benrera(Sacabat);
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 text-center" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h4 className="fw-bold text-danger">Informació de la Versió</h4>
          <hr />
          <h5 className="text-primary">{Versio03}</h5>
          <p className="text-muted">{Versio01}</p>
          <p className="text-muted">{Versio02}</p>
       
          <p className="text-primary">{Versio04}</p>
          <p className="text-primary">{Versio05}</p>
          <p className="text-primary">{Versio06}</p>
           
          <hr />
          <Button 
            className="mt-3" 
            variant="danger"             
            onClick={Sacabat}>
          
            Tornar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default JMCopyRight;
