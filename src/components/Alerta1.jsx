import React, { useState, useEffect } from 'react';

const Alerta = ({ pageId }) => {
  // Genera la clave de almacenamiento para esta página específica
  const storageKey = `AlertaMostrada_${pageId}`;

  // Estado para verificar si la alerta se ha mostrado o no en esta página específica
  const [alertaMostrada, setAlertaMostrada] = useState(() => {
    // Verifica si localStorage está disponible y si la alerta ya fue mostrada
    return typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'true';
  });

  // Función para manejar el botón "No volver a mostrar"
  const manejarNoMostrar = () => {
    // Guardar en localStorage que la alerta ya fue mostrada para esta página específica
    localStorage.setItem(storageKey, 'true');
    
    // Cambiar el estado de alertaMostrada a true para no volver a mostrar
    setAlertaMostrada(true);
  };

  useEffect(() => {
    if (!alertaMostrada && typeof window !== 'undefined') {
        const alertaElement = document.getElementById("alerta");
        if (alertaElement) {
            alertaElement.style.transform = 'translate(-50%, 20%) scale(1)';
        }
    }
}, [alertaMostrada]);

  return (
    !alertaMostrada && (
      <div style={styles.back}>
        <div id="alerta" style={styles.alerta}>
            <h1 style={styles.saludo}>¡Hola! 🖐</h1>
            <p style={styles.text}>Bienvenido a la sección de Estadísticas, aquí podrás ver los reportes realizados dentro de la CDMX por usuarios de la aplicación móvil de Bachecito 26 y el número de reportes totales según su estado de gestión.</p>
            <button className='boton' style={styles.boton} onClick={manejarNoMostrar}>No volver a mostrar</button>
        </div>
      </div>
    )
  );
};

const styles = {
    back: {
      backdropFilter: 'blur(5px)', // Aplica un desenfoque al fondo
      zIndex: 100000,
      position: 'fixed',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      width: '100vw',
      height: '100vh',
    },
    alerta: {
      top: '9vh',
      left: '50%',
      transform: 'translate(-50%, -100%) scale(0)', // Inicialmente comienza fuera de la pantalla y a un tamaño de 0
      transformOrigin: 'top center',
      transition: 'transform 0.5s ease-out', // Transición para la animación
      position: 'absolute',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '1rem',
      fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50vw',
      textAlign: 'center',
      textJustify: 'justify',
    },
    boton: {
      backgroundColor: '#ff9f49',
      padding: '10px',
      border: 'none',
      borderRadius: '1rem',
      color: 'white',
      width: '20vw'
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
    },
};

export default Alerta;
