// -------  Versió   per base de dades SANTVIFLIX -----------------
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebaseLoc";
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Navbar, Container, Row, Col, Card, Button } from "react-bootstrap";
import './Visites.css';

function Visites() {
  const navigate = useNavigate();
  let Program = 'Visites';
  const [passNom, setPassNom] = useState(localStorage.getItem('PassNom'));
  const [anyx, setAnyx] = useState(localStorage.getItem('Proces051') || '');
  const [paraulax, setParaulax] = useState(localStorage.getItem('Proces052') || '');
  const [data, setData] = useState([]);
  const [filaSel, setFilaSel] = useState(null);

  // Evitar sortida amb el botó enrere
  useEffect(() => {
    const anularReturn = (event) => {
      event.preventDefault();
      if (window.history.state && window.history.state.preventExit) {
        navigate(0);
      }
    };
    window.history.pushState({ preventExit: true }, '');
    window.addEventListener('popstate', anularReturn);
    return () => {
      window.removeEventListener('popstate', anularReturn);
      window.history.replaceState(null, '');
    };
  }, [navigate]);

  // Fetch de dades per mostrar fins a 50 registres
  useEffect(() => {
    const fetchData = async () => {
      const linksCollection = collection(db, 'SantviLog');
      try {
        // Recupera màxim 50 registres
        const querySnapshot = await getDocs(query(linksCollection, limit(50)));
        const linksData = querySnapshot.docs.map(doc => ({
          ident: doc.data().C00_ident,
          mail: doc.data().C01_mail,
          usuari: doc.data().C02_usuari,
          clase: doc.data().C03_clase,
          temporada: doc.data().C04_temporada,
          obra: doc.data().C05_obra,
          inici: doc.data().C06_inici,
          final: doc.data().C07_final,
          notes: doc.data().C08_notes,
          ...doc.data()
        }));
       //console.log('logs trobats - ', linksData)
        setData(linksData);
      } catch (error) {
        console.error('Error llegint documents: ', error);
      }
    };
    fetchData();
  }, []);
  function Sacabat() {    
    localStorage.setItem('Programa', '/Pinici');
    localStorage.setItem('IniciJMP', 'No');
    navigate('/Pinici');
}  

 return (
  <>
    <div className="page-wrapperVI">
      <Container className="mt-0">

        <Navbar className="SVNavbarVI shadow justify-content-center mt-0 py-2">
          <Navbar.Brand href="/">
            <span className="brand-title3VI">usuari : {passNom}</span>
          </Navbar.Brand>
        </Navbar>

        <Row className="justify-content-center mt-3">
          <Col xs={12}>

            <div className="table-cardVI">

              <div className="table-headerVI">
                <h5 className="mb-0">
                  Relació de visites al programa (Max. últims 50)
                </h5>
              </div>

              <div className="table-responsiveVI">
                <table className="tableVI">
                  <thead>
                    <tr>
                      <th>Persona</th>
                      <th>Any - Joc</th>
                      <th>Nom</th>
                      <th>Data</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className={""}
                        onClick={() => setFilaSel(index)}
                      >
                        <td>{item.usuari}</td>
                        <td>{item.temporada}</td>
                        <td>{item.obra}</td>
                        <td>{item.inici}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-footerVI">
                <Button
                  className="custom-logout-btn small-buttonP4"
                  variant="light"
                  onClick={Sacabat}
                >
                  <i className="fas fa-sign-out-alt"></i> Enrere
                </Button>
              </div>

            </div>

          </Col>
        </Row>

      </Container>
    </div>
  </>
);
}

export default Visites;
