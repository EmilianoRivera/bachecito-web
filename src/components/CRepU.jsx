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
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="totalReportes">
    <div className="encabezado">
     
      <h1>REPORTES TOTALES:</h1>
      <div className="contador">   {totalRep}  </div>
    </div>
    <div className="estados">
      <div className="in-red">
        <div className="red"><span class="tooltip">Sin atender</span></div>
        <div className="cont-reportes">  {repEstado.sinAtender}  </div>
      </div>
      <div className="in-yellow">
        <div className="yellow"><span class="tooltip">En atención</span></div>
        <div className="cont-reportes">  {repEstado.enAtencion} </div>
      </div>
      <div className="in-green">
        <div className="green"><span class="tooltip">Atendido</span></div>
        <div className="cont-reportes">  {repEstado.atendido} </div>
      </div>
    </div>
  </div>
  );
}

export default CRep;

