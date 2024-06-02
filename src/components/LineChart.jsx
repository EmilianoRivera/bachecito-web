import React, { useEffect, useState } from 'react';
import { desc } from '@/scripts/Cifrado/Cifrar';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  const dataDesc = data.map(rep => desc(rep));
  return dataDesc;
}

function convertFirestoreTimestampToDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return date;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Los meses están indexados desde cero
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

  return Object.keys(dateCounts).map(date => ({
    date,
    count: dateCounts[date],
  }));
}

function CustomTooltip({ payload, label, active }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #FF8A57' }}>
        <p className="label" style={{ color: '#FF8A57' }}>{`Fecha: ${label}`}</p>
        <p className="intro" style={{ color: '#FF8A57' }}>{`Usuarios: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
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
        <CartesianGrid strokeDasharray="3 3" stroke="#A9A9A9" />
        <XAxis dataKey="date" stroke="#A9A9A9" />
        <YAxis stroke="#A9A9A9" />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#FF8A57" // Color naranja
          strokeWidth={2}
          dot={{ stroke: '#FF8A57', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 8, fill: '#FF8A57' }} 
          animationDuration={500}
        />
        <Brush dataKey="date" stroke="#FF8A57" fill="rgba(255, 138, 87, 0.2)" travellerStroke="#FF8A57" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
