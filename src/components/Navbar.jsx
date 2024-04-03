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
    
    <div className={`navBar ${menuActive ? 'showMenu' : ''}`}>
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
          {console.log("HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERE", isAdmin)}
            {isAdmin ? (
              <>
              
                <Link href="/Cuenta/Administrador/Dashboard" className="opc">
                  Dashboard
                </Link>
                <Link href="/Cuenta/Administrador/Soporte" className="opc">
                  Soporte
                </Link>
                <Link href="/Cuenta/Administrador/Mapa" className="opc">
                  Mapa
                </Link>
                <Link href="/Cuenta/Administrador/Reportes" className="opc">
                  Reportes
                </Link>
                <Link href="/Cuenta/Administrador/Perfil" className="opc">
                  Perfil
                </Link>
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
                <Link href="/Reportes" className="opc">
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
