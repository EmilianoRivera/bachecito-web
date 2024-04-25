"use client";
import React, { useState } from "react";
import "./dash.css";
import Barras from "@/components/BarrasU";
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
  const [estado, setEstado] = useState("Todos");
  const [alcaldias, setAlcaldia] = useState("Todas");
console.log(estado)
 // Estados para manejar la visibilidad de los select
 const [isFechaSelectVisible, setIsFechaSelectVisible] = useState(false);
 const [isAlcaldiaSelectVisible, setIsAlcaldiaSelectVisible] = useState(false);
 const [isEstadoSelectVisible, setIsEstadoSelectVisible] = useState(false);

 const handleAlcaldiaChange = (e) => {
   console.log("Alcaldía seleccionada:", e.target.value);
 };

 const handleEstadoChange = (e) => {
   setEstado(e.target.value);
 };

 const handleFechaChange = (e) => {
   const selectedValue = e.target.value;
   console.log("Fecha seleccionada:", selectedValue);
   setFiltroFecha(selectedValue);
 };
  return (
    <div className="container-general">
      <div className="filtros-dashboard">
        <div className="filtro-dashboard" id="fechas">
          <label onClick={() => setIsFechaSelectVisible(!isFechaSelectVisible)}>
          <img src="https://i.postimg.cc/hPbM6PxS/calendario-reloj.png" alt={``} />

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

        <div className="filtro-dashboard" id="alcaldia">
          <label
            onClick={() => setIsAlcaldiaSelectVisible(!isAlcaldiaSelectVisible)}
          >
            <img src="https://i.postimg.cc/wjw2xf0Z/marcador_(1).png" alt={``} />

            Alcaldía
          </label>
          {isAlcaldiaSelectVisible && (
            <select onChange={handleAlcaldiaChange}>
              {alcaldiasCDMX.map((alcaldia) => (
                <option key={alcaldia} value={alcaldia}>
                  {alcaldia}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="filtro-dashboard" id="estado">
          <label
            onClick={() => setIsEstadoSelectVisible(!isEstadoSelectVisible)}
          >
            <img src="https://i.postimg.cc/bwyLhcH1/bandera-alt.png" alt={``} />

            Estado
          </label>
          {isEstadoSelectVisible && (
            <select onChange={handleEstadoChange}>
              <option value="Todos">Todos</option>
              <option value="Sin atender">Sin atender</option>
              <option value="En Atención">En Atención</option>
              <option value="Atendido">Atendido</option>
            </select>
          )}
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
          <Barras width={500} height={250} estados={estado} />
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
