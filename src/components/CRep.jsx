"use client";
import { useEffect, useState } from "react";
import React from "react";
function CRep() {
  const [totalRep, setTotalRep] = useState(0);
  const [repEstado, setRepEstado] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const reportesTot = await fetch("/api/reportesTotales");
        const reportesEst = await fetch("/api/reportesEstado");

        if (!reportesTot.ok && !reportesEst.ok) {
          throw new Error("Failed to fetch data");      
        }

        const data = await reportesTot.json();
        const data2 = await reportesEst.json();

        setTotalRep(data);
        setRepEstado(data2);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="reportes">
      <div id="reportes-totales">
        <h3>REPORTES TOTALES</h3>
        {totalRep}
      </div>

      {/* Acceder directamente a las propiedades del objeto repEstado */}
      <div id="reportes-no-completos">
        No Resuelto: {repEstado.sinAtender}
      </div>
      <div id="reportes-en-proceso">
        En Proceso: {repEstado.enAtencion}
      </div>
      <div id="reportes-reparados">
        Resuelto: {repEstado.atendido}
      </div>
    </div>
  );
}

export default CRep;

