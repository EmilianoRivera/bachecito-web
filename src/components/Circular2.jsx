import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Circular2.css"
 
const COLORS = ["#FF5136", "#FFC63D", "#A4DF77"];

function CRep() {
  const [totalRep, setTotalRep] = useState(0);
  const [repEstado, setRepEstado] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const reportesTot = await fetch("/api/reportesTotales");
        const reportesEst = await fetch("/api/reportesEstado");

        if (!reportesTot.ok || !reportesEst.ok) {
          throw new Error("Failed to fetch data");
        }

        const totalData = await reportesTot.json();
        const estadoData = await reportesEst.json();

        setTotalRep(totalData);
        setRepEstado(estadoData);

        const formattedData = Object.entries(estadoData).map(([key, value]) => {
        
          return { name: `${key}  `, value };
        });

        setChartData(formattedData);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='totalReportes'>
      <div className='encabezado'>
        <h1>REPORTES TOTALES:</h1>
        <div className='contador'>{totalRep}</div>
      </div>
      <div className='estados'>
        <div className='in-red'>
          <div className='red'></div>
          <div className='cont-reportes'>{repEstado.sinAtender}</div>
        </div>
        <div className='in-yellow'>
          <div className='yellow'></div>
          <div className='cont-reportes'>{repEstado.enAtencion}</div>
        </div>
        <div className='in-green'>
          <div className='green'></div>
          <div className='cont-reportes'>{repEstado.atendido}</div>
        </div>
      </div>
       <div className="pie-chart-container">
       <PieChart width={400} height={250}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={30}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      </div>
     
    </div>
  );
}

export default CRep;
