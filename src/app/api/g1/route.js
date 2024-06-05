import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../firebase";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";
export async function GET(request) {
  try {
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
    const encContAlcaldias = enc(contAlcaldias)
 
    return NextResponse.json(encContAlcaldias);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}

function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX = /(Álvaro Obregón|Azcapotzalco|Benito Juárez|Coyoacán|Cuajimalpa de Morelos|Cuauhtémoc|Gustavo A. Madero|Iztacalco|Iztapalapa|La Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tlalpan|Tláhuac|Venustiano Carranza|Xochimilco)/gi;
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
