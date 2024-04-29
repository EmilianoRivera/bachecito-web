
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
<<<<<<< HEAD
    <div className='bodyFavoritos'>
=======
    <div className='body-favoritos'>
>>>>>>> 991ce9a3856ebfe04b1f71ec55d67da5efe05873

      {showTitles && (
        <div className={`titles ${showTitles ? 'show' : 'hide'}`}>
          <h1 id='title-main'>Seguimiento de tus baches guardados 🐜</h1>
          <h2 id='textito'>Aquí podrás visualizar el seguimiento de los baches que has guardado de otros usuarios.</h2>
        </div>
      )}
      <ReportesComponente></ReportesComponente>
        
    </div>
      


  );
}

export default Favoritos;


