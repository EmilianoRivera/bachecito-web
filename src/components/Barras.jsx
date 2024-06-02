import React, { useEffect, useRef, useState } from "react";
import { enc, desc } from "../scripts/Cifrado/Cifrar";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Brush,
} from "recharts";
import moment from "moment";
import 'moment/locale/es';

moment.locale('es');

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
  estado = "Todos",
  alcaldia = "Todas",
  filtroFecha = "Todos los tiempos",
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
  const reportesMismoDiaYAlcaldia = data.filter(
    (item) =>
      moment(item.fechaReporte, "D/M/YYYY").format("YYYY-MM-DD") ===
        moment(fechaReporte, "D/M/YYYY").format("YYYY-MM-DD") &&
      buscarAlcaldias(item.ubicacion) === alcaldia
  );
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

  const transformData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const fecha = moment(item.fechaReporte, "D/M/YYYY").valueOf();
      const contador = item.contador || 0;
      const alcaldia = buscarAlcaldias(item.ubicacion);
      const cont = funcCont(data, item.fechaReporte, alcaldia);
      if (!isNaN(fecha)) {
        const key = `${fecha}-${alcaldia}`;
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

  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          margin={{ top: 20, right: 150, left: 50, bottom: 70 }} // Ajustar margen inferior
          data={datas}
          style={{ fontFamily: 'sans-serif', fontSize: '13px' }}
        >
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="fecha"
            type="category"
            domain={datas.map(entry => entry.fecha)}
            tickFormatter={(date) => moment(date).format('DD MMM')}
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
          <Brush
            dataKey="fecha"
            height={30}
            stroke="#FF8A57"
            fill="rgba(255, 138, 87, 0.2)"
            travellerStroke="#FF8A57"
            tickFormatter={(date) => moment(date).format('DD/MM/YYYY')}
            y={height - 50} // Mover el Brush más abajo
          />
          <Bar dataKey="contador" barSize={30} minPointSize={1}>
            {datas.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
        {alcaldias.split(',').map((alcaldia, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index % COLORS.length], marginRight: '5px' }}></div>
            <span style={{ fontFamily: 'sans-serif', fontSize: '13px' }}>{alcaldia.trim()}</span>
          </div>
        ))}
      </div>
    </>
  );
}
