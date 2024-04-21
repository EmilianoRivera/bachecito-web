"use client";
import { useEffect, useState } from "react";
import "../app/Reportes/Reportes.css";
import React from "react";
import atendidoIcon from '../imgs/fondoVerde.png';
import enProcesoIcon from '../imgs/fondoAmarillo.png';
import sinAtenderIcon from '../imgs/fondoRojo.png';
import Image from "next/image"
function ReportesComponente() {
  const [rep, setRep] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/Reportes");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRep(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);

  return (
      
    <div className="reportes-boxes">
    {rep.map((report, index) => (
      <div className="box2" id="box2" key={index}>
        <div className="prueba">
          <div className="columnm-left">
            <div className="fotografía">
              <Image src={report.imagenURL} alt={""} style={{ maxWidth: '100%', maxHeight: '100%' }}/>
            </div>

            <div className="column-left-inferior">
              <div className="fecha">{report.fechaReporte}</div>

              <div className="contador">
                <div className="icon">
                  <Image
                    src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                    className="logo"
                  />
                </div>
                <div className="number"></div>
              </div>
            </div>

            
          </div>
          <div className="column-right">
              <div className="column-right-superior">
                <div className="estado">  {report.estado === "Sin atender" && (
    <Image src={sinAtenderIcon.src} alt={"Sin atender"}   style={{ width: "100%", height: "100%", borderRadius: "5vh" }} />
  )}
  {report.estado === "En atención" && (
    <Image src={enProcesoIcon.src} alt={"En atención"}   style={{ width: "100%", height: "100%", borderRadius: "5vh" }}/>
  )}
  {report.estado === "Atendido" && (
    <Image src={atendidoIcon.src} alt={"Atendido"}  style={{ width: "100%", height: "100%", borderRadius: "5vh" }} />
  )}</div>
                <div className="guardar">
                  <Image
                    src="https://i.postimg.cc/52PmmT4T/estrella.png"
                    className="icon-star"
                  />
                </div>
              </div>

              <div className="ubicacion">
                <h3>Ubicación: </h3>
                <div className="box-ubi">{report.ubicacion}</div>
              </div>

              <div className="descripcion">
                <h3>Descripción: </h3>
                <div className="box-des">{report.descripcion}</div>
              </div>
          </div>
        </div>
          
      </div>
        ))}
    </div>
    
  );
}

export default ReportesComponente;


/*
"use client";
import { useEffect, useState } from "react";
import "../app/Reportes/Reportes.css";
import React from "react";

{report.rep_imagenURL}
<div className="reportes-boxes">
      <div className="box2" id="box2">
        {rep.map(report => {
          <div className="column-left">
          <div className="fotografía">
            <img src="" alt="" />
          </div>
          <div className="column-left-inferior">
            <div className="fecha"> {report.fe}</div>

            <div className="contador">
              <div className="icon">
                <img
                  src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                  className="logo"
                />
              </div>
              <div className="number"></div>
            </div>
          </div>
        </div>

        <div className="column-right">
          <div className="column-right-superior">
            <div className="estado"></div>

            <div className="guardar">
              <img
                src="https://i.postimg.cc/52PmmT4T/estrella.png"
                className="icon-star"
              />
            </div>
          </div>

          <div className="ubicacion">
            <h3>Ubicación</h3>
            <div className="box-ubi"></div>
          </div>

          <div className="descripcion">
            <h3>Descripción {report.rep_descripcion}</h3>
            <div className="box-des"></div>
          </div>
        </div>
        })
        
        
        }
      </div>
    </div> */
