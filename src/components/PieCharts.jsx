import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { desc } from '@/scripts/Cifrado/Cifrar';

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

async function fetchData() {
  const baseURL = process.env.NEXT_PUBLIC_RUTA_G;
  const response = await fetch(`${baseURL}`);
  if (!response.ok) {
    throw new Error("Error al traer los datos");
  }
  const datEnc = await response.json();
  const datDesc = desc(datEnc);
  console.log(datDesc);
  return datDesc;
}

export function PieCharts() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAndSetData() {
      try {
        const res = await fetchData();
        
        // Transform the data to a format suitable for individual PieCharts
        const transformedData = Object.keys(res).reduce((acc, key) => {
          acc[key] = [{ name: key, value: res[key] }];
          return acc;
        }, {});

        setData(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAndSetData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Function to calculate positions for each pie chart
  const calculatePosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 200; // Adjust this radius to control the overall circle size
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  // Function to generate random outer radius for each pie chart
  const generateRandomRadius = () => Math.floor(Math.random() * (100 - 50 + 1)) + 50;

  return (
    <div style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto' }}>
      {Object.keys(data).map((key, index) => {
        const position = calculatePosition(index, Object.keys(data).length);
        const randomRadius = generateRandomRadius();

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              transform: `translate(${300 + position.x}px, ${300 + position.y}px)`, // Centering the charts
            }}
          >
            <ResponsiveContainer width={randomRadius * 2} height={randomRadius * 2}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={data[key]}
                  cx="50%"
                  cy="50%"
                  outerRadius={randomRadius}
                  fill={COLORS[index % COLORS.length]}
                  label={false} // Disable labels
                >
                  {data[key].map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, key]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

export default PieCharts;
