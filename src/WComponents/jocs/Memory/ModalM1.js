import React from "react";
import { Form, Button} from "react-bootstrap";
const ModalM1 = ({ punts, jugades, nivell, show, onClose, message }) => {
  if (!show) return null;

  return (
    <div class                    Name="fixed inset-0 
                    flex items-center 
                    justify-center 
                    bg-black 
                    bg-opacity-50">
    <div className="bg-white p-4 w-64 
                    rounded-md shadow-lg 
                    text-center border 
                    border-gray-300">
      <h2 className="text-lg 
                    font-semibold mb-2">
            🎉 Enhorabona!!! 🎉</h2>
      <p className="text-sm"> {message} </p>
      <p className="text-sm">  Puntuació : {punts} </p>
      <p className="text-sm">  Jugades : {jugades} </p>
      <p className="text-sm">  Nivell  : {nivell} </p>

      <Button
        onClick={onClose}
        className="mb-2"
        variant='warning'
        size='ms'
      > Final Partida
      </Button>
    </div>
  </div>
  );
};

export default ModalM1;
