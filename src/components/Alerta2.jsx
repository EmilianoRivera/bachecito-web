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
      <div id="alerta" className='alerta'>
        <h1 className='saludo'>¡Alto! Mantente al tanto 🖐</h1>
        <p className='texto'>
          Los reportes que ves aquí son realizados mayormente dentro de la app móvil
          de Bachecito 26, sin embargo ahora puedes realizar reportes desde el sistema web
          desde el apartado de estadísticas, ¡Pasa a darte una vuelta!
        </p>
        <button className='boton' onClick={manejarNoMostrar}>No volver a mostrar</button>
      </div>
    </div>
  );
};

export default Alerta;
