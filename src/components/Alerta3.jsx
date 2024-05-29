"use client"
import React, { useState, useEffect } from 'react';
import './Alertas.css';

const Alerta = ({ pageId }) => {
  const [alertaMostrada, setAlertaMostrada] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    setIsClient(true);
    const storageKey = `AlertaMostrada_${pageId}`;
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue === 'true') {
      setAlertaMostrada(true);
    }
  }, [pageId]);

  const manejarNoMostrar = () => {
    const storageKey = `AlertaMostrada_${pageId}`;
    localStorage.setItem(storageKey, 'true');
    setAlertaMostrada(true);
  };

  useEffect(() => {
    if (!alertaMostrada && isClient) {
      const alertaElement = document.getElementById("alerta");
      if (alertaElement) {
        alertaElement.style.transform = 'translate(-50%, 20%) scale(1)';
      }
    }
  }, [alertaMostrada, isClient]);

  if (!isClient || alertaMostrada) {
    return null;
  }

  return (
    <div className='back'>
      <div id="alerta" className='alerta2'>
        <h1 className='saludo'>¡Hola! 🏠</h1>
        <p className='texto'>
        Bienvenido a la sección de Perfil, aquí podrás ver tu historial de reportes realizados 
            dentro de la CDMX por medio de la aplicación móvil y/o el sistema web de Bachecito 26, así como tus datos de registro
        </p>
        <button className='boton' onClick={manejarNoMostrar}>No volver a mostrar</button>
      </div>
    </div>
  );
};

export default Alerta;
