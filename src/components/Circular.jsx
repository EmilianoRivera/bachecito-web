"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

async function fetchFiltroEstado(
  estado,
  alcaldias,
  filtroFecha,
  startDate,
  endDate
) {
  const alcaldia = alcaldias.replace(
    /^[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+|[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+$/g,
    ""
  );
  try {
    const parametros = {
      estado: estado,
      alcaldia: alcaldia,
      filtroFecha: filtroFecha,
      startDate: startDate,
      endDate: endDate,
    };

    const response = await fetch(
      `/api/filtros/${estado}/${alcaldia}/${filtroFecha}/${startDate}/${endDate}`,
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
    const resultadoFiltros = await response.json();
    return resultadoFiltros;
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

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchFiltroEstado(
          estados,
          alcaldias,
          filtroFechas,
          startDates,
          endDates
        );

        if (result === null) {
          throw new Error("Failed to fetch data");
        }

        const formateados = formatearDatos(result);
        setRep(formateados);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, [estados, alcaldias, startDates, endDates, filtroFechas]);

  const data = Object.keys(rep).map((key) => ({
    name: key,
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
      {data.length > 0 ? (
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={150}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} reportes`, name]}
            labelFormatter={(name) => `Alcaldía: ${name}`}
          />
          <Legend />
        </PieChart>
      ) : (
        <div>Cargando datos...</div>
      )}
    </div>
  );
}