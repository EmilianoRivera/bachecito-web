"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { enc, desc } from "@/scripts/Cifrado/Cifrar";
import "@/components/Circular2.css";

async function fetchFiltroEstado(estado, alcaldias, filtroFecha, startDate, endDate) {
  
  const alcaldia = alcaldias.replace(/^[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+|[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+$/g, "");
  try {
    const parametros = {
      estado: estado,
      alcaldia: alcaldia,
      filtroFecha: filtroFecha,
      startDate: startDate,
      endDate: endDate,
    };
    const baseURL = process.env.NEXT_PUBLIC_RUTA_F;
    const response = await fetch(
      `${baseURL}/${estado}/${alcaldia}/${filtroFecha}/${startDate}/${endDate}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parametros),
      }
    );
    if (!response.ok) {
      throw new Error("Fallaron los filtros");
    }

    const resultado = await response.json();
    if (!Array.isArray(resultado)) {
      console.log("La respuesta del servidor no es un array");
    }

    const data = resultado.map((rep) => desc(rep));
    return data;
  } catch (error) {
    console.error("Error a la hora de hacer la petición ", error);
    return null;
  }
}

function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX =
    /(Álvaro Obregón|Azcapotzalco|Benito Juárez|Coyoacán|Cuajimalpa de Morelos|Cuauhtémoc|Gustavo A. Madero|Iztacalco|Iztapalapa|La Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tlalpan|Tláhuac|Venustiano Carranza|Xochimilco)/gi;
  const contAlcaldias = {};

  const alcaldiasEnUbicacion = ubicacion.match(regexAlcaldiasCDMX);

  if (alcaldiasEnUbicacion) {
    alcaldiasEnUbicacion.forEach((alcaldia) => {
      const alcaldiaLower = alcaldia.toLowerCase();
      contAlcaldias[alcaldiaLower] = (contAlcaldias[alcaldiaLower] || 0) + 1;
    });
  }

  return contAlcaldias;
}

function formatearDatos(result) {
  const contAlcaldias = {};
  let alcaldiasEnReporte;
  if (result !== null) {
    result.forEach((obj) => {
      if (obj.ubicacion) {
        alcaldiasEnReporte = buscarAlcaldias(obj.ubicacion);
      }

      Object.keys(alcaldiasEnReporte).forEach((alcaldia) => {
        contAlcaldias[alcaldia] =
          (contAlcaldias[alcaldia] || 0) + alcaldiasEnReporte[alcaldia];
      });
    });

    return contAlcaldias;
  }
  console.error("Cargando datos");
  return {};
}

export default function Circular({
  width, // Define default width
  height, // Define default height
  estados,
  alcaldias,
  startDates,
  endDates,
  filtroFechas,
}) {
  const [rep, setRep] = useState([]); //guarda los reportes totales por alcaldia

  const [isLoading, setIsLoading] = useState(true);
const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await fetchFiltroEstado(
          estados,
          alcaldias,
          filtroFechas,
          startDates,
          endDates,
          setDataLoaded(true)
        );

        if (result === null) {
          throw new Error("Failed to fetch data");
        }

        const formateados = formatearDatos(result);
        setRep(formateados);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [estados, alcaldias, startDates, endDates, filtroFechas]);

  const data = Object.keys(rep).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
    value: rep[key],
  }));

  const COLORS = [
    "#FF8A57",
    "#FFB54E",
    "#FFE75F",
    "#D3FF7A",
    "#90F49B",
    "#2EC4B6",
    "#49C3FB",
    "#65A6FA",
    "#5D9DD5",
    "#65A6FA",
    "#49C3FB",
    "#2EC4B6",
    "#90F49B",
    "#D3FF7A",
    "#FFE75F",
    "#FFB54E",
  ];

  

  return (
    <div>
      {isLoading ? (
        <div style={{ fontFamily: 'sans-serif'}}>
        <div class="loader-wheel-changer-c">
          </div>
      </div>
      ) : dataLoaded && data.length === 0 ? (
        <div className="noloader">No hay datos disponibles</div>
      ) : dataLoaded ? (
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={25}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} reportes`, `Alcaldía: ${name}`]}
            labelFormatter={(name) => `Alcaldía: ${name}`}
            style={{ fontFamily: 'sans-serif', fontSize: '13px' }} // Tipografía y tamaño de fuente
          />
          <Legend
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            style={{ fontFamily: 'sans-serif', fontSize: '13px' }} // Tipografía y tamaño de fuente
          />
        </PieChart>
      ) : (
        <div className="noloader">Error al cargar los datos</div>
      )}

    </div>
  );
}
