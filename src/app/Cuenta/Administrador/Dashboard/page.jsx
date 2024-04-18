"use client";
import React, { useState } from "react";
import "./dash.css";
import Barras from "@/components/Barras";
import Circular from "@/components/Circular";
import BarrasHz from "@/components/BarrasHz";
import CRep from "@/components/CRep";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function Dashboard() {
  const alcaldiasCDMX = [
    "Todas",
    "🐴 Álvaro Obregón ",
    "🐜 Azcapotzalco ",
    "🐷 Benito Juárez",
    "🐺 Coyoacán",
    "🌳 Cuajimalpa de Morelos",
    "🦅 Cuauhtémoc",
    "🌿 Gustavo A. Madero ",
    "🏠 Iztacalco",
    "🐭 Iztapalapa",
    "🏔 La Magdalena Contreras",
    "🦗 Miguel Hidalgo",
    "🌾 Milpa Alta",
    "🌋 Tláhuac",
    "🦶 Tlalpan",
    "🌻 Venustiano Carranza",
    "🐠 Xochimilco",
  ];
/*ESTO ES DEL RANGO PERSONALIZADO */
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  /*ESTO ES DEL FILTRO DE FECHA EN GENERAL */
  const [filtroFecha, setFiltroFecha] = useState("Hoy");
  const [estado, setEstado] = useState("Sin Estado");
  const [alcaldias, setAlcaldia] = useState("Todas");

  const handleAlcaldiaChange = (e) => {
    setAlcaldia(e.target.value);
  };

  const handleEstadoChange = (e) => {
    setEstado(e.target.value);
  };

  const handleFechaChange = (e) => {
    setFiltroFecha(e.target.value)
  };
  const handleDateChange = (date, setterFunction) => { 
    // Almacenar el valor de la fecha en el estado correspondiente
    setterFunction(date);
  };
  return (
    <div className="container-general">
      <div className="filtros">
        <div id="fechas">
          <h4>Rango Fechas</h4>
          <select onChange={handleFechaChange}>
            <option value="Hoy">Hoy</option>
            <option value="Esta semana">Esta semana</option>
            <option value="Último mes">Último mes</option>
            <option value="Últimos 6 meses">Últimos 6 meses</option>
            <option value="Este año">Este año</option>
            <option value="Todos los tiempos">Todos los tiempos</option>
            <option value="Rango personalizado">Rango personalizado</option>
          </select>
          {filtroFecha === "Rango personalizado" && (
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date, setStartDate)}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => handleDateChange(date, setEndDate)}
              />
            </div>
          )}
        </div>
        <div id="alcaldia">
          <h4>Alcaldía</h4>
          <select onChange={handleAlcaldiaChange}>
            {alcaldiasCDMX.map((alcaldia, index) => (
              <option key={index} value={alcaldia}>
                {alcaldia}
              </option>
            ))}
          </select>
        </div>
        <div id="estados">
          <h4>Estado</h4>
          <select onChange={handleEstadoChange}>
            <option value="Sin Estado">Sin Estado</option>
            <option value="Sin atender">Sin atender</option>
            <option value="En Atención">En Atención</option>
            <option value="Atendido">Atendido</option>
          </select>
        </div>
      </div>
      {/*Componente para los reportes totales y sus estados */}
      <CRep />

      <div className="grafica-circular">
        <h3>ALCALDIAS CON MAS REPORTES</h3>
        <div className="circular">
          <Circular
            width={500}
            height={300}
            estados={estado}
            alcaldias={alcaldias}
            startDates={startDate}
            endDates={endDate}
            filtroFechas = {filtroFecha}
          />
        </div>
      </div>
      <div className="grafica-barras">
        <h3>REPORTES POR ALCALDIA</h3>
        <div className="barras">
          <Barras width={500} height={500} />
        </div>
      </div>
      <div className="grafica-barras-hz">
        <h3>REPORTES SEGÚN SU ESTADO DE ATENCIÓN POR ALCALDIA</h3>
        <BarrasHz width={500} height={300} />
      </div>
    </div>
  );
}

export default Dashboard;
