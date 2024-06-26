import React, { useEffect, useState } from "react";
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
import { desc } from "@/scripts/Cifrado/Cifrar";
moment.locale('es'); // Establecer el idioma a español
import "@/components/txt-graficas.css";
const alcaldias = [
  "Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán",
  "Cuajimalpa de Morelos", "Cuauhtémoc", "Gustavo A. Madero", "Iztacalco",
  "Iztapalapa", "La Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta",
  "Tlalpan", "Tláhuac", "Venustiano Carranza", "Xochimilco"
];
import "@/components/BarrasU.css";

export default function BarrasHz({
  width = 400, // Valor predeterminado para la anchura
  height = 400, // Valor predeterminado para la altura
  estados = "Todos",
  startDates = null,
  endDates = null,
  filtroFechas = "Todos los tiempos",
}) {
  const [alcEstRep, setAlcEstRep] = useState(null);
const [loading, setLoading] = useState(true);
const [noData, setNoData] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const baseURL = process.env.NEXT_PUBLIC_RUTA_EA
        const response = await fetch(`${baseURL}`); 
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();

        const dataDesc = desc(data.cifrado)
        setAlcEstRep(dataDesc);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching data: ", error);
        setLoading(false);
      setNoData(true);
      }
    }

    fetchData();
  }, []);

  const transformData = (data) => {
    if (!data) {
      return [];
    }

    const transformedData = [];
    alcaldias.forEach((alcaldia) => {
      const alcaldiaData = data[alcaldia];
      const emptyData = {
        alcaldia,
        sinAtender: 0,
        enAtencion: 0,
        atendido: 0,
        total: 0,
      };
      if (alcaldiaData) {
        const total = alcaldiaData.sinAtender + alcaldiaData.enAtencion + alcaldiaData.atendido;
        transformedData.push({
          alcaldia,
          sinAtender: alcaldiaData.sinAtender,
          enAtencion: alcaldiaData.enAtencion,
          atendido: alcaldiaData.atendido,
          total,
        });
      } else {
        transformedData.push(emptyData);
      }
    });
    return transformedData;
  };
  
  if (loading) {
    return <div>
      <div class="loading-container">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
    </div>;
} else if (noData) {
return <div>No se encontraron datos</div>;
} else {
  return (
    <ResponsiveContainer width="99%" height={height} >
      <BarChart
        width={width}
        height={height}
        data={transformData(alcEstRep)}
        layout="vertical"
        margin={{ right: 30, left: 30,}}
        style={{fontFamily: 'sans-serif', fontSize: '13px',}}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="alcaldia" type="category" />
        <Tooltip />
        <Bar dataKey="atendido" stackId="a" fill="#A4DF77" />
        <Bar dataKey="enAtencion" stackId="a" fill="#FFC63D" />
        <Bar dataKey="sinAtender" stackId="a" fill="#FF674F" />
      </BarChart>
    </ResponsiveContainer>
  );}
}
