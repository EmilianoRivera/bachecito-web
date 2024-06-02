"use client";
import dynamic from "next/dynamic";
import Circular from "@/components/Circular2";
import "./Mapa.css";
import React, { useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  // Estados para manejar la visibilidad de los select
  const [isFechaSelectVisible, setIsFechaSelectVisible] = useState(false);
  const [isAlcaldiaSelectVisible, setIsAlcaldiaSelectVisible] = useState(false);
  const [isEstadoSelectVisible, setIsEstadoSelectVisible] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filtroFecha, setFiltroFecha] = useState("Todos los tiempos");
  const [alcaldia,  setSelectedAlcaldia] = useState("Todas")
  const [mapInitialized, setMapInitialized] = useState(false); // Definición de mapInitialized
  const [searchStatus, setSearchStatus] = useState("Todos");
  const [searchFolio, setSearchFolio] = useState("Todos los folios");
  
  const handleAlcaldiaChange = (e) => {
    const selectedFolio = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedAlcaldia = selectedOption.text.replace(/^[^\w]+/, "").trim();
    setSearchFolio(selectedFolio);
    setSelectedAlcaldia(selectedAlcaldia);
  };
  useEffect(() => {
    // Marca el mapa como inicializado
    setMapInitialized(true);
  }, [searchFolio, searchStatus]);


  const handleFechaChange = (e) => {
    const selectedValue = e.target.value;
    //console.log("Fecha seleccionada:", selectedValue);
    setFiltroFecha(selectedValue);
  };

  
  return (
    <div className="container-mapa-admin">
      <div className="filtros2">
        <div className="filtro" id="fechas">
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

        <div className="filtro" id="alcaldia">
          <label
            onClick={() => setIsAlcaldiaSelectVisible(!isAlcaldiaSelectVisible)}
          >
            <img src="https://i.postimg.cc/wjw2xf0Z/marcador_(1).png" alt={``} />

            Alcaldía
          </label>
          {isAlcaldiaSelectVisible && (
              <select
              className="filter-estados-estadisticas"
              value={searchFolio}
              onChange={handleAlcaldiaChange}
            >
              <option value="Todas">Todas</option>
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
          )}
        </div>

        <div className="filtro" id="estado">
          <label
            onClick={() => setIsEstadoSelectVisible(!isEstadoSelectVisible)}
          >
            <img src="https://i.postimg.cc/bwyLhcH1/bandera-alt.png" alt={``} />

            Estado
          </label>
          {isEstadoSelectVisible && (
            <select  onChange={(e) => setSearchStatus(e.target.value)}>
              <option value="Sin Estado">Todos</option>
              <option value="Sin Estado">Sin Estado</option>
              <option value="Sin atender">Sin atender</option>
              <option value="En Atención">En Atención</option>
              <option value="Atendido">Atendido</option>
            </select>
          )}
        </div>
      </div>
      <button className="btn-ocultar" onClick={handleToggleGraphics}>
        {isGraphicsVisible ? "Ocultar gráficos" : "Mostrar gráficos"}
      </button>
      {mapInitialized && (
         <DynamicMap searchFolio={searchFolio} searchStatus={searchStatus} alcaldia={alcaldia} />
      )}
      {/* Solo muestra el div si isGraphicsVisible es true */}
      {isGraphicsVisible && (
        <div className="container-graphics">
          <Circular />
        </div>
      )}
    </div>
  );
}
