import React, { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import moment from "moment";
import 'moment/locale/es'; // Importar la configuración local en español
moment.locale('es'); // Establecer el idioma a español

async function fetchFiltroEstado(
  estado,
  alcaldia,
  filtroFecha,
  startDate,
  endDate
) {
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

export function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX =
    /(Álvaro Obregón|Azcapotzalco|Benito Juárez|Coyoacán|Cuajimalpa de Morelos|Cuauhtémoc|Gustavo A. Madero|Iztacalco|Iztapalapa|La Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tlalpan|Tláhuac|Venustiano Carranza|Xochimilco)/gi;
  const alcaldiasEnUbicacion = ubicacion.match(regexAlcaldiasCDMX);

  if (alcaldiasEnUbicacion) {
    const alcaldiasUnicas = new Set(alcaldiasEnUbicacion);
    const alcaldiasString = Array.from(alcaldiasUnicas).join(", ");
    return alcaldiasString;
  } else {
    return "No se encontraron alcaldías en la ubicación proporcionada.";
  }
}

export default function Barras({
  width ,
  height ,
  estados,
  alcaldias,
  startDates,
  endDates,
  filtroFechas = "Este mes", // Establecemos "Este mes" como filtro predeterminado
}) {
  const svgRef = useRef();
  const [datas, setData] = useState([]);

  // Función para transformar y agrupar los datos por fecha y alcaldía
  const transformData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const fecha = moment(item.fechaReporte, "D/M/YYYY").valueOf();
      const contador = item.contador || 0;
      const alcaldia = buscarAlcaldias(item.ubicacion);

      if (!isNaN(fecha)) {
        const key = `${fecha}-${alcaldia}`;
        if (!acc[key]) {
          acc[key] = { fecha, contador: 0, alcaldia };
        }
        acc[key].contador += contador;
      }
      return acc;
    }, {});

    return Object.values(groupedData).sort((a, b) => a.fecha - b.fecha);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchFiltroEstado(
          estados,
          alcaldias,
          filtroFechas,
          startDates,
          endDates
        );
        if (res === null) {
          throw new Error("Error al traer datos a barras");
        }
        setData(transformData(res));
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, [estados, alcaldias, filtroFechas, startDates, endDates]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        margin={{ top: 20, right: 150, left: 50, bottom: 20 }}
        data={datas}
      >
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="fecha"
          type="category"
          domain={datas.map(entry => entry.fecha)} // Establecer el dominio basado en las fechas
          tickFormatter={(date) => moment(date).format('DD MMM')} // Formatear las fechas en el eje x
          angle={-45}
          textAnchor="end"
          interval={0}
        />

        <YAxis />
        <Tooltip
          formatter={(value, name, props) => {
            const { payload } = props;
            return [`${value}`, `Alcaldía: ${payload.alcaldia}`];
          }}
          labelFormatter={(label) => moment(label).format("DD MMM YYYY")}
        />
        <Bar dataKey="contador" fill="#8884d8" barSize={30} minPointSize={1}>
          {datas.map((entry, index) => (
            <Cell key={`cell-${index}`} fill = {
              index % 3 === 0 ? "#FF8A57" :
              index % 3 === 1 ? "#FFB54E" :
              index % 2 === 0 ? "#FFE75F" :
              index % 3 === 0 ? "#D3FF7A" :
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
  );
}
