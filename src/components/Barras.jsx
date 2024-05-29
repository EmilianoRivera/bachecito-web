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
import {obtenerFechaActual, formatearFecha} from "../scripts/funcionesFiltro"
import 'moment/locale/es'; // Importar la configuración local en español
moment.locale('es'); // Establecer el idioma a español

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

async function fetchFiltroEstado(
  estado="Todos",
  alcaldia ="Todas",
  filtroFecha ="Todos los tiempos",
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

function buscarAlcaldias(ubicacion) {
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
function funcCont(data, fechaReporte, alcaldia) {
  // Filtrar los reportes que tengan la misma fecha y alcaldía
  const reportesMismoDiaYAlcaldia = data.filter(
    (item) =>
      moment(item.fechaReporte, "D/M/YYYY").format("YYYY-MM-DD") ===
        moment(fechaReporte, "D/M/YYYY").format("YYYY-MM-DD") &&
      buscarAlcaldias(item.ubicacion) === alcaldia
  );

  // Contar la cantidad de reportes
  return reportesMismoDiaYAlcaldia.length;
}
export default function Barras({
  width,
  height,
  estados,
  alcaldias,
  startDates,
  endDates,
  filtroFechas = "Este mes", 
}) {
  const svgRef = useRef();
  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para transformar y agrupar los datos por fecha y alcaldía
  const transformData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const fecha = moment(item.fechaReporte, "D/M/YYYY").valueOf();
      const contador = item.contador || 0;
      const alcaldia = buscarAlcaldias(item.ubicacion);
      const cont = funcCont(data, item.fechaReporte, alcaldia);
      console.log(cont);
      if (!isNaN(fecha)) {
        const key = `${fecha}-${alcaldia}`; // Unique key for each combination of date and alcaldia
        if (!acc[key]) {
          acc[key] = { fecha, contador: cont, alcaldia };
        } else {
          acc[key].cont += cont;
        }
      }
      return acc;
    }, {});
  
    return Object.values(groupedData).sort((a, b) => a.fecha - b.fecha);
  };
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [estados, alcaldias, filtroFechas, startDates, endDates]);

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        margin={{ top: 20, right: 150, left: 50, bottom: 20 }}
        data={datas}
        style={{ fontFamily: 'sans-serif', fontSize: '13px' }}
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
          style={{ fontFamily: 'sans-serif', fontSize: '13px' }}
        />

        <YAxis />
        <Tooltip
          formatter={(value, name, props) => {
            const { payload } = props;
            return [`${value}`, `Alcaldía: ${payload.alcaldia}`];
          }}
          labelFormatter={(label) => moment(label).format("DD MMM YYYY")}
          style={{ fontFamily: 'sans-serif', fontSize: '13px' }}
        />
        <Bar dataKey="contador" barSize={30} minPointSize={1}>
          {datas.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
