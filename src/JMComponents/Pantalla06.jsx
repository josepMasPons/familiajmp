import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Pantalla06() {

  const navigate = useNavigate();

  const [fullScreen, setFullScreen] = useState(false);

  // dades rebudes des de Pantalla04
  const pdfUrl = localStorage.getItem('PdfUrl');
  const pdfName = localStorage.getItem('PdfName');

  const tornar = () => {
    navigate('/Pantalla04');
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  if (!pdfUrl) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontSize: '18px'
      }}>
        No s'ha trobat el document PDF
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden'
    }}>

      {/* CAPÇALERA */}
      {!fullScreen && (
        <div style={{
          padding: '10px',
          backgroundColor: '#222',
          color: 'white',
          textAlign: 'center'
        }}>

          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
            wordBreak: 'break-word'
          }}>
            {pdfName}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>

            <Button
              variant="warning"
              size="sm"
              onClick={tornar}
            >
              Enrere
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={toggleFullScreen}
            >
              Pantalla completa
            </Button>

          </div>
        </div>
      )}

      {/* PDF */}
      <div style={{
        width: '100%',
        height: fullScreen ? '100vh' : 'calc(100vh - 110px)',
        backgroundColor: '#000'
      }}>

        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          title={pdfName}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'white'
          }}
        />

      </div>

      {/* BOTÓ SORTIR PANTALLA COMPLETA */}
      {fullScreen && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999
        }}>

          <Button
            variant="light"
            size="sm"
            onClick={toggleFullScreen}
          >
            Sortir
          </Button>

        </div>
      )}

    </div>
  );
}

export default Pantalla06;