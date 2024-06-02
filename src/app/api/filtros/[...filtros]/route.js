import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "../../../../../firebase";
import {
  buscarAlcaldias,
  obtenerFechaActual,
  formatearFecha,
  parsearDeStringADate,
  formatearFechaDateAstring,
  extraerAnioDesdeString,
  getInicioSemana,
  getFinSemana,
  obtenerMesDesdeFecha,
  obtenerAñoDesdeFecha,
} from "../../../../scripts/funcionesFiltro";

import {
  fechaFiltroFormateada,
  fechaFiltroFormateadaEspecifico,fechaFiltroEGAlcaldias,fechaFiltroEGEstados
} from "../../../../scripts/handleFiltros";

import { enc, desc } from "@/scripts/Cifrado/Cifrar";

async function filtroGeneral(
  fechaFiltro,
  fechaActual,
  estado,
  alcaldia,
  startDate,
  endDate
) {
/*   console.log(
    "DEL GENERAL",
    "fechaFiltro: ", fechaFiltro, 
    "endDate: ", endDate,
    "startDate: ", startDate, 
    "ESTADO: ", estado, 
    "Alcaldia: ", alcaldia,
  ) */
  let elementosFiltrados = [];


  if (alcaldia === "Todas" && fechaFiltro === "Todos los tiempos") {
    const filtroGeneralAlcaldiaFechaQuery = query(
      collection(db, "reportes"),
      where("estado", "==", estado)
    );

    const reportesAlcaldiaFecha = await getDocs(
      filtroGeneralAlcaldiaFechaQuery
    );

    reportesAlcaldiaFecha.forEach((doc) => {
      const reporte= doc.data()
      const cif = enc(reporte)
      elementosFiltrados.push(cif);
    });
  } else if (alcaldia === "Todas" && estado === "Todos") {
    const formateoFechaFiltro = await fechaFiltroFormateada(
      fechaFiltro,
      fechaActual,
      startDate,
      endDate
    );
    return formateoFechaFiltro
  } else if (fechaFiltro === "Todos los tiempos" && estado === "Todos") {
    const refDoc = collection(db, "reportes");
    const reportesAlcaldiaFecha = await getDocs(refDoc);
    reportesAlcaldiaFecha.forEach((doc) => {
      const reporte = doc.data();
      //obtener alcaldia
      const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
      if (alcaldia === alcaldiaDelReporte) {
        const cif = enc(reporte)
        elementosFiltrados.push(cif);
      }
    });
  } else if (fechaFiltro === "Todos los tiempos") {
    const refDoc = collection(db, "reportes");
    const queries = query(refDoc, where("estado", "==", estado));
    const reportesGenerales = await getDocs(queries);
    reportesGenerales.forEach((doc) => {
      const reporte = doc.data()
      const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
      if (alcaldia === alcaldiaDelReporte) {
        const reporte= doc.data()
        const cif = enc(reporte)
        elementosFiltrados.push(cif);
      }
    });
  } else if (alcaldia === "Todas") {
    //obtener ubicacion
    const fechaFiltroAlcaldias = await fechaFiltroEGAlcaldias(
      fechaFiltro,
      fechaActual,
      startDate,
      endDate,
      estado,
    );
    return fechaFiltroAlcaldias
  } else if (estado === "Todos") {
    //obtener ubicacion
    const fechaFiltroEstados = await fechaFiltroEGEstados(
      fechaFiltro,
      fechaActual,
      startDate,
      endDate,
      alcaldia
    );
    return fechaFiltroEstados
  }
  return elementosFiltrados;
}


async function filtroEspecifico(
  fechaFiltro,
        fechaActual,
        estado,
        alcaldia,
        startDate,
        endDate
) {
/*  console.log("ESPEIFICO",fechaFiltro, " ", fechaActual, " ", estado, " ", alcaldia, " ", startDate," ", endDate )
console.log(new Date(startDate), " ", new Date(endDate)) */
  let filtroEspecifico = [];
  const formateoFechaFiltroEspecifico = await fechaFiltroFormateadaEspecifico(
    fechaFiltro,
        fechaActual,
        estado,
        alcaldia,
        startDate,
        endDate
  );
  return formateoFechaFiltroEspecifico;
}

//Funcion que recibe y envia la petición
export async function POST(request, { params }) {
  try {
    const [estado,alcaldia,fechaFiltro,startDate,endDate] = params.filtros; 

 // console.log("DEL POST",estado, " ", endDate, " ", fechaFiltro, " ", alcaldia, " ", startDate)
    const fechaActual = obtenerFechaActual();
    if (estado ==="Todos" && alcaldia === "Todas" && fechaFiltro === "Todos los tiempos") {
      const refRep = collection(db, "reportes")
      const getReportes = await getDocs(refRep)
      let reportes = []
      getReportes.forEach((doc) => {
        const rep = doc.data()
        const repEnc = enc(rep)
        reportes.push(repEnc)
      })
      return NextResponse.json(reportes)
    }  else if (
      estado === "Todos" ||
      alcaldia === "Todas" ||
      fechaFiltro === "Todos los tiempos"
    ) {
      let arr = []
      const filtradoGeneral = await filtroGeneral(
        fechaFiltro,
        fechaActual,
        estado,
        alcaldia,
        startDate,
        endDate
      );
/*       const filtradoGEncrypt = enc(filtradoGeneral)
      arr.push(filtradoGEncrypt) */
  //    console.log(filtradoGeneral.length)
      return NextResponse.json(filtradoGeneral);
    } 
    else {
      let arr = []
      const filtradoEspecifico = await filtroEspecifico(
        fechaFiltro,
        fechaActual,
        estado,
        alcaldia,
        startDate,
        endDate
      );
     // console.log(filtradoEspecifico.length)
/*       const filtroEEncrypt = enc(filtradoEspecifico)
      arr.push(filtroEEncrypt) */
      return NextResponse.json(filtradoEspecifico);
    }
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
