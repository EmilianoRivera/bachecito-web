import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

// Función para extraer las alcaldías de la ubicación
function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX =
    /(Álvaro Obregón|Azcapotzalco|Benito Juárez|Coyoacán|Cuajimalpa de Morelos|Cuauhtémoc|Gustavo A. Madero|Iztacalco|Iztapalapa|La Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tlalpan|Tláhuac|Venustiano Carranza|Xochimilco)/gi;
  const alcaldiasEnUbicacion = ubicacion.match(regexAlcaldiasCDMX);

  if (alcaldiasEnUbicacion) {
    const alcaldiasUnicas = new Set(alcaldiasEnUbicacion);
    const alcaldiasArray = Array.from(alcaldiasUnicas);
    return alcaldiasArray;
  } else {
    return [];
  }
}

async function fetchFiltroEstado(estado, alcaldia, filtroFecha, startDate, endDate) {
  try {
    const nombreAlcaldia = alcaldia.replace(
      /^[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+|[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+$/g,
      ""
    );
    const parametros = {
      estado: estado,
      alcaldia: nombreAlcaldia,
      filtroFecha: filtroFecha,
      startDate: startDate,
      endDate: endDate,
    };

    const response = await fetch(
      `/api/filtros/${estado}/${nombreAlcaldia}/${filtroFecha}/${startDate}/${endDate}`,
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

const BarrasU = ({ estados, alcaldia, fechaFiltro, startDates, endDates }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchFiltroEstado(estados, alcaldia, fechaFiltro, startDates, endDates);
        if (res === null) {
          throw new Error("Error al traer datos a barras");
        }
        setDatos(res);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, [estados, alcaldia, fechaFiltro, startDates, endDates]);

  // Transformar los datos para que coincidan con la estructura requerida por Recharts
  const formattedData = datos.map((item) => ({
    alcaldia: buscarAlcaldias(item.ubicacion).join(", "), // Obtener las alcaldías
    reportes: 1, // Cada objeto en los datos representa un reporte, por lo que siempre es 1
  }));

  // Agrupar los datos por alcaldía y contar el número de reportes
  const groupedData = formattedData.reduce((acc, curr) => {
    if (!acc[curr.alcaldia]) {
      acc[curr.alcaldia] = 0;
    }
    acc[curr.alcaldia] += curr.reportes;
    return acc;
  }, {});

  // Convertir los datos agrupados en un array
  const finalData = Object.keys(groupedData).map((alcaldia) => ({
    alcaldia,
    reportes: groupedData[alcaldia],
  }));

  return (
    <div style={{ width: '100%', height: 300 }}> {/* Ajusta el alto aquí */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={finalData}>
          <XAxis dataKey="alcaldia" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Bar dataKey="reportes" fill="#8884d8"> 
            {finalData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={
                index % 3 === 0 ? "#FF8A57" :
                index % 3 === 1 ? "#FFB54E" :
                index % 2 === 0 ? "#FFE75F" :
                index % 5 === 0 ? "#90F49B" :
                index % 7 === 0 ? "#2EC4B6" :
                index % 11 === 0 ? "#49C3FB" :
                index % 13 === 0 ? "#65A6FA" :
                index % 17 === 0 ? "#5D9DD5" :
                index % 19 === 0 ? "#65A6FA" :
                index % 23 === 0 ? "#49C3FB" :
                index % 29 === 0 ? "#2EC4B6" :
                index % 31 === 0 ? "#90F49B" :
                index % 37 === 0 ? "#D3FF7A" :
                index % 41 === 0 ? "#FFE75F" :
                "#FFB54E"
              } />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarrasU;
