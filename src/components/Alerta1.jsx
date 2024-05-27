"use client";
import React, { useState, useEffect } from 'react';
import './Alertas.css';

const Alerta = ({ pageId }) => {
  const [alertaMostrada, setAlertaMostrada] = useState(false);

  const manejarNoMostrar = () => {
    setAlertaMostrada(true);
  };

  useEffect(() => {
    const storageKey = `AlertaMostrada_${pageId}`;
    const alertaMostradaLocal = localStorage.getItem(storageKey) === 'true';
    setAlertaMostrada(alertaMostradaLocal);

    if (!alertaMostradaLocal) {
      const alertaElement = document.getElementById("alerta");
      if (alertaElement) {
        alertaElement.style.transform = 'translate(-50%, 20%) scale(1)';
      }
    }
  }, [pageId]);

  useEffect(() => {
    if (alertaMostrada) {
      const storageKey = `AlertaMostrada_${pageId}`;
      localStorage.setItem(storageKey, 'true');
    }
  }, [alertaMostrada, pageId]);

  return (
    !alertaMostrada && (
      <div className="back">
        <div id="alerta" className="alerta">
          <h1 className="saludo">¡Hola! 🥳</h1>
          <p className="texto">Bienvenido a la sección de Estadísticas, aquí podrás ver los reportes realizados dentro de la CDMX por usuarios de la aplicación móvil de Bachecito 26 (¡Y también de Bachecito web!) así como el número de reportes totales según su estado de gestión.</p>
          <button className="boton" onClick={manejarNoMostrar}>No volver a mostrar</button>
        </div>
      </div>
    )
  );
};

export default Alerta;
