"use client"
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import CRep from "@/components/CRepU";
import Circular from "@/components/BarrasU"; 
import "./style.css"
const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});
export default function Estadisticas() {
  const [estado, setEstado] = useState("Sin Estado");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchFolio, setSearchFolio] = useState("");
  const [mapInitialized, setMapInitialized] = useState(false);
  useEffect(() => {
    setMapInitialized(true);
  }, []);
  return (
    <div className="container">
      {/* <Alerta pageId="Pagina-Estadisticas2"></Alerta> */}

      <div className="izquierda-mapa">


        <div className="filtros">
          <div className="fecha"></div>
          <div className="alcaldia">    <select 
            className="filter-estados"
                value={searchFolio}
                onChange={(e) => setSearchFolio(e.target.value)}
            >
                <option value="">Todas las alcaldías</option>
                <option value="001">🐴 Álvaro Obregón</option>
                <option value="002">🐜 Azcapotzalco</option>
                <option value="003">🐷 Benito Juárez</option>
                <option value="004">🐺 Coyoacán</option>
                <option value="005">🌳 Cuajimalpa de Morelos</option>
                <option value="006">🦅 Cuauhtémoc</option>
                <option value="007">🌿 Gustavo A. Madero</option>
                <option value="008">🏠 Iztacalco</option>
                <option value="009">🐭 Iztapalapa</option>
                <option value="010">🏔 La Magdalena Contreras</option>
                <option value="011">🦗 Miguel Hidalgo</option>
                <option value="012">🌾 Milpa Alta</option>
                <option value="013">🌋 Tláhuac</option>
                <option value="014">🦶 Tlalpan</option>
                <option value="015">🌻 Venustiano Carranza</option>
                <option value="016">🐠 Xochimilco</option>


            </select></div>
          <div className="estado">  <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="filter-estados"
            >
                <option value="">Todos los estados</option>
                <option value="Sin atender">Sin atender</option>
                <option value="En atención">En atención</option>
                <option value="Atendido">Atendido</option>
            </select></div>

        </div>
        <CRep></CRep>
        <div className="estadisticas">
          <Circular width={500} height={250} estados={estado} />
        </div>
      </div>

      <div className="mapa">
      {mapInitialized && (
          <DynamicMap searchFolio={searchFolio} searchStatus={searchStatus} />
        )}
      </div>
    </div>

  );
}