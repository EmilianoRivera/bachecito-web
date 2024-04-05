import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function Circular({ width, height, estado }) {
  //AQUI ESTAN LOS ESTADOS Y EL HOOK DE USEREF, QUE HACE REFERENCIA AL ELEMENTO SVG QUE ESTA EN EL HTML
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [rep, setRep] = useState([]);
  const [totalRep, setTotalRep] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [alcEstRep, setAlcEstRep] = useState();

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
        console.log(data3);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);
  //FUNCION QUE SE ENCARGA DE ACTUALIZAR LA GRAFICA CON BASE AL ESTADO
  function nuevaGraficaCircular(alcEstRep) {

    
  }
  //HOOK QUE SE ENCARGA DE CREAR LA GRAFICA CON BASE AL PORCETAJE QUE HAY DE REPORTES POR ALCALDIA, ESTA APARECE PRIMERO, SI HAY UN CAMBIA DE ESTADO YA APARECE LA GRAFICA DE LA FUNCION nuevaGraficaCircular
  useEffect(() => {
    if (!rep || !rep.length) return;
    else if (estado === "sin estado") {
      const svg = d3.select(svgRef.current);
      const radius = Math.min(width, height) / 2;
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3.pie().value((d) => d.value);

      const arc = d3.arc().innerRadius(50).outerRadius(radius);

      const arcs = svg
        .selectAll("arc")
        .data(pie(rep))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      arcs
        .append("path")
        .attr("fill", (d, i) => color(i))
        .attr("d", arc)
        .on("mouseover", (event, d) => {
          setSelectedSegment(d);
        })
        .on("mouseout", () => {
          setSelectedSegment(null);
        });

      arcs
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-family", "Helvetica, sans-serif")
        .text((d) => d.data.label.toUpperCase());

      // Agregar el porcentaje fijo debajo de cada alcaldía
      arcs
        .append("text")
        .attr("transform", (d) => {
          const centroid = arc.centroid(d);
          const x = centroid[0];
          const y = centroid[1] + 20; // Ajusta la posición vertical del porcentaje fijo
          return `translate(${x}, ${y})`;
        })
        .attr("text-anchor", "middle")
        .attr("dy", "1em") // Ajusta la distancia vertical del texto
        .text(
          (d) =>
            `${(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100).toFixed(
              2
            )}%`
        );

      const tooltip = d3.select(tooltipRef.current);
      tooltip.style("visibility", "hidden");
    }
  }, [rep, height, width]);

  //ESTE USEEFFECT SE ENCARGA DE OCULTAR LOS ELEMENTOS, Y REVISAR QUE SI CAMBIA ALGO EN EL FILTRO DEL ESTADO, SE EJECUTE LA FUNCION QUE CAMBIA LA GRAFICA
  useEffect(() => {
    if (!selectedSegment) {
      d3.select(tooltipRef.current).style("visibility", "hidden");
    } else if (estado === "sin estado") {
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
    } else {
      console.log("NUEVA DATAA", alcEstRep);
      nuevaGraficaCircular(alcEstRep);
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
