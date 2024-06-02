"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CRep from "@/components/CRepU";
import BarrasU from "@/components/BarrasU";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import Alerta from "@/components/Alerta1";
import Router from 'next/router';
import Preloader from "@/components/preloader2";

// Importa el componente del mapa de manera dinámica
const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function Estadisticas() {
  const [filtroFecha, setFiltroFecha] = useState("Todos los tiempos");
  const [alcaldia, setSelectedAlcaldia] = useState("Todas");
  const [searchStatus, setSearchStatus] = useState("Todos");
  const [searchFolio, setSearchFolio] = useState("Todas");
  const [isFechaSelectVisible, setIsFechaSelectVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [mapInitialized, setMapInitialized] = useState(false);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeComplete);

    // Limpieza de los eventos al desmontar el componente
    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, []);

  const handleFechaChange = (e) => {
    const selectedValue = e.target.value;
    setFiltroFecha(selectedValue);
  };

  const handleAlcaldiaChange = (e) => {
    const selectedFolio = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedAlcaldia = selectedOption.text.replace(/^[^\w]+/, "").trim();
    setSearchFolio(selectedFolio);
    setSelectedAlcaldia(selectedAlcaldia);
  };

  useEffect(() => {
    setMapInitialized(true);
  }, [searchFolio, searchStatus, filtroFecha, startDate, endDate]);

  return (
    <>
      {loading && <Preloader />}
      <div className="container">
        <Alerta />
        <div className="izquierda-mapa">
          <div className="filtros-estadisticas-u">
            <div className="fecha-estadisticas">
              <select onChange={handleFechaChange} className="filter-estados-estadisticas">
                <option value="Todos los tiempos">Todos los tiempos</option>
                <option value="Hoy">Hoy</option>
                <option value="Esta semana">Esta semana</option>
                <option value="Último mes">Último mes</option>
                <option value="Últimos 6 meses">Últimos 6 meses</option>
                <option value="Este año">Este año</option>
                <option value="Rango personalizado">Rango personalizado</option>
              </select>
              {filtroFecha === "Rango personalizado" && (
                <div className="custom-date">
                  <DatePicker
                    className="datepicker"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                  <DatePicker
                    className="datepicker"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
              )}
            </div>
            <div className="alcaldia-estadisticas">
              <select
                className="filter-estados-estadisticas"
                value={searchFolio}
                onChange={handleAlcaldiaChange}
              >
                <option value="">Todas</option>
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
            <div className="estado-estadisticas">
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="filter-estados-estadisticas"
              >
                <option value="Todos">Todos</option>
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
              estados={searchStatus}
              alcaldia={alcaldia}
              fechaFiltro={filtroFecha}
              startDates={startDate}
              endDates={endDate}
            />
          </div>
        </div>

        <div className="derecha-mapaa">
          <div className="acceso-reportar">
            <p>¿Has visto algún bache y olvidaste reportarlo desde la app? <Link className="acceso" href="/Cuenta/Usuario/Reportar"> ¡Reportalo desde aquí!           <img className="icono-acceso" src="https://i.postimg.cc/fLhvc42Q/angulo-pequeno-derecho.png" alt="" /></Link></p>
          </div>
          <div className="mapa">
            {mapInitialized && (
              <DynamicMap
                searchFolio={searchFolio}
                searchStatus={searchStatus}
                alcaldia={alcaldia}
                filtroFecha={filtroFecha}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
