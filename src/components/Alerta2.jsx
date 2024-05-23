"use client"
import React, { useState, useEffect } from 'react';

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
    <div style={styles.back}>
      <div id="alerta" style={styles.alerta}>
        <h1 style={styles.saludo}>¡Alto! Mantente al tanto 🖐</h1>
        <p style={styles.text}>
          Los reportes que ves aquí son realizados mayormente dentro de la app móvil
          de Bachecito 26, sin embargo ahora puedes realizar reportes desde el sistema web
          desde el apartado de estadísticas, ¡Pasa a darte una vuelta!
        </p>
        <button className='boton' style={styles.boton} onClick={manejarNoMostrar}>No volver a mostrar</button>
      </div>
    </div>
  );
};

const styles = {
  back: {
    backdropFilter: 'blur(5px)',
    zIndex: 100000,
    position: 'fixed',
    width: '100vw',
    top: '10vh',
    left: '0',
    height: '100vh',
  },
  alerta: {
    top: '9vh',
    left: '50%',
    transform: 'translate(-50%, -100%) scale(0)',
    transformOrigin: 'top center',
    transition: 'transform 0.5s ease-out',
    position: 'absolute',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '1rem',
    fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45vw',
    textAlign: 'center',
    textJustify: 'justify',
  },
  boton: {
    backgroundColor: '#ff9f49',
    padding: '10px',
    border: 'none',
    borderRadius: '1rem',
    color: 'white',
    width: '20vw',
    marginBottom: '2vh',
  },
  saludo: {
    marginBottom: '0',
    color: '#ff9f49',
    fontSize: '1.8rem',
  },
  text: {
    width: '90%',
    marginLeft: '5%',
    textAlign: 'center',
    textJustify: 'justify',
    marginBottom: '4vh',
  },
};

const botonHoverStyle = `
.boton:hover {
  background-color: #cc7a35;
  cursor: pointer;
}
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = botonHoverStyle;
  document.head.appendChild(styleSheet);
}

export default Alerta;
