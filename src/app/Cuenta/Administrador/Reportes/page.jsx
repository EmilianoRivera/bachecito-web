
"use client";
import { useEffect, useState } from "react";
import React from "react";
import Link from 'next/link';
import "./Reportes.css";
import ReportesAdmin  from "@/components/ReportesAdmin";

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const obtenerAlcaldiaCDMX = (ubicacion) => {
    // Lista de nombres de alcaldías de la CDMX
    const alcaldiasCDMX = ["Azcapotzalco", "Coyoacán", "Cuajimalpa", "Gustavo A. Madero", "Iztacalco", "Iztapalapa", "Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta", "Tláhuac", "Tlalpan", "Venustiano Carranza", "Xochimilco"];
  
    const ubicacionLowercase = ubicacion.toLowerCase();
     
    const alcaldiaEncontrada = alcaldiasCDMX.find(alcaldia => ubicacionLowercase.includes(alcaldia.toLowerCase()));
    return alcaldiaEncontrada ? alcaldiaEncontrada : "No disponible";
  };
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Reportes");
      const data = await res.json(); // Espera a que se resuelva la promesa
      setReportes(data);
    }

    fetchData();
  }, []);
  return (
    <div className="main-containerReportes" style={{ marginTop: "100px" }}>
            <div className="flex-papelera">
              <div className='filtros2'>
                  <div className="fecha"></div>
                  <div className="alcaldia"></div>
                  <div className="estado"></div>
              </div>
              <div className="papelera">
                <Link href="/Cuenta/Administrador/Papelera" className="papelera-option"><img src="https://i.postimg.cc/02gZVXL3/basura.png" alt="soporte" />PAPELERA</Link>
              </div>
            </div>
            <div >
            <ReportesAdmin />
            </div>
    </div>
  );
}
