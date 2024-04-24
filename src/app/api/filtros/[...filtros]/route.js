import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../../firebase";
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

  // Asegurarse de que cada parte tenga dos dígitos
  const diaFormateado = dia.padStart(2, "0");
  const mesFormateado = mes.padStart(2, "0");

  // Formatear la fecha en el formato deseado (por ejemplo, dd/mm/yyyy)
  return `${diaFormateado}/${mesFormateado}/${año}`;
}
function filtrarReportesPorFecha(
  fechaFiltro,
  fechaActual,
  reportes,
  estado = "Sin Estado",
  alcaldia = "Todas"
) {
  let elementosFiltrados = [];
  let reportesPorAlcaldia = {}; // Definir reportesPorAlcaldia fuera del switch

  reportes.forEach((doc) => {
    const reporte = doc.data();
    const fechaReporteFormateada = formatearFecha(reporte.fechaReporte);

    switch (fechaFiltro) {
      case "Hoy":
        if (fechaReporteFormateada == fechaActual) {
          console.log("Estos reportes si cumplen: ", fechaReporteFormateada);

          const alcaldiasEnReporte = buscarAlcaldias(reporte.ubicacion);
          Object.keys(alcaldiasEnReporte).forEach((alcaldia) => {
            reportesPorAlcaldia[alcaldia] = (reportesPorAlcaldia[alcaldia] || 0) + alcaldiasEnReporte[alcaldia];
          });
        } else {
          console.log("Estos reportes no cumplen: ", fechaReporteFormateada);
        }
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
        break;
    }
  });

  return reportesPorAlcaldia;
}
export async function GET(request, { params }) {
  try {
    const [estado, alcaldia, fechaFiltro, startDate, endDate] = params.filtros; // Desestructura el array filtros en tres variables
    const refCol = collection(db, "reportes");
    const reportes = await getDocs(refCol);
    //llamada a funciones
    const fechaActual = obtenerFechaActual();
    const filtradoPorFecha = filtrarReportesPorFecha(
      fechaFiltro,
      fechaActual,
      reportes,
      estado,
      alcaldia
    );

    console.log("ES ESTE ?", filtradoPorFecha);
    return NextResponse.json( filtradoPorFecha);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
