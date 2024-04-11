"use client";
import { useEffect, useState } from "react";
import React from "react";
import "./Reportes.css";

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
    <div id="tabla-reportes" style={{ marginTop: "100px" }}>
      <table>
        <thead>
          <tr>
            <th style={{ padding: "25px" }}>Fecha</th>
            <th style={{ padding: "25px" }}>Fotografía</th>
            <th style={{ padding: "25px" }}>Alcaldía</th>
            <th style={{ padding: "25px" }}>Dirección</th>
            <th style={{ padding: "25px" }}># Reportado</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte, index) => (
            <tr key={index}>
              <td>{reporte.fechaReporte}</td>
              <td style={{ maxWidth: '150px', maxHeight: '150px', overflow: 'hidden' }}>
                <img src={reporte.imagenURL} style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} alt="Fotografía"/>
              </td>
              <td>{obtenerAlcaldiaCDMX(reporte.ubicacion)}</td>
              <td>{reporte.ubicacion}</td>  
              <td>1</td>  
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
