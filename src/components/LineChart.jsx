// components/LineChart.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer
} from 'recharts';

async function fetchUsers() {
  const baseURL = process.env.NEXT_PUBLIC_RUTA_US;
  const res = await fetch(`${baseURL}`);
  if (!res.ok) {
    throw new Error('Error al graficar usuarios');
  }

  const data = await res.json();
  return data;
}

function convertFirestoreTimestampToDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return date;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function processData(users) {
  const dateCounts = users.reduce((acc, user) => {
    if (user.fechaCreacion) {
      const date = formatDate(convertFirestoreTimestampToDate(user.fechaCreacion));
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.keys(dateCounts).map((date, index) => {
    // Lógica de colores basada en el índice
    const color =
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
      index % 41 === 0 ? "#FFE75F" : "#000000"; // Default color

    return {
      date,
      count: dateCounts[date],
      color // Agregar color al objeto de datos
    };
  });
}

function LineChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const users = await fetchUsers();
      const processedData = processData(users);
      setData(processedData);
    }
    
    getData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke={data.length > 0 ? data[0].color : "#8884d8"} // Usar el color del primer punto como ejemplo
          activeDot={{ r: 8 }} 
        />
        <Brush />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
