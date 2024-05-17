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

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, []);

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
        <Cursor />
      </body>
    </html>
  );
}
