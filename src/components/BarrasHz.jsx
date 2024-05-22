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
moment.locale('es'); // Establecer el idioma a español

const alcaldias = [
  "Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán",
  "Cuajimalpa de Morelos", "Cuauhtémoc", "Gustavo A. Madero", "Iztacalco",
  "Iztapalapa", "La Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta",
  "Tlalpan", "Tláhuac", "Venustiano Carranza", "Xochimilco"
];

export default function BarrasHz({
  width,
  height,
  estados,
  startDates,
  endDates,
  filtroFechas,
}) {
  const [alcEstRep, setAlcEstRep] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/EstadoRAlcaldia"); 
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        setAlcEstRep(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
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
  
  if (!alcEstRep) {
    return <div>Cargando datos...</div>; // Mensaje de carga
  }
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        width={width}
        height={height}
        data={transformData(alcEstRep)}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="alcaldia" type="category" />
        <Tooltip />
        <Bar dataKey="atendido" stackId="a" fill="#52c41a" />
        <Bar dataKey="enAtencion" stackId="a" fill="#faad14" />
        <Bar dataKey="sinAtender" stackId="a" fill="#f5222d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
