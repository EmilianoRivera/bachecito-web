"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import "./Navbar.css";
import AuthContext from "../../context/AuthContext";
import { useAuthUser } from "../../hooks/UseAuthUser";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import ConfirmationAlert from "@/components/ConfirmationAlert"; // Importa el componente de alerta de confirmación

function Navbar() {
  useAuthUser();
  const { isLogged, isAdmin } = useContext(AuthContext);
  const [menuActive, setMenuActive] = useState(false);
  const [showMenuIcon, setShowMenuIcon] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar la alerta de confirmación
  const router = useRouter();
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 800;
      setShowMenuIcon(isMobile);
      if (!isMobile) {
        setMenuActive(false); 
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  async function deleteCokies() {
    const response = await fetch('http://localhost:3000/api/cookie2', {
      method: 'DELETE'
    })
    const data = await response.json()
    console.log(data)
  }
  const handleLogout = () => {
    // Función para manejar el cierre de sesión después de la confirmación
    signOut(auth)
      .then(() => {
        deleteCokies().then(()=>{
          console.log("Cierre de sesión exitoso");
          router.push("/Cuenta");
        })
      })
      router.push("/Cuenta")
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  const handleLogoutConfirmation = () => {
    // Función para manejar la confirmación de cierre de sesión
    handleLogout();
    setShowConfirmation(false);
  };

  const CerrarSesion = () => {
    // Función para mostrar la alerta de confirmación antes de cerrar sesión
    setShowConfirmation(true);
  };

  return (
    <div
      className={`navBar ${isAdmin ? "admin" : ""} ${
        menuActive ? "showMenu" : ""
      }`}
    >
      <Link href="/" className="bachecito26">
        <img
          src="https://i.postimg.cc/T3NQg97V/Logo.png"
          alt="Logo Bachecito 26"
          className="nopelien"
        />
        BACHECITO 26
      </Link>

      <div
        className={`menuIcon ${showMenuIcon ? "span-anime" : "hidden"}`}
        onClick={toggleMenu}
      >
        <div className={`menu-icon ${menuActive ? "" : ""}`}>
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
                <Link
                  href="/Cuenta/Administrador/Dashboard"
                  className="opc-admin"
                >
                  <img
                    src="https://i.postimg.cc/3JkMwkG1/estadisticas-1.png"
                    alt="estadisticas"
                  />
                  <span className="hover-text">Dashboard</span>
                </Link>
                <Link
                  href="/Cuenta/Administrador/Reportes"
                  className="opc-admin"
                >
                  <img
                    src="https://i.postimg.cc/6QLgPnsW/encuesta-h-1.png"
                    alt="reportes"
                  />
                  <span className="hover-text">Reportes</span>
                </Link>
                <Link
                  href="/Cuenta/Administrador/Usuarios"
                  className="opc-admin"
                >
                  <img
                    src="https://i.postimg.cc/mrpNVWSr/usuarios-alt.png"
                    alt="usuarios"
                  />
                  <span className="hover-text">Usuarios</span>
                </Link>
                <Link href="/Cuenta/Administrador/Mapa" className="opc-admin">
                  <img
                    src="https://i.postimg.cc/QMrvSSyY/marcador-de-mapa-1.png"
                    alt="mapa"
                  />
                  <span className="hover-text">Mapa</span>
                </Link>
                <Link
                  href="/Cuenta/Administrador/NuevoAdmin"
                  className="opc-admin"
                >
                  <img
                    src="https://i.postimg.cc/02FTK9ds/agregar-usuario-1.png"
                    alt="administrador nuevo"
                  />
                  <span className="hover-text">Administradores</span>
                </Link>
                <Link
                  href="/Cuenta/Administrador/Soporte"
                  className="opc-admin"
                >
                  <img
                    src="https://i.postimg.cc/HkMfQFB7/constructor-1.png"
                    alt="soporte"
                  />
                  <span className="hover-text">Soporte</span>
                </Link>
                <Link href="#" className="opc-admin">
                  <img
                    src="https://i.postimg.cc/qRJSHq08/salida-2.png"
                    alt="salir"
                    onClick={CerrarSesion}
                  />
                  <span className="hover-text">Salir</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/Cuenta/Usuario/Perfil"
                  className="opc btn--white prueba"
                >
                  <span>Perfil →</span>
                </Link>
                <Link href="/Cuenta/Usuario/Favoritos" className="opc">
                  Baches Guardados
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

      {showConfirmation && (
        <ConfirmationAlert
          className="alerta-custom-navbar"
          message="¿Está seguro de que desea cerrar sesión?"
          onConfirm={handleLogoutConfirmation}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}

export default Navbar;
