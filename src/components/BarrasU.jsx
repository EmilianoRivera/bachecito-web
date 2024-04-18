"use client"
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function Circular({ width, height, estados }) {
  //AQUI ESTAN LOS ESTADOS Y EL HOOK DE USEREF, QUE HACE REFERENCIA AL ELEMENTO SVG QUE ESTA EN EL HTML
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [rep, setRep] = useState([]);
  const [totalRep, setTotalRep] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [alcEstRep, setAlcEstRep] = useState();

  const color = d3.scaleOrdinal()
    .domain(rep.map(d => d.label))
    .range(["#FF8A57", "#FFB54E", "#FFE75F", "#D3FF7A", "#90F49B", "#2EC4B6", "#49C3FB", "#65A6FA", "#5D9DD5", "#65A6FA", "#49C3FB", "#2EC4B6", "#90F49B", "#D3FF7A", "#FFE75F", "#FFB54E"]);
  //SE ENCARGA DE HACER LAS PETICIONES A LOS ENDPOINTS PARA TRAER LA INFORMACIÓN QUE SE VA A GRAFICAR, EN EL SVG ES DONDE SE PINTAN LAS GRAFICAS
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/g1"); //G1 ES GRAFICA 1 , OSEA LA CIRCULAR
        const totalRep = await fetch("/api/reportesTotales"); // TRAE EL NUMERO DE REPORTES TOTALES QUE SE HICIERON
        const estadoReporteAlcaldia = await fetch("/api/EstadoRAlcaldia"); //TRAE POR ALCALDIA EL NUMERO DE REPORTES QUE ESTA EN ESTADO: SIN ATENDER, EN ATENCION Y ATENDIDO
        if (!response.ok || !totalRep.ok || !estadoReporteAlcaldia.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const data2 = await totalRep.json();
        const data3 = await estadoReporteAlcaldia.json();
        // Convertir el objeto en un array de objetos
        const dataArray = Object.entries(data).map(([label, value]) => ({
          label,
          value,
        }));

        setRep(dataArray);
        setTotalRep(data2);
        setAlcEstRep(data3);
      
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);
  //FUNCION QUE SE ENCARGA DE ACTUALIZAR LA GRAFICA CON BASE AL ESTADO
  function nuevaGraficaCircular(alcEstRep) {

    console.log("LLEGO")
  }
  //HOOK QUE SE ENCARGA DE CREAR LA GRAFICA CON BASE AL PORCETAJE QUE HAY DE REPORTES POR ALCALDIA, ESTA APARECE PRIMERO, SI HAY UN CAMBIA DE ESTADO YA APARECE LA GRAFICA DE LA FUNCION nuevaGraficaCircular
  useEffect(() => {
    if (estados === "sin estado") {
      const svg = d3.select(svgRef.current);
      const margin = { top: 20, right: 20, bottom: 30, left: 30 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
  
      const xScale = d3
        .scaleBand()
        .domain(rep.map((d) => d.label))
        .range([0, innerWidth])
        .padding(0.1);
  
      const maxYValue = d3.max(rep, (d) => d.value);
      const roundedMaxYValue = Math.ceil(maxYValue); // Redondea hacia arriba el valor máximo
  
      const yScale = d3
        .scaleLinear()
        .domain([0, roundedMaxYValue]) // Ajusta el dominio para que vaya de 0 al valor máximo redondeado hacia arriba
        .range([innerHeight, 0]);
  
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      g.selectAll("rect")
        .data(rep)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.label))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => innerHeight - yScale(d.value))
        .attr("fill", (d) => color(d.label));
  
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  
      g.append("g").call(d3.axisLeft(yScale).ticks(roundedMaxYValue)); // Utiliza ticks igual al valor máximo redondeado
  
      // Texto del eje y
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
  
    } else {
      console.log("NUEVA GRAFICA");
    }
  }, [rep, height, width]);
  
  
  

  //ESTE USEEFFECT SE ENCARGA DE OCULTAR LOS ELEMENTOS, Y REVISAR QUE SI CAMBIA ALGO EN EL FILTRO DEL ESTADO, SE EJECUTE LA FUNCION QUE CAMBIA LA GRAFICA
  useEffect(() => {
    if (!selectedSegment) {
      d3.select(tooltipRef.current).style("visibility", "hidden");
    } else  {
      d3.select(tooltipRef.current).style("visibility", "visible");
      d3.select(tooltipRef.current)
        .select(".tooltip-label")
        .style("font-family", "Helvetica, sans-serif")
        .text(selectedSegment.data.label.toUpperCase());
      const percentage = (
        ((selectedSegment.endAngle - selectedSegment.startAngle) /
          (2 * Math.PI)) *
        100
      ).toFixed(2);
      d3.select(tooltipRef.current)
        .select(".tooltip-value")
        .text(`${percentage}%`);
    } 
  }, [selectedSegment]);

  return (
    <div style={{ position: "relative", width, height }}>
      <svg ref={svgRef} width={width} height={height}></svg>
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        <div className="tooltip-label"></div>
        <div className="tooltip-value"></div>
      </div>
    </div>
  );
}