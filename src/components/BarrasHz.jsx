import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function BarrasHz({ width, height }) {
  const svgRef = useRef();

  useEffect(() => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 20 },
      { name: "C", value: 30 },
      { name: "D", value: 40 },
      { name: "E", value: 50 },
    ];
    
    if (!data || !data.length) return;

    const svg = d3.select(svgRef.current);

    // Escalas
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]) // Dominio de los valores
      .range([0, width]); // Rango del ancho

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.name)) // Dominio de las categorías
      .range([0, height]) // Rango de la altura
      .padding(0.1); // Espaciado entre las barras

    // Define una escala de colores personalizada
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range([
        "#FF8A57",
        "#FFB54E",
        "#FFE75F",
        "#D3FF7A",
        "#90F49B",
      ]);

    // Barras
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => yScale(d.name))
      .attr("width", d => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.name));

    // Etiquetas
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => `${d.name}: ${d.value}`)
      .attr("x", d => xScale(d.value) + 5)
      .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "black");

    // Ejes
    svg.append("g")
      .call(d3.axisLeft(yScale));
    
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
  }, [height, width]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}
