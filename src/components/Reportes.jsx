"use client";
import { useEffect, useState } from "react";
import "../app/Reportes/Reportes.css";
import React from "react";
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
      <div className="box2" id="box2">
        {rep.map((report) => (
          <div key={report.id} className="columnm-left">
            <div className="fotografía">
              <img src={report.rep_imagenURL} alt="" /> {/*Ahorita, en la bd, no puse imagenes como tal, solo puro texto, entonces, si quieres hacer pruebas, solo seria poner una URL, y ya ir ajustando la imagen */}
            </div>

            <div className="column-left-inferior">
              <div className="fecha">{report.rep_fechaReporte}</div>{/*Igual, hay que arreglar este en el formato, porque lo regresa con año y hora: 2024-12-02 06:00:00.000 ese es el formato, y pues, solo queremos el año */}

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

            <div className="column-right">
              <div className="column-right-superior">
                <div className="estado">{report.edo_id}</div> {/* Falta arreglar este un poco, porque solo obtiene el id del estado, no el valor del estado */}
                <div className="guardar">
                  <img
                    src="https://i.postimg.cc/52PmmT4T/estrella.png"
                    className="icon-star"
                  />
                </div>
              </div>

              <div className="ubicacion">
                <h3>Ubicación: {report.rep_ubicacion}</h3>
                <div className="box-ubi"></div>
              </div>

              <div className="descripcion">
                <h3>Descripción {report.rep_descripcion}</h3>
                <div className="box-des"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
