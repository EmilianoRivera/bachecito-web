import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function Barras({ width, height }) {
  const svgRef = useRef();
  const [data, setData] = useState([1, 2, 3, 4]); // Datos de ejemplo, reemplaza esto con tus datos reales

  useEffect(() => {
    async function fetchData() {
      try {
        // Aquí es donde deberías realizar tu lógica para obtener los datos de la API
        // Por ahora, usaremos datos de ejemplo
        // const response = await fetch("/api/g2");
        // const data = await response.json();
        const data = [5, 10, 15, 20]; // Datos de ejemplo
        setData(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3.select(svgRef.current);

    // Escala para el eje x (escala de bandas para las semanas)
    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i)) // Usamos los índices como dominio para representar las semanas
      .range([0, width])
      .padding(0.1); // Espacio entre las barras

    // Escala para el eje y (escala lineal)
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) // Dominio de los datos
      .nice() // Ajusta el dominio para que los números sean redondeados
      .range([height, 0]);

    // Limpia el área de representación
    svg.selectAll("*").remove();

    // Agregamos los rectángulos
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d))
      .attr("fill", "steelblue");

    // Agregamos los ejes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale).ticks(6)); // Mostramos solo 6 ticks en el eje y
  }, [data, height, width]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}
