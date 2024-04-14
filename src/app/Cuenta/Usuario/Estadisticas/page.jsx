"use client"
import Map from "@/components/Map";
import React, { useState } from "react";
import CRep from "@/components/CRepU";
import Circular from "@/components/Circular"; 
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});
export default function Estadisticas() {
  const [estado, setEstado] = useState("sin estado");
  return (
    <div className="container">
      <div className="izquierda-mapa">


        <div className="filtros">
          <div className="fecha"></div>
          <div className="alcaldia"></div>
          <div className="estado"></div>

        </div>
        <CRep></CRep>
        <div className="estadisticas">
          <Circular width={500} height={250} estados={estado} />
        </div>
      </div>

      <div className="mapa">
        <DynamicMap />
      </div>
    </div>

  );
}