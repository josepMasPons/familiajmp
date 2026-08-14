import { Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
function JMTermsConditions() {
  const navigate = useNavigate();
return (
    <Container className="d-flex justify-content-center align-items-center mt-4">
      <Card className="shadow-lg p-4" style={{ maxWidth: "800px", width: "100%" }}>
        <Card.Body>
          <h3 className="text-center text-primary fw-bold mb-4">Termes i Condicions</h3>

          <h4 className="text-danger">1. Identificació del Titular del Domini</h4>
          <p className="text-justify">
            En compliment de l'article 10 de la Llei 34/2002, de Serveis de la Societat de la Informació i del Comerç Electrònic, es publiquen les següents dades:  
            <br />
            <strong>Josep Mas Pons</strong>, amb domicili al carrer Corominas,79, 08201 Sabadell.  
            <br />
           
            Telèfon: <strong>937277024</strong>
            <br />
            Correu electrònic: <a href="mailto:jmas2011@gmail.com">jmas2011@gmail.com</a>
          </p>

          <hr />

          <h4 className="text-danger mt-3">2. Condicions d'Ús del Web</h4>
          <p className="text-justify">
            L'usuari que accedeix i utilitza aquest web accepta les presents condicions d’ús. L'usuari serà responsable de proporcionar informació veraç i lícita durant el procés de registre.
          </p>
          <p><strong>Queda totalment prohibit:</strong></p>
          <ul>
            <li>Intentar accedir o modificar comptes d'altres usuaris.</li>
            <li>Publicar contingut discriminatori, xenòfob, racista o il·legal.</li>
          </ul>

          <hr />

          <h4 className="text-danger mt-3">3. Propietat Intel·lectual i Industrial</h4>
          <p className="text-justify">
            Tots els drets de propietat intel·lectual d'aquest lloc web i el seu contingut són propietat de Josep Mas. La reproducció, distribució o comunicació pública sense autorització està prohibida.
          </p>

          <hr />

          <h4 className="text-danger mt-3">4. Responsabilitat</h4>
          <p className="text-justify">
            El titular del domini no es fa responsable de danys derivats d'interferències tècniques, virus informàtics o altres factors aliens al seu control.
          </p>

          <hr />

          <h4 className="text-danger mt-3">5. Privacitat i Protecció de Dades</h4>
          <p className="text-justify">
            D’acord amb la Llei de Protecció de Dades, Josep Mas Pons és el responsable del tractament de dades personals.  
            <br />
            Els usuaris poden exercir els seus drets d’accés, rectificació o eliminació dirigint-se a <a href="mailto:correu@teatrecpsv.com">correu@teatrecpsv.com</a>.
          </p>

          <hr />

          <h4 className="text-danger mt-3">6. Legislació Aplicable</h4>
          <p className="text-justify">
            Les presents condicions es regeixen per la legislació espanyola. Qualsevol controvèrsia serà sotmesa als tribunals de Sabadell.
          </p>

          <hr />

          <div className="text-center">
            <Button variant="danger" onClick={() => navigate('/Pinici')}>
              Tornar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default JMTermsConditions;
