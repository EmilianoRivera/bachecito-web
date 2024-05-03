
"use client";
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import "../Favoritos/favoritos.css";
import ReportesComponente  from "@/components/Favoritos";

function Favoritos() {

  const [showTitles, setShowTitles] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 5; // Ajusta según la altura de tu navbar
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > navbarHeight) {
        setShowTitles(false);
      } else {
        setShowTitles(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='body-favoritos'>

      {showTitles && (
        <div className={`titles ${showTitles ? 'show' : 'hide'}`}>
          <h1 id='title-main'>Seguimiento de tus baches guardados 🐜</h1>
          <h2 id='textito'>¡Bienvenido al apartado de tus reportes favoritos!, aquí podrás ver los reportes que has guardado de otros usuarios realizados por medio 
          de la aplicación móvil de Bachecito 26, según su estado de gestión. ¡Esperamos que sea más fácil para ti darle seguimiento a los que sean de tu interes!</h2>
        </div>
      )}
      <ReportesComponente></ReportesComponente>
        
    </div>
      


  );
}

export default Favoritos;


