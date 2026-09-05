import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Polyline,
} from 'react-leaflet';
import { Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import L from 'leaflet';
import { useEffect, useState, useRef,useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import './WorldMap.css';
import { db } from '../firebaseLoc'; 
import { doc, setDoc } from 'firebase/firestore'; 

/* 🔧 Fix icones Leaflet */
delete L.Icon.Default.prototype._getIconUrl;

/* 🎨 Icones */
const blueIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconAnchor: [12, 41],
});

/* 🔢 Conversió segura */
const toNumber = (v) => {
  if (v == null) return null;
  const match = String(v).match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;
  const n = parseFloat(match[0].replace(',', '.'));
  return isNaN(n) ? null : n;
};

/* 📍 Events mapa */
function MapEvents({ onAddPoint }) {
  useMapEvents({
    click(e) {
      onAddPoint(e.latlng);
    },
  });
  return null;
}

/* 🔄 Ajustar mapa al circuit */
function FitToCircuit({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(
      L.latLngBounds(points.map(p => [p.lat, p.lng])),
      { padding: [40, 40] }
    );
  }, [points, map]);
  return null;
}

/* 🔍 ANAR A UNA ADREÇA */
function GoToAddress() {
  const [opcio] = useState(localStorage.getItem('Mapa01'));
  const map = useMap();
  const [address, setAddress] = useState(null);
  const ref = useRef(null);

  /* 🚫 Bloquejar events cap al mapa */
  useEffect(() => {
    if (!ref.current) return;
        L.DomEvent.disableClickPropagation(ref.current);
        L.DomEvent.disableScrollPropagation(ref.current);
     
  }, []);

  const searchAddress = async () => {
    if (!address) return;
     try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.length === 0) {
        alert('Adreça no trobada');
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      map.setView([lat, lng], 13);
    } catch (err) {
      console.error(err);
      alert('Error cercant l’adreça');
    }   
  };

  return (
    <>
    {opcio === 'M' && (
    <div ref={ref} className="address-box">
      <input
        type="text"
        placeholder="Escriu una adreça o ciutat"
        onChange={e => setAddress(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && searchAddress()}
      />
      <button onClick={searchAddress}>Anar-hi</button>
    </div>
    )}
    </> 
  );
}


export default function WorldMap() {
  //console.log('10.1 - entrem a WorldMap !!!!');  
  const navigate = useNavigate();

  /* 📦 ESTATS */
  const [mapesLS, setMapesLS] = useState([]);
  const [opcio] = useState(localStorage.getItem('Mapa01'));
  const [nomP]  = useState(localStorage.getItem('Mapa04'));
  const [nomD]  = useState(localStorage.getItem('Mapa05'));
  const [pointsMapes, setPointsMapes] = useState([]);
  const [pointsNous, setPointsNous] = useState([]);
  const [numM, setNumM] = useState('01');

  /* 🔁 Llegir localStorage */
  useEffect(() => {
    const filtre = localStorage.getItem('Mapa02');
    const mapes = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('Mapa03:')) {
        if (localStorage.getItem('Mapa01') !== 'G' && !key.includes(filtre)) continue;

        try {
          mapes.push(JSON.parse(localStorage.getItem(key)));
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
    setMapesLS(mapes);
  }, []);

  /* 🔄 Mapes → punts */
  useEffect(() => {
    const punts = mapesLS.map(m => {
      const lat = toNumber(m.M03);
      const lng = toNumber(m.M04);
      if (lat == null || lng == null) return null;

      return {
        lat,
        lng,
        name: m.id,
        description1: m.M01,
        description2: m.M02,
        description3: m.M05 || ' - ',
        M01: m.M01,
        M02: m.M02,
        M03: m.M03,
        M04: m.M04,
        M05: m.M05,
      };
    }).filter(Boolean);

    setPointsMapes(punts);

    if (mapesLS.length > 0) {
      const maxNum = Math.max(
        ...mapesLS.map(m => Number(String(m.id).slice(-2)))
      );
      setNumM(String(maxNum + 1).padStart(2, '0'));
    }
  }, [mapesLS]);

  /* 💾 Guardar punts nous */
  useEffect(() => {
    if (pointsNous.length === 0) return;
    const last = pointsNous[pointsNous.length - 1];

    const data = {
      id: last.name,
      M01: last.M01,
      M02: last.M02,
      M03: last.M03,
      M04: last.M04,
      M05: last.M05,
    };

    localStorage.setItem('Mapa03:' + last.name, JSON.stringify(data));

    setDoc(doc(db, 'Mapes', last.name), data)
      .then(() => console.log('☁️ Firestore gravat'))
      .catch(err => console.error(err));
  }, [pointsNous]);

  /* ➕ Afegir punt */
  function addPoint(latlng) {
    const name = `Mapes_${localStorage.getItem('Mapa02')}_${numM}`;
    const description2x = prompt('descrip. :');
    if (!description2x) return;

    const point = {
      name,
      lat: latlng.lat,
      lng: latlng.lng,
      description1: nomP,
      description2: description2x,
      description3: nomD,
      M01: nomP,
      M02: description2x,
      M05: nomD,
      M03: `lat: ${latlng.lat}`,
      M04: `lng: ${latlng.lng}`,
    };

    setPointsNous(p => [...p, point]);
    setNumM(n => String(Number(n) + 1).padStart(2, '0'));
  }

  /* 🔀 Combinar */
  const allPoints = useMemo(
    () => [...pointsMapes, ...pointsNous].sort((a, b) =>
      a.name.localeCompare(b.name, 'ca')
    ),
    [pointsMapes, pointsNous]
  );

  /* 🔁 Circuit */
  const circuit = useMemo(() => {
    if (allPoints.length < 2) return [];
    return [...allPoints.map(p => [p.lat, p.lng]), [allPoints[0].lat, allPoints[0].lng]];
  }, [allPoints]);

  return (
    <div className="map-frame">
      <h1>{nomP}</h1>

      <MapContainer center={[20, 0]} zoom={2} minZoom={2} className="map-container">
        <GoToAddress />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
          noWrap
        />

        {opcio === 'M' && <MapEvents onAddPoint={addPoint} />}
        <FitToCircuit points={allPoints} />

        {circuit.length > 1 && opcio !== 'G' && (
          <Polyline positions={circuit} pathOptions={{ color: '#ff4444' }} />
        )}

        {allPoints.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={blueIcon}>
            <Popup>
              <strong>{p.description1}</strong><br />
              {p.description2}<br /><br />
              <strong>{p.description3}</strong>
               {opcio === 'G' && (
                  <>
                  <br></br>
                  <Button className="mb-2" 
                          variant='primary'
                          size='sm'                          
                          onClick={() => 
                        {localStorage.setItem('Mapa99', p.name);
                        navigate(-1)
                        }}>
                      anar-hi
                  </Button>
                  </>
               )}
            </Popup>
          </Marker>
         
        ))}
      </MapContainer>

      <Button className="mb-2"
              variant='warning'
              size='sm'
              onClick={() => navigate(-1)}>
        Enrere
      </Button>
    </div>
  );
}
