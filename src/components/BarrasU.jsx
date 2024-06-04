import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { desc } from "@/scripts/Cifrado/Cifrar";
import "@/components/BarrasU.css";

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
    const baseURL = process.env.NEXT_PUBLIC_RUTA_F;
    const response = await fetch(
      `${baseURL}/${estado}/${nombreAlcaldia}/${filtroFecha}/${startDate}/${endDate}`,
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
    const data = resultadoFiltros.map(rep => desc(rep));
    return data;
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


  if (finalData.length === 0) {
    return <div>
      <div id="file-loader">
      <svg className="svg-barras" width="192" height="192" viewBox="0 0 192 192" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
        <g id="loading-file">
          <g id="folder">
            <path id="folder-base" d="M79.3431 60H55C52.7909 60 51 61.7909 51 64V128C51 130.209 52.7909 132 55 132H137C139.209 132 141 130.209 141 128V70C141 67.7909 139.209 66 137 66H88.6569C87.596 66 86.5786 65.5786 85.8284 64.8284L82.1716 61.1716C81.4214 60.4214 80.404 60 79.3431 60Z"/>
            <g id="files">
              <rect id="file-3" x="60" y="70"/>
              <rect id="file-2" x="58" y="74"/>
              <rect id="file-1" x="56" y="78"/>
            </g>
            <path id="folder-top" d="M140.667 82H51.3329C48.9979 82 47.1594 83.9916 47.3456 86.3191L50.7066 128.319C50.8729 130.398 52.6084 132 54.6938 132H137.308C139.394 132 141.129 130.398 141.296 128.319L144.655 86.3189C144.841 83.9915 143.002 82 140.667 82Z"/>
          </g>
          <path id="mask" fill-rule="evenodd" clip-rule="evenodd" d="M96 0H0V96V192H96H192V96V0H96ZM96 0C149.019 0 192 42.9807 192 96C192 149.019 149.019 192 96 192C42.9807 192 0 149.019 0 96C0 42.9807 42.9807 0 96 0Z"/>
        </g>
      </svg>
      <h2>No hay datos 🚥</h2>
    </div>
    </div>;
  }

  return (
    <div style={{ width: '100%', height: '90%', marginLeft: '-2rem', marginTop: '1vh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={finalData} style={{ fontFamily: 'sans-serif', fontSize: '13px' }}>
          <XAxis dataKey="alcaldia" style={{ fontFamily: 'sans-serif', fontSize: '13px' }} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip style={{ fontFamily: 'sans-serif', fontSize: '13px' }} />
          <Bar dataKey="reportes" fill="#8884d8" barSize={finalData.length === 1 ? 40 : 40} animationBegin={200} animationDuration={1000}>
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
