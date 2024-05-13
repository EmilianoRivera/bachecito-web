import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../../firebase";

export async function GET(request, {params}) {
  try {
    console.log("first")
    const [reportesFiltrados] = params.CategorizarRep
    console.log(reportesFiltrados)
    const reportesRef = collection(db, 'reportes');
    const reportesSnapshot = await getDocs(reportesRef);

    let contAlcaldias = {};

    reportesSnapshot.forEach((doc) => {
      const reporte = doc.data();
      const alcaldiasEnReporte = buscarAlcaldias(reporte.ubicacion);

      // Incrementar el contador para cada alcaldía encontrada en este reporte
      Object.keys(alcaldiasEnReporte).forEach((alcaldia) => {
        contAlcaldias[alcaldia] = (contAlcaldias[alcaldia] || 0) + alcaldiasEnReporte[alcaldia];
      });
    }); 

    return NextResponse.json(contAlcaldias);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}

function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX = /(Azcapotzalco|Coyoacán|Cuajimalpa de Morelos|Gustavo A. Madero|Iztacalco|Iztapalapa|Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tláhuac|Tlalpan|Venustiano Carranza|Xochimilco)/gi;
  const contAlcaldias = {};
  
  const alcaldiasEnUbicacion = ubicacion.match(regexAlcaldiasCDMX);
  
  if (alcaldiasEnUbicacion) {
    alcaldiasEnUbicacion.forEach(alcaldia => {
      const alcaldiaLower = alcaldia.toLowerCase();
      contAlcaldias[alcaldiaLower] = (contAlcaldias[alcaldiaLower] || 0) + 1;
    });
  }

  return contAlcaldias;
}
