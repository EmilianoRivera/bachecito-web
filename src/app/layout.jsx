"use client";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import { useState, useEffect } from 'react';
import "./globals.css";
import { ContextAuthProvider } from "../../context/AuthContext";
/**
 * export const metadata = {
  title: "Bachecito 26",
  description: "Página de Bachecito 26, para el reporte de tus baches",
};
 */
export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0); // Estado para almacenar el ancho de la ventana

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }

    updateWindowWidth(); // Actualiza el ancho de la ventana cuando el componente se monta inicialmente

    // Función para actualizar el estado del ancho de la ventana cuando cambia
    const handleResize = () => {
      updateWindowWidth();
    };

    // Agrega un event listener para manejar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar el componente

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedDarkMode = localStorage.getItem('darkMode') === 'true';
                if (savedDarkMode) {
                  document.documentElement.classList.add('dark-mode');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ContextAuthProvider>
          <Navbar />
          <button className="btn-dark" onClick={toggleDarkMode}>
            {darkMode ? <img src="https://i.postimg.cc/FKmmRCvG/dom.png" /> : <img className="lunaaaa" src="https://i.postimg.cc/cLf0dypr/luna.png" />}
          </button>
          {children}
        </ContextAuthProvider>
        {windowWidth > 800 && <Cursor />} {/* Muestra el cursor solo si el ancho de la ventana es mayor a 800px */}
      </body>
    </html>
  );
}
