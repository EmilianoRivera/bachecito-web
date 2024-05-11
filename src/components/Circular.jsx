"use client";
import React, { useEffect, useRef, useState } from "react";
import { db, collection, getDocs, query, where,  } from "../../firebase";
import * as d3 from "d3";

export default function Circular({
  width,
  height,
  estados,
  alcaldias,
  startDates,
  endDates,
  filtroFechas,
}) {
  //AQUI ESTAN LOS ESTADOS Y EL HOOK DE USEREF, QUE HACE REFERENCIA AL ELEMENTO SVG QUE ESTA EN EL HTML
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [rep, setRep] = useState([]); //guarda los reportes totales por alcaldia
  
  const [contAlcaldias, setContAlcaldias] = useState([])
  //const [totalRep, setTotalRep] = useState(0);
  const [reportesCategorizados, setReportesCategorizados] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [alcEstRep, setAlcEstRep] = useState(); //este guardar por alcaldia, la cantidad de reportes que tienen x estado

  const color = d3
    .scaleOrdinal()
    .domain(rep.map((d) => d.label))
    .range([
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
    ]);
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
        // setTotalRep(data2);
        setAlcEstRep(data3);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
    
  }, []);
  function buscarAlcaldias(ubicacion) {
    const regexAlcaldiasCDMX = /(Azcapotzalco|Coyoacán|Cuajimalpa de Morelos|Gustavo A. Madero|Iztacalco|Iztapalapa|Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tláhuac|Tlalpan|Venustiano Carranza|Xochimilco)/gi;
    const contAlcaldias = {};
    console.log(ubicacion)
    const alcaldiasEnUbicacion = ubicacion.match(regexAlcaldiasCDMX);
    
    if (alcaldiasEnUbicacion) {
      alcaldiasEnUbicacion.forEach(alcaldia => {
        const alcaldiaLower = alcaldia.toLowerCase();
        contAlcaldias[alcaldiaLower] = (contAlcaldias[alcaldiaLower] || 0) + 1;
      });
    }
  
    return contAlcaldias;
  }
  
 
  //ESTE USEEFFECT SE ENCARGA DE OCULTAR LOS ELEMENTOS, Y REVISAR QUE SI CAMBIA ALGO EN EL FILTRO DEL ESTADO, SE EJECUTE LA FUNCION QUE CAMBIA LA GRAFICA
  useEffect(() => {
    if (!selectedSegment) {
      d3.select(tooltipRef.current).style("visibility", "hidden");
    } else {
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

  graficaCircular()
function  nuevaGrafica () {
  const svg = d3.select(svgRef.current);
      const radius = Math.min(width, height) / 2;
      
 
      const pie = d3.pie().value((d) => d.value);

      const arc = d3.arc().innerRadius(50).outerRadius(radius);

      const arcs = svg
        .selectAll("arc")
        .data(pie(contAlcaldias))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      arcs
        .append("path")
        .attr("fill", (d) => color(d.data.label))
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
 
  function graficaCircular(estado = estados, alcaldia=alcaldias, filtroFecha=filtroFechas, startDate=startDates, endDate=endDates) {
      const svg = d3.select(svgRef.current);
      const radius = Math.min(width, height) / 2;
      if (estados === "Todos" && alcaldia === "Todas" && filtroFechas === "Todos los tiempos") {
   
 
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
        .attr("fill", (d) => color(d.data.label))
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

    } else {
 
        const nombreAlcaldia = alcaldia.replace(/^[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+|[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+$/g, "");
        async function fetchFiltroEstado() {
          try {
            const parametros = {
              estado: estado,
              alcaldia: alcaldia,
              filtroFecha: filtroFecha,
              startDate: startDate,
              endDate: endDate
            };
            // Realizar la solicitud POST con el objeto de parámetros en el cuerpo
            const datosNuevos = await fetch(`/api/filtros/${estado}/${nombreAlcaldia}/${filtroFecha}/${startDate}/${endDate}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json' // Indicar que el cuerpo es JSON
              },
              body: JSON.stringify(parametros) // Convertir el objeto a JSON
            });
            if (!datosNuevos.ok) {
              throw new Error("Fallaron los filtros");
            }
            const resultadoFiltros = await datosNuevos.json();
            let ubicacion = ""
            const contAlcaldiasFiltradas = {};
            //ACA HAY QUE METER UNA VALIDACION DE SI EL resultadoFiltros es null o no devuelve nada
            console.log(resultadoFiltros)
            resultadoFiltros.forEach((doc) => {
              console.log("ESTE ES DOC",doc)
              console.log("ESTE ES DOC",typeof doc)
              if (Array.isArray(doc)) {
                doc.forEach(item => {
                    ubicacion = item.ubicacion;
                });
              } else if (typeof doc === 'object') {
                  ubicacion = doc.ubicacion;
              } else {
                console.error('El tipo de dato de doc no es compatible.');
              }
              const alcaldiasEnReporte = buscarAlcaldias(ubicacion);
              
              // Incrementar el contador para cada alcaldía encontrada en este reporte
              Object.keys(alcaldiasEnReporte).forEach((alcaldia) => {
                contAlcaldiasFiltradas[alcaldia] = (contAlcaldiasFiltradas[alcaldia] || 0) + alcaldiasEnReporte[alcaldia];
              });
            }); 
            console.log("SIII",contAlcaldiasFiltradas)
            return contAlcaldiasFiltradas;
          } catch (error) {
            console.error("Error a la hora de hacer la petición ", error);
            return null
          }
        }

        fetchFiltroEstado();
        
      }
 
    }

  return (
    <div style={{ position: "relative", width, height, color:"white", }}>
      <svg ref={svgRef} width={width} height={height} style={{color:"white"}}></svg>
      <div
        ref={tooltipRef}
        className="tooltip-grcir"
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        <div className="tooltip-label"></div>
        <div className="tooltip-value"></div>
      </div>
    </div>
  );
}

