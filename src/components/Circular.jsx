"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Circular ({ data, width, height }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3.select(svgRef.current);
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    arcs.append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text(d => d.data);

  }, [data, height, width]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

 
