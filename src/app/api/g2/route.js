/* import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../firebase";

export async function GET(request) {
  try {
    const reportesRef = collection(db, 'reportes');
    const reportesSnapshot = await getDocs(reportesRef);

    let contAlcaldias = {};
    let fechas = [];

    reportesSnapshot.forEach((doc) => {
      const reporte = doc.data();
      const alcaldiasEnReporte = buscarAlcaldias(reporte.ubicacion);
      const fechaReporte = reporte.fechaReporte;
      fechas.push(new Date(fechaReporte)); // Convertir a objetos Date

      // Incrementar el contador para cada alcaldía encontrada en este reporte
      Object.keys(alcaldiasEnReporte).forEach((alcaldia) => {
        contAlcaldias[alcaldia] = (contAlcaldias[alcaldia] || 0) + alcaldiasEnReporte[alcaldia];
      });
    }); 

    // Ordenar las fechas de forma ascendente
    fechas.sort((a, b) => a - b);

    // Encontrar la fecha mayor y menor
    const fechaMenor = fechas[0];
    const fechaMayor = fechas[fechas.length - 1];

    // Calcular la cantidad de semanas entre las fechas
    const diferenciaTiempo = fechaMayor.getTime() - fechaMenor.getTime();
    const semanas = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24 * 7));

    return NextResponse.json({
      contAlcaldias,
      fechaMenor: fechaMenor.toISOString(),
      fechaMayor: fechaMayor.toISOString(),
      semanas
    });
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
 */