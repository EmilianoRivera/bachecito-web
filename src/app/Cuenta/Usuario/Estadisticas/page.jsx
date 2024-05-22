"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CRep from "@/components/CRepU";
import BarrasU from "@/components/BarrasU";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

// Importa el componente del mapa de manera dinámica
const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function Estadisticas() {
  const [estado, setEstado] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos los tiempos");
  const [alcaldia, setSelectedAlcaldia] = useState("Todas");

  const [searchStatus, setSearchStatus] = useState("");
  const [searchFolio, setSearchFolio] = useState("");
  const [isFechaSelectVisible, setIsFechaSelectVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [mapInitialized, setMapInitialized] = useState(false); // Definición de mapInitialized

  const handleFechaChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Fecha seleccionada:", selectedValue);
    setFiltroFecha(selectedValue);
  };
  const handleAlcaldiaChange = (e) => {
    setSearchFolio(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedAlcaldia = selectedOption.text;
    setSelectedAlcaldia(selectedAlcaldia);
  };
  useEffect(() => {
    // Marca el mapa como inicializado
    setMapInitialized(true);
  }, [searchFolio, searchStatus]);

  return (
    <div className="container">
      <div className="izquierda-mapa">
        <div className="filtros">
          <div>   <Link href="/Cuenta/Usuario/Reportar">ola</Link></div>
          <div className="fecha">
            <label
              onClick={() => setIsFechaSelectVisible(!isFechaSelectVisible)}
            >
              Rango Fechas
            </label>
            {isFechaSelectVisible && (
              <select onChange={handleFechaChange}>
                <option value="Todos los tiempos">Todos los tiempos</option>
                <option value="Hoy">Hoy</option>
                <option value="Esta semana">Esta semana</option>
                <option value="Último mes">Último mes</option>
                <option value="Últimos 6 meses">Últimos 6 meses</option>
                <option value="Este año">Este año</option>
                <option value="Rango personalizado">Rango personalizado</option>
              </select>
            )}
            {filtroFecha === "Rango personalizado" && (
              <div className="custom-date">
                <DatePicker
                  className="datepicker"
                  selected={startDate}
                  onChange={setStartDate}
                />
                <DatePicker
                  className="datepicker"
                  selected={endDate}
                  onChange={setEndDate}
                />
              </div>
            )}
          </div>
          <div className="alcaldia">
          <select
        className="filter-estados"
        value={searchFolio}
        onChange={handleAlcaldiaChange}
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
      </select>
          </div>
          <div className="estado">
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="filter-estados"
            >
              <option value="">Todos los estados</option>
              <option value="Sin atender">Sin atender</option>
              <option value="En atención">En atención</option>
              <option value="Atendido">Atendido</option>
            </select>
          </div>
        </div>
        <CRep />
        <div className="estadisticas">
          <BarrasU
            width={250}
            height={200}
            estados={estado}
            alcaldia= {alcaldia}
            fechaFiltro={filtroFecha}
            startDates={startDate}
            endDates={endDate}
          />
        </div>
      </div>
      <div className="mapa">
        {/* Renderiza el mapa solo si está inicializado */}
        {mapInitialized && (
          <DynamicMap searchFolio={searchFolio} searchStatus={searchStatus} />
        )}
      </div>
    </div>
  );
}
