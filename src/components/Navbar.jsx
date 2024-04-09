"use client"
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import './Navbar.css';
import AuthContext from "../../context/AuthContext";
import { useAuthUser } from "../../hooks/UseAuthUser";

function Navbar() {
  useAuthUser();
  const { isLogged, isAdmin } = useContext(AuthContext);
  const [menuActive, setMenuActive] = useState(false);
  const [showMenuIcon, setShowMenuIcon] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowMenuIcon(window.innerWidth <= 800);
    };

    handleResize(); // Call on initial render
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    
    <div className={`navBar ${isAdmin ? 'admin' : ''} ${menuActive ? 'showMenu' : ''}`}>
      <Link href="/" className="bachecito26">
        <img
          src="https://i.postimg.cc/T3NQg97V/Logo.png"
          alt="Logo Bachecito 26"
          className="nopelien"
        />
        BACHECITO 26
      </Link>

      <div className={`menuIcon ${showMenuIcon ? 'span-anime' : 'hidden'}`} onClick={toggleMenu}>
        <div className={`menu-icon ${menuActive ? '' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="menuItems">
        {isLogged && (
          <>
            {isAdmin ? (
              <>
              <div className='ilusion'></div>
                <Link href="/Cuenta/Administrador/Dashboard" className="opc-admin"><img src="https://i.postimg.cc/3JkMwkG1/estadisticas-1.png" alt="estadisticas" /><span className='hover-text'>Dashboard</span></Link>
                <Link href="/Cuenta/Administrador/Reportes" className="opc-admin"><img src="https://i.postimg.cc/6QLgPnsW/encuesta-h-1.png" alt="reportes" /><span className='hover-text'>Reportes</span></Link>
                <Link href="/Cuenta/Administrador/Mapa" className="opc-admin"><img src="https://i.postimg.cc/QMrvSSyY/marcador-de-mapa-1.png" alt="mapa" /><span className='hover-text'>Mapa</span></Link>
                <Link href="/Cuenta/Administrador/Perfil" className="opc-admin"><img src="https://i.postimg.cc/02FTK9ds/agregar-usuario-1.png" alt="administrador nuevo" /><span className='hover-text'>Administradores</span></Link>
                <Link href="/Cuenta/Administrador/Soporte" className="opc-admin"><img src="https://i.postimg.cc/HkMfQFB7/constructor-1.png" alt="soporte" /><span className='hover-text'>Soporte</span></Link>
                <Link href="/" className="opc-admin"><img src="https://i.postimg.cc/qRJSHq08/salida-2.png" alt="salir" /><span className='hover-text'>Salir</span></Link>
              </>
            ) : (
              <>
                <Link href="/Cuenta/Usuario/Perfil" className="opc btn--white prueba">
                  <span>Perfil →</span>
                </Link>
                <Link href="/" className="opc">
                  Baches Guardados en el web
                </Link>
                <Link href="/Cuenta/Usuario/Estadisticas" className="opc">
                  Estadísticas
                </Link>
                <Link href="/Cuenta/Usuario/Reportes" className="opc">
                  Reportes
                </Link>
              </>
            )}
          </>
        )}
        {!isLogged && (
          <>
           <Link href="/Sobre_Nosotros" className="opc">
             Sobre Nosotros
           </Link>
           <Link href="/Reportes" className="opc">
             Reportes
           </Link>
           <Link href="/" className="opc">
             Inicio
           </Link>
           <Link href="/Cuenta" className="opc btn--white prueba">
             <span>Cuenta →</span>
           </Link>
         </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
