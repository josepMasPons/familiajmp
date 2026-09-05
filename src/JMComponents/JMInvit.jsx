import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Nav, Col, Card, Button, Form } from "react-bootstrap";
import { collection, getDocs, doc, 
         updateDoc, deleteDoc, addDoc, limit, query, orderBy} from 'firebase/firestore';
import "./Global.css";
import { db } from '../firebaseLoc';

function JMInvit() {
  const navigate = useNavigate();
  const [estat, setEstat] = useState('N');
  const [data, setData] = useState([]);
  const [filaSel, setFilaSel] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [primer, setPrimer] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const currentItems = data.slice(0, itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;
  const paddedItems = [...currentItems, ...Array(emptyRows).fill({ temp: '.', nom: ' ', codi: 'empty' })];
  
  useEffect(() => {
  const obtenirUltim = async () => {
    const linksCollection = collection(db, 'SantviInvitat');
    const registreQuery = query(linksCollection, orderBy('Sinvi01', 'desc'), limit(1));
    const querySnapshot = await getDocs(registreQuery);

    if (!querySnapshot.empty) {
      const primerDoc = querySnapshot.docs[0];
      const ultimSinvi01 = primerDoc.data().Sinvi01;

      const nouNumero = parseInt(ultimSinvi01, 10) + 1;
      const nouSinvi01 = String(nouNumero).padStart(3, '0');  

      setPrimer(nouSinvi01);
    } else {
      setPrimer('001'); 
    }
  };

  obtenirUltim();
}, []);
 
  useEffect(() => {
    const fetchData = async () => {
      const linksCollection = collection(db, 'SantviInvitat');
      try {
        const querySnapshot = await getDocs(linksCollection);
        const linksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          Sinvi01: doc.data().Sinvi01,
          Sinvi02: doc.data().Sinvi02,
          Sinvi03: doc.data().Sinvi03,
          Sinvi04: doc.data().Sinvi04,
          Sinvi05: doc.data().Sinvi05,
          Sinvi06: doc.data().Sinvi06,
          ...doc.data()
        }));
        setData(linksData);
      } catch (error) {
        console.error('Error carregant les dades:', error);
      }
    };
    fetchData();
  }, []);

  const handleCellClick = (index) => {
    setFilaSel(index);
    const selected = data[index];
    setEditItem({ ...selected });
    setEstat('M');
  };

  const handleEditChange = (field, value) => {
    setEditItem({ ...editItem, [field]: value });
  };
  const convertToISO = (dateStr) => {
  if (!dateStr) return '';
  const [dd, mm, yyyy] = dateStr.split('/');
  if (!dd || !mm || !yyyy) return '';
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
};
const convertToDisplayFormat = (isoStr) => {
  if (!isoStr) return '';
  const [yyyy, mm, dd] = isoStr.split('-');
  return `${dd}/${mm}/${yyyy}`;
};


