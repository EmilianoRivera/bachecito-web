import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "../../../../../firebase";
import { getDoc } from "firebase/firestore";
function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX =
    /(Azcapotzalco|Coyoacán|Cuajimalpa de Morelos|Gustavo A. Madero|Iztacalco|Iztapalapa|Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tláhuac|Tlalpan|Venustiano Carranza|Xochimilco)/gi;
  const contAlcaldias = {};

  const alcaldiasEnUbicacion = ubicacion.match(regexAlcaldiasCDMX);

  if (alcaldiasEnUbicacion) {
    alcaldiasEnUbicacion.forEach((alcaldia) => {
      const alcaldiaLower = alcaldia.toLowerCase();
      contAlcaldias[alcaldiaLower] = (contAlcaldias[alcaldiaLower] || 0) + 1;
    });
  }

  return contAlcaldias;
}

function obtenerFechaActual() {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Se agrega 1 porque los meses van de 0 a 11
  const año = fechaActual.getFullYear();

  // Formatear la fecha en el formato deseado (por ejemplo, dd/mm/yyyy)
  const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}/${
    mes < 10 ? "0" : ""
  }${mes}/${año}`;

  return fechaFormateada;
}
function formatearFecha(fecha) {
  const partesFecha = fecha.split("/"); // Dividir la fecha en partes por el separador '/'
  const dia = partesFecha[0];
  const mes = partesFecha[1];
  const año = partesFecha[2];

  // Formatear la fecha en el formato deseado (por ejemplo, dd/mm/yyyy)
  return `${dia}/${parseInt(mes)}/${año}`;
} 

async function fechaFiltroFormateada(fechaFiltro, fechaFormateada) {
  let fechaReporteFiltrado;
  switch(fechaFiltro) {
    case "Hoy":
      const filtroFechaHoy = query(
        collection(db, "reportes"),
        where("fechaReporte", "==", fechaFormateada)
      );
      
      const reportesFechaHoy = await getDocs(
        filtroFechaHoy
      );
      reportesFechaHoy.forEach((doc) => {
        console.log(doc.data().fechaReporte) 
      });

      break;
    
    case "Esta semana":
      break;
    
    case "Último mes":
      break;
    
    case "Últimos 6 meses":
      break;
    
    case "Este año":
      break;
    
    case "Rango personalizado":
      break;
    
  }
  return fechaReporteFiltrado;
}



async function filtroGeneral(
  fechaFiltro = "Todos los tiempos",
  fechaActual,
  estado = "Todos",
  alcaldia = "Todas"
) {
  let elementosFiltrados = [];
  let reportesPorAlcaldia = {}; // Definir reportesPorAlcaldia fuera del switch
  let estados;
  let alcaldias;
  const fechaFormateada = formatearFecha(fechaActual);
  if (alcaldia === "Todas" && fechaFiltro === "Todos los tiempos") {
    const filtroGeneralAlcaldiaFechaQuery = query(
      collection(db, "reportes"),
      where("estado", "==", estado)
    );

    const reportesAlcaldiaFecha = await getDocs(
      filtroGeneralAlcaldiaFechaQuery
    );
    reportesAlcaldiaFecha.forEach((doc) => {
      console.log(doc.data());
    });
  } else if (alcaldia === "Todas" && estado === "Todos") {
    /*AQUI ES CUANDO LOS FILTROS DE ALCALDIA Y ESTADO SON TODOS, POR LO QUE LA GRAFICA TENDRA QUE MOSTRAR 
    EL NUMERO DE REPORTES POR ALCALDIA QUE ENTRAN EN ESE RANGO DE FECHA
    POR LO QUE PRIMERO, TENGO QUE DIVIDIR TODOS LOS REPORTES POR ALCALDIA Y LUEGO VER FILTRAR POR FECHA
    O DE TODOS VER CUALES ENTRAN EN FECHA Y LUEGO DIVIDIRLO POR ALCALDIA
    POR LO QUE VOY A DESARROLLAR LA SEGUNDA OPCIÓN
    */

    const formateoFechaFiltro = fechaFiltroFormateada(fechaFiltro, fechaFormateada)
  

  } else if (fechaFiltro==="Todos los tiempos" && estado === "Todos") {
    //obtener ubicacion
     
  }

  return reportesPorAlcaldia;
}

async function filtroEspecifico(fechaFiltro, fechaActual, estado, alcaldia) {
  switch (fechaFiltro) {
    case "Todos los tiempos":
      const queryFechaHoy = query(
        collection(db, "reportes"),
        where("fechaReporte", "==", fechaFormateada)
      );
      const reportes = await getDocs(queryFechaHoy);
      if (!reportes.empty) {
        const userData = reportes.docs[0].data();
        console.log(userData);
      }
      console.log("first");
      break;

    case "Esta semana":
      break;

    case "Este mes":
      break;

    case "Últimos 6 meses":
      break;

    case "Este año":
      break;

    default:
      //aqui el caso de hoy
      break;
  }
}

export async function POST(request, { params }) {
  try {
    const [estado, alcaldia, fechaFiltro, startDate, endDate] = params.filtros; // Desestructura el array filtros en 5 variables
    console.log(estado, " ", alcaldia, " ", fechaFiltro)
    //llamada a funciones
    const fechaActual = obtenerFechaActual();
    if (
      estado === "Todos" ||
      alcaldia === "Todas" ||
      fechaFiltro === "Todos los tiempos"
    ) {
      const filtradoGeneral = filtroGeneral(
        fechaFiltro,
        fechaActual,
        estado,
        alcaldia
      );
      return NextResponse.json(filtradoGeneral);
    } else {
      /* const filtradoEspecifico = filtroEspecifico(
        fechaFiltro,
        fechaActual,
        estado,
        alcaldia
      );
      return NextResponse.json(filtradoEspecifico); */
    }
    /* 
    const reportesRef = collection(db, "reportes");
    const reportesSnapshot = await getDocs(reportesRef);

    let cont = 0;
    reportesSnapshot.forEach((doc) => {
      //const reporte = doc.data();
      cont += 1;
      //reportes.push(reporte);
    });

    return NextResponse.json(cont); */
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
