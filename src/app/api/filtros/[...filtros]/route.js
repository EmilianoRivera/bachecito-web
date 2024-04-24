import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../../firebase";
import { getDoc } from "firebase/firestore";

function obtenerFechaActual() {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Se agrega 1 porque los meses van de 0 a 11
  const año = fechaActual.getFullYear();

  // Formatear la fecha en el formato deseado (por ejemplo, dd/mm/yyyy)
  const fechaFormateada = `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${año}`;

  return fechaFormateada;
}

function casosFiltrosFechas(fechaFiltro) {
  switch (fechaFiltro) {
    case fechaFiltro==="Hoy":
      
      reportesFiltrados = reportes.filter((reporte) => {
        const fechaReporte = new Date(reporte.fechaReporte); // Convertir la fecha de string a Date
        const fechaHoy = new Date();
        return fechaReporte.toDateString() === fechaHoy.toDateString();
      });
      break;

    case "Esta semana":
      const primerDiaSemana = new Date(fechaActual);
      primerDiaSemana.setDate(primerDiaSemana.getDate() - primerDiaSemana.getDay()); // Obtener el primer día de la semana
      const ultimoDiaSemana = new Date(fechaActual);
      ultimoDiaSemana.setDate(ultimoDiaSemana.getDate() - ultimoDiaSemana.getDay() + 6); // Obtener el último día de la semana
      reportesFiltrados = reportes.filter((reporte) => {
        const fechaReporte = new Date(reporte.fechaReporte); // Convertir la fecha de string a Date
        return fechaReporte >= primerDiaSemana && fechaReporte <= ultimoDiaSemana;
      });
      break;

    case "Este mes":
      const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1); // Obtener el primer día del mes actual
      const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0); // Obtener el último día del mes actual
      reportesFiltrados = reportes.filter((reporte) => {
        const fechaReporte = new Date(reporte.fechaReporte); // Convertir la fecha de string a Date
        return fechaReporte >= primerDiaMes && fechaReporte <= ultimoDiaMes;
      });
      break;

    case "Últimos 6 meses":
      const fechaInicio6Meses = new Date(fechaActual);
      fechaInicio6Meses.setMonth(fechaInicio6Meses.getMonth() - 6); // Obtener la fecha de hace 6 meses
      reportesFiltrados = reportes.filter((reporte) => {
        const fechaReporte = new Date(reporte.fechaReporte); // Convertir la fecha de string a Date
        return fechaReporte >= fechaInicio6Meses && fechaReporte <= fechaActual;
      });
      break;

    case "Este año":
      const primerDiaAño = new Date(fechaActual.getFullYear(), 0, 1); // Obtener el primer día del año actual
      const ultimoDiaAño = new Date(fechaActual.getFullYear(), 11, 31); // Obtener el último día del año actual
      reportesFiltrados = reportes.filter((reporte) => {
        const fechaReporte = new Date(reporte.fechaReporte); // Convertir la fecha de string a Date
        return fechaReporte >= primerDiaAño && fechaReporte <= ultimoDiaAño;
      });
      break;

    // Otros casos de filtro según lo necesites

    default:
      // En caso de que el filtro no coincida con ninguna opción conocida, devolver todos los reportes
      reportesFiltrados = reportes;
      break;
  }

}


function filtrarReportesPorFecha(fechaFiltro, fechaActual, reportes) {
  let reportesFiltrados = [];
  console.log(fechaActual, " ", fechaActual, " ", reportes)
  reportes.forEach((doc) => {
    const reporte = doc.data()
    console.log(typeof reporte)
    casosFiltrosFechas(reporte, fechaFiltro, fechaActual)

  })
  
  return reportesFiltrados;
}




export async function GET(request, { params }) {
  try {
    const [estado, alcaldia, fechaFiltro, startDate, endDate] = params.filtros; // Desestructura el array filtros en tres variables
    const refCol = collection(db, "reportes");
    const reportes = await getDocs(refCol);
    //llamada a funciones
    const fechaActual = obtenerFechaActual();
    const filtradoPorFecha = filtrarReportesPorFecha(fechaFiltro, fechaActual, reportes)
/* 

    
    console.log(filtradoPorFecha) */
    return NextResponse.json({ estado, alcaldia, fechaFiltro,startDate, endDate }); 

  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}