const formatDateToDDMMYYYY = (isoDate) => {
  if (typeof isoDate !== 'string') return '01/01/2000';
  const isDDMMYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(isoDate);
  if (isDDMMYYYY) return isoDate;
  const parts = isoDate.split('-'); 
  if (
    parts.length !== 3 ||
    parts[0].length !== 4 || 
    parts[1].length !== 2 || 
    parts[2].length !== 2    
  ) {
    return '01/01/2000';
  }
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

  const handleSave = async () => {
    setEstat('N');
    if (!editItem?.id) return;
    try {
      const docRef = doc(db, 'SantviInvitat', editItem.id);
      await updateDoc(docRef, {
        Sinvi02: editItem.Sinvi02,
        Sinvi03: editItem.Sinvi03,
        Sinvi04: formatDateToDDMMYYYY(editItem.Sinvi04),
        Sinvi05: formatDateToDDMMYYYY(editItem.Sinvi05),
        Sinvi06: editItem.Sinvi06
      });
      const updatedData = [...data];
      updatedData[filaSel] = editItem;
      setData(updatedData);
      alert('Dades desades correctament');
    } catch (error) {
      console.error('Error guardant:', error);
      alert('Error al desar els canvis');
    }
  };

  const handleAddNew = () => {
    setEstat('A');
      setEditItem({
      Sinvi01: primer,
      Sinvi02: '',
      Sinvi03: '',
      Sinvi04: '01/01/2000',
      Sinvi05: '31/12/2099',
      Sinvi06: ''
    }); 
     
  };
  const handleDelete = async () => {
      setEstat('N');
    if (window.confirm("Estàs segur que vols eliminar aquest registre?")) {
      try {
        const docRef = doc(db, 'SantviInvitat', editItem.id);
        await deleteDoc(docRef); // Eliminar de Firebase

        // Actualitzar la vista local
        const updatedData = data.filter(item => item.id !== editItem.id);
        setData(updatedData);
        setEditItem(null); // Restablir el formulari
        alert('Registre eliminat correctament');
      } catch (error) {
        console.error('Error eliminant registre:', error);
        alert('Error eliminant el registre');
      }
    }
  };

  const handleAddToFirebase = async () => {
    try {
       setEstat('N');
      const docRef = await addDoc(collection(db, 'SantviInvitat'), {
        Sinvi01: primer,
        Sinvi02: editItem.Sinvi02,
        Sinvi03: editItem.Sinvi03,
        Sinvi04: formatDateToDDMMYYYY(editItem.Sinvi04),
        Sinvi05: formatDateToDDMMYYYY(editItem.Sinvi05),
        Sinvi06: editItem.Sinvi06
      });
         
      setData([
        ...data,
        { id: `SantviDoc_${primer}`, ...editItem }
      ]);
      alert('Registre afegit correctament');
      
      setEditItem(null); // Restablir el formulari
    } catch (error) {
      console.error('Error afegint registre:', error);
      alert('Error afegint el registre');
    }
    
  };

  function Sacabat() {
    localStorage.setItem('Programa', '/Pantalla02');
    navigate('/Pantalla02');
  }

  return (
    <>
    <div className="center-contentP2">
      <Container className="mt-5">
        <Row className="justify-content-center">
          {estat === 'N' && (
          <Col md={8}>
            <Card>              
                <Card.Header className="d-flex justify-content-between 
                                      align-items-center fs-5 fw-bold">
                  <span className="text-center w-100">
                      Registre invitats </span>               
                  <div>
                    <Button variant="warning" size="sm" 
                        className="mb-2" onClick={Sacabat}>
                    Enrere
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>                
                  <div className="table-responsiveP2">
                    <table className="BtablaP2">
                      <thead>
                        <tr>
                          <th className="BTablaP2-nom0">id</th>
                          <th className="BTablaP2-nom1">clau</th>
                          <th className="BTablaP2-nom2">Obra</th>
                          <th className="BTablaP2-nom1">Data inici</th>
                          <th className="BTablaP2-nom1">Data Final</th>
                          <th className="BTablaP2-nom3">Solicitant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paddedItems
                          .filter(item => item.Sinvi02 && 
                                          item.Sinvi03 !== 'empty')
                          .map((item, index) => (
                            <tr key={index}
                              onClick={() => handleCellClick(index)}
                              style={{
                                backgroundColor: filaSel === index ? 'yellow' : 'transparent',
                                cursor: 'pointer'
                              }}>
                              <td className="BTablaP2-nom0">{item.Sinvi01}</td>
                              <td className="BTablaP2-nom1">{item.Sinvi02}</td>
                              <td className="BTablaP2-nom2">{item.Sinvi03}</td>
                              <td className="BTablaP2-nom1">{formatDateToDDMMYYYY(item.Sinvi04)}</td>
                              <td className="BTablaP2-nom1">{formatDateToDDMMYYYY(item.Sinvi05)}</td>
                              <td className="BTablaP2-nom3">{item.Sinvi06}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-end mt-3">
                      <Button variant="success" size="sm" 
                              className="mb-2" onClick={handleAddNew}>
                                ➕ Nou registre 
                      </Button>
                    </div>              
                  </div>
                </Card.Body> 
              </Card>
            </Col>              
          )}
          {estat === 'M' && (
            <Col md={8}>                 
              <Card className="mt-4 shadow-sm">                      
                <Card.Header className="d-flex justify-content-between 
                                            align-items-center px-3 py-2 
                                            bg-light 
                                            border-bottom">
                      <div className="flex-grow-1 text-center fs-5 fw-bold">
                     ✏️     Editar el registre
                      </div>    
                      <div className="d-flex gap-2 ms-3">
                        <Button variant="primary" size="sm" className="mb-2" 
                            onClick={handleSave}>
                             💾 Gravar
                        </Button>
                        <Button variant="danger" size="sm" className="mb-2" 
                            onClick={handleDelete}>
                             🗑️ Eliminar
                        </Button>
                      </div>
               </Card.Header>
               <Card.Body>
                      <Form>
                        <Row className="mb-3">
                          <Col md={6}>
                              <Form.Group controlId="editClau">
                                <Form.Label> Clau</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editItem.Sinvi02 || ''}
                                  onChange={(e) => handleEditChange
                                        ('Sinvi02', e.target.value)}
                                />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="editObra">
                              <Form.Label> Obra</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editItem.Sinvi03 || ''}
                                  onChange={(e) => handleEditChange
                                         ('Sinvi03', e.target.value)}
                                />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group controlId="editDataInici">
                              <Form.Label>📅 Data inici</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={convertToISO(editItem.Sinvi04) || ''}
                                  onChange={(e) => handleEditChange
                                        ('Sinvi04', 
                                        convertToDisplayFormat(e.target.value))}
                                />
                              </Form.Group>
                         </Col>
                          <Col md={6}>
                            <Form.Group controlId="editDataFinal">
                              <Form.Label>📆 Data final</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={convertToISO(editItem.Sinvi05) || ''}
                                  onChange={(e) => handleEditChange
                                       ('Sinvi05',
                                       convertToDisplayFormat(e.target.value))}
                                />
                              </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="editSolicitant">
                          <Form.Label>👤 Sol·licitant</Form.Label>
                          <Form.Control
                              type="text"
                              value={editItem.Sinvi06 || ''}
                              onChange={(e) => handleEditChange
                                    ('Sinvi06', e.target.value)}
                            />
                        </Form.Group>
                      </Form>
                 </Card.Body>
               </Card>
              </Col>
              )}
              {estat === 'A' && ( 
                  <Col md={8}>   
                   <Card className="mt-4 shadow-sm">                      
                    <Card.Header className="d-flex justify-content-between 
                                            align-items-center px-3 py-2 
                                            bg-light 
                                            border-bottom">
                      <div className="flex-grow-1 text-center fs-5 fw-bold">
                     ✏️     Editar el registre
                      </div>                     
                      <div className="d-flex justify-content-end mt-3">
                        
                        <Button variant="primary" size="sm" className="mb-2" 
                                onClick={handleAddToFirebase}>
                           gravar nou registre
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Row className="mb-3">
                          <Col md={6}>
                              <Form.Group controlId="editClau">
                                <Form.Label> Clau</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editItem.Sinvi02 || ''}
                                  onChange={(e) => handleEditChange
                                        ('Sinvi02', e.target.value)}
                                />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="editObra">
                              <Form.Label> Obra</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editItem.Sinvi03 || ''}
                                  onChange={(e) => handleEditChange
                                         ('Sinvi03', e.target.value)}
                                />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group controlId="editDataInici">
                              <Form.Label>📅 Data inici</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={convertToISO(editItem.Sinvi04) || ''}
                                  onChange={(e) => handleEditChange
                                        ('Sinvi04',
                                        convertToDisplayFormat(e.target.value))}
                                />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="editDataFinal">
                              <Form.Label>📆 Data final</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={convertToISO(editItem.Sinvi05) || ''}
                                  onChange={(e) => handleEditChange
                                       ('Sinvi05', 
                                       convertToDisplayFormat(e.target.value))}
                                />
                              </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="editSolicitant">
                          <Form.Label>👤 Sol·licitant</Form.Label>
                          <Form.Control
                              type="text"
                              value={editItem.Sinvi06 || ''}
                              onChange={(e) => handleEditChange
                                    ('Sinvi06', e.target.value)}
                            />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                 </Col>
                )}        
        </Row>
      </Container>
    </div>
    </>
  );
}

export default JMInvit;
