import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function Barras({ width, height }) {
  const svgRef = useRef();
  const [dataAlcaldia, setAlcaldiaReporte] = useState([]);
  const [totalReporte, setTotalReportes] = useState(0);
  const [semanas, setSemanas] = useState(0);
  const [fechaMayor, setfechaMayor] = useState();
  const [fechaMenor, setfechaMenor] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/g2");
        const totalReportesResponse = await fetch("/api/reportesTotales");

        if (!response.ok || !totalReportesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const { contAlcaldias, fechaMenor, fechaMayor, semanas } =
          await response.json();
        const totalReportes = await totalReportesResponse.json();

        const dataArray = Object.entries(contAlcaldias).map(
          ([alcaldia, reportes]) => ({
            alcaldia,
            reportes,
          })
        );

        dataArray.sort((a, b) => a.alcaldia.localeCompare(b.alcaldia));

        setAlcaldiaReporte(dataArray);
        setTotalReportes(totalReportes);
        setSemanas(semanas);
        setfechaMayor(fechaMayor);
        setfechaMenor(fechaMenor);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);
/* 
  console.log("SEMANAS", semanas);
  console.log("fechas", fechaMayor, " ", fechaMenor);
  console.log(dataAlcaldia);
  console.log("TOTAL DE REPORTES", totalReporte);
   */
  useEffect(() => {
  const data = [1, 2, 3, 4];

    if (!data || !data.length) return;

    const svg = d3.select(svgRef.current);
    const xScale = d3
      .scaleBand()
      .domain(data.map((d, i) => i)) // Los índices del array como dominio
      .range([0, width]); // Rango de los valores en x

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) // Rango de los valores en y
      .range([height, 0]);

    // Agregamos los rectángulos
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d))
      .attr("fill", "steelblue");

    // Agregamos los ejes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));
  }, [data, height, width]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}
