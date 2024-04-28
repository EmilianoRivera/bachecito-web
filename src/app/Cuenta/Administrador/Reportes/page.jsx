
"use client";
import { useEffect, useState } from "react";
import React from "react";
import Link from 'next/link';
import "./Reportes.css";
import ReportesAdmin  from "@/components/ReportesAdmin";

export default function Reportes() {
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
  const [reportes, setReportes] = useState([]);
  const obtenerAlcaldiaCDMX = (ubicacion) => {
    // Lista de nombres de alcaldías de la CDMX
    const alcaldiasCDMX = ["Azcapotzalco", "Coyoacán", "Cuajimalpa", "Gustavo A. Madero", "Iztacalco", "Iztapalapa", "Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta", "Tláhuac", "Tlalpan", "Venustiano Carranza", "Xochimilco"];
  
    const ubicacionLowercase = ubicacion.toLowerCase();
     
    const alcaldiaEncontrada = alcaldiasCDMX.find(alcaldia => ubicacionLowercase.includes(alcaldia.toLowerCase()));
    return alcaldiaEncontrada ? alcaldiaEncontrada : "No disponible";
  };
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Reportes");
      const data = await res.json(); // Espera a que se resuelva la promesa
      setReportes(data);
    }

    fetchData();
  }, []);

  /*ESTO ES DEL RANGO PERSONALIZADO */
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  /*ESTO ES DEL FILTRO DE FECHA EN GENERAL */
 
  const [filtroFecha, setFiltroFecha] = useState("Todos los tiempos");
 
 
  const [estado, setEstado] = useState("Todos");
  const [alcaldias, setAlcaldia] = useState("Todas");
 
 // Estados para manejar la visibilidad de los select
 const [isFechaSelectVisible, setIsFechaSelectVisible] = useState(false);
 const [isAlcaldiaSelectVisible, setIsAlcaldiaSelectVisible] = useState(false);
 const [isEstadoSelectVisible, setIsEstadoSelectVisible] = useState(false);

 const handleAlcaldiaChange = (e) => {
   console.log("Alcaldía seleccionada:", e.target.value);
   setAlcaldia(e.target.value) 
   console.log("Acaldías")
 };

 const handleEstadoChange = (e) => {
   setEstado(e.target.value);
   console.log("Estado")
 };

 const handleFechaChange = (e) => {
   const selectedValue = e.target.value;
   console.log("Fecha seleccionada:", selectedValue);
   setFiltroFecha(selectedValue);
    console.log("Fecha")
 };

 const nombreAlcaldia = alcaldias.replace(/^[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+|[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+$/g, "");
        async function fetchFiltroEstado() {
          try {
            const parametros = {
              estado: estado,
              alcaldia: alcaldias,
              filtroFecha: filtroFecha,
              startDate: startDate,
              endDate: endDate
            };

            // Realizar la solicitud POST con el objeto de parámetros en el cuerpo
            const datosNuevos = await fetch(`/api/filtrosReportes/${estado}/${nombreAlcaldia}/${filtroFecha}/${startDate}/${endDate}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json' // Indicar que el cuerpo es JSON
              },
              body: JSON.stringify(parametros) // Convertir el objeto a JSON
            });
            if (!datosNuevos.ok) {
              throw new Error("Fallo a la petición de /api/filtros/estado/${estado}");
            }
            const estadosReportes = await datosNuevos.json();
            console.log(estadosReportes);

          } catch (error) {
            console.error("Error a la hora de hacer la petición a /api/filtros/estado/${estado}: ", error);
          }
        }

        fetchFiltroEstado();
        function FiltrarAlcaldia(){
          
        }
  return (
    <div className="main-containerReportes" style={{ marginTop: "100px" }}>
          <div className="flex-papelera">
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

              <div className="papelera">
                <Link href="/Cuenta/Administrador/Papelera" className="papelera-option"><img src="https://i.postimg.cc/02gZVXL3/basura.png" alt="soporte" />PAPELERA</Link>
              </div>
          </div>
            <div >
            <ReportesAdmin />
            </div>
    </div>
  );
}
