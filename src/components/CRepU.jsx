"use client";
import { useEffect, useState } from "react";
import React from "react";
import { desc } from "@/scripts/Cifrado/Cifrar";
function CRep() {
  const [totalRep, setTotalRep] = useState(0);
  const [repEstado, setRepEstado] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const baseURLT = process.env.NEXT_PUBLIC_RUTA_REPT;
        const baseURLE = process.env.NEXT_PUBLIC_RUTA_RE;
        const reportesTot = await fetch(`${baseURLT}`);
        const reportesEst = await fetch(`${baseURLE}`);

        if (!reportesTot.ok && !reportesEst.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await reportesTot.json();
        const data2 = await reportesEst.json();

        // Descifrar los datos
        const dataDesc = desc(data);
        const dataDesc2 = desc(data2.cifrado);

        setTotalRep(dataDesc);
        setRepEstado(dataDesc2);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="totalReportes-estadisticas">
      <div className="encabezado-estadisticas">
        <h1>REPORTES TOTALES:</h1>
        <div className="contador-estadisticas"> {totalRep} </div>
      </div>
      <div className="estados-estadisticas">
        <div className="in-red">
          <div className="red">
            <span className="tooltip">Sin atender</span>
          </div>
          <div className="cont-reportes-estadisticas">
            {repEstado["Sin Atender"]}{" "}
          </div>
        </div>
        <div className="in-yellow">
          <div className="yellow">
            <span className="tooltip">En atención</span>
          </div>
          <div className="cont-reportes-estadisticas">
            {repEstado["En Atención"]}{" "}
          </div>
        </div>
        <div className="in-green">
          <div className="green">
            <span className="tooltip">Atendido</span>
          </div>
          <div className="cont-reportes-estadisticas">
            {repEstado.Atendido}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CRep;
