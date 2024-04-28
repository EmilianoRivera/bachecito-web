import React from 'react';
import '@/components/Navbar.css'
import ReactDOM from 'react-dom';

function ConfirmationAlert({ message, onConfirm, onCancel }) {
  return ReactDOM.createPortal(
    <div className="confirmation-alert">
      <div className='confirmation-contenido'>
        <p>{message}</p>
        <button className='boton-salir' onClick={onConfirm}>Confirmar</button>
        <button className='boton-cancelar2' onClick={onCancel}>Cancelar</button>
      </div>
    </div>,
    document.body // Renderiza la alerta fuera del árbol de componentes actual para que se sobreponga a todo 
    //no se preocupen, yo me entiendo con esto y les explico si tienen dudas JAJAJAJAJ
  );
}

export default ConfirmationAlert;
