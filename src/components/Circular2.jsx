import React, { useEffect, useState } from "react";
import * as d3 from "d3";
function PieChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Convertir los datos en un array de objetos con etiqueta y valor
    const formattedData = Object.entries(data).map(([label, value]) => ({
      label,
      value,
    }));
    setChartData(formattedData);
  }, [data]);

  useEffect(() => {
    // Crear la gráfica de anillo
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.5; // Definir el radio interior

    // Definir el esquema de colores personalizado
    const color = d3.scaleOrdinal()
      .domain(chartData.map(d => d.label))
      .range(["#FF5136", "#FFC63D", "#A4DF77"]); // Naranja, Verde, Rojo

    const svg = d3.select("#pie-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc()
      .innerRadius(innerRadius) // Usar el radio interior
      .outerRadius(radius); // Usar el radio exterior

    const pie = d3.pie()
      .value(d => d.value);

    const arcs = svg.selectAll("arc")
      .data(pie(chartData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label));

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text(d => `${d.data.label}: ${d3.format(".1%")(d.data.value / d3.sum(chartData, d => d.value))}`);
  }, [chartData]);

  return <div id="pie-chart"></div>;
}



function CRep() {
  const [totalRep, setTotalRep] = useState(0);
  const [repEstado, setRepEstado] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const reportesTot = await fetch("/api/reportesTotales");
        const reportesEst = await fetch("/api/reportesEstado");

        if (!reportesTot.ok && !reportesEst.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await reportesTot.json();
        const data2 = await reportesEst.json();

        setTotalRep(data);
        setRepEstado(data2);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="totalReportes">
      <div className="encabezado">
        <h1>REPORTES TOTALES:</h1>
        <div className="contador">{totalRep}</div>
      </div>
      <div className="estados">
        <div className="in-red">
          <div className="red"><span className="tooltip">Sin atender</span></div>
          <div className="cont-reportes">{repEstado.sinAtender}</div>
        </div>
        <div className="in-yellow">
          <div className="yellow"><span className="tooltip">En atención</span></div>
          <div className="cont-reportes">{repEstado.enAtencion}</div>
        </div>
        <div className="in-green">
          <div className="green"><span className="tooltip">Atendido</span></div>
          <div className="cont-reportes">{repEstado.atendido}</div>
        </div>
      </div>
      <PieChart data={repEstado} />
    </div>
  );
}

export default CRep;
