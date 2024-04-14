"use client";
import dynamic from "next/dynamic";
import Circular from "@/components/Circular2";
import "./Mapa.css";
import React, { useState } from "react"; 

const DynamicMap = dynamic(() => import("@/components/MapAdmin"), {
  ssr: false,
});

export default function MapAdmin() {
  // Crea un estado para controlar la visibilidad de container-graphics
  const [isGraphicsVisible, setIsGraphicsVisible] = useState(true);

  // Función para manejar el clic en el botón
  const handleToggleGraphics = () => {
    setIsGraphicsVisible(!isGraphicsVisible);
  };

  return (
    <div className="container-mapa-admin">
      <div className="filtros2">
        <button className="btn-ocultar" onClick={handleToggleGraphics}>
          {isGraphicsVisible ? "Ocultar gráficos" : "Mostrar gráficos"}
        </button>
      </div>
      <DynamicMap />
      {/* Solo muestra el div si isGraphicsVisible es true */}
      {isGraphicsVisible && (
        <div className="container-graphics">
          <Circular />
        </div>
      )}
    </div>
  );
}
