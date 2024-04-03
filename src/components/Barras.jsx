"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';



export default function Barras  ({ data, width, height, reportes })  {
  const svgRef = useRef();
console.log(reportes)
  useEffect(() => {
 



    if (!data || !data.length) return;

    const svg = d3.select(svgRef.current);
    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i)) // Los índices del array como dominio
      .range([0, width]) // Rango de los valores en x

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)]) // Rango de los valores en y
      .range([height, 0]);

    // Agregamos los rectángulos
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d))
      .attr("fill", "steelblue");
    
    // Agregamos los ejes
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));
  }, [data, height, width]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}


