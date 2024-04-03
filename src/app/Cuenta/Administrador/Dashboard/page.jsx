import React from 'react';
import "./dash.css"
import Barras from "@/components/Barras";
import Circular from "@/components/Circular";
import BarrasHz from "@/components/BarrasHz";

async function peticion () {
  const res = await fetch("/api/Reportes")
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  const data = await res.json()
  const mapData = data.map(item => { return item.uidUsuario;});
  return mapData
}
const reportes = peticion()
console.log(reportes)

const data = [10,20,30,40, 50]
const datas = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 30 },
  { name: 'D', value: 40 },
  { name: 'E', value: 50 }
];


function Dashboard() {
  return (
    <div className="container-general">
      <div className="filtros">
        <div id="fechas">
    <h4>Rango Fechas</h4>
        </div>
        <div id="alcaldia">
    <h4>Alcaldia</h4>
        </div>
        <div id="estado">
    <h4>Estado</h4>
        </div>
      </div>

      <div className="reportes">
        <div id="reportes-totales">
    <h3>REPORTES TOTALES</h3>
        </div>
        <div id="reportes-no-completos">No Resuleto</div>
        <div id="reportes-en-proceso">En Proceso</div>
        <div id="reportes-reparados">Resuelto</div>
      </div>
      <div className="grafica-circular">
        <h3>ALCALDIAS CON MAS REPORTES</h3>
        <div className="circular">
        <Circular data={data} width={500} height={300}/>
        </div>
      </div>
      <div className="grafica-barras">
      <h3>REPORTES POR ALCALDIA</h3>

      <div className="barras">
        <Barras data = {data} width={500} height={500} reportes= {reportes}/>
      </div>
      </div>
      <div className="grafica-barras-hz">
        <h3>REPORTES SEGÚN SU ESTADO DE ATENCIÓN POR ALCALDIA</h3>
        <BarrasHz data={datas} width={500} height={300}/>

      </div>
    </div>
  )
}

export default Dashboard