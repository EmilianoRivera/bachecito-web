import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../../firebase";

export async function POST(request, { params }) {
  try {
    const [result] = params.circu;
    const contAlcaldias = {};
    let alcaldiasEnReporte;
    if (result !== null) {
      result.forEach((obj) => {
        if (obj.ubicacion) {
          alcaldiasEnReporte = buscarAlcaldias(obj.ubicacion);
        }

        Object.keys(alcaldiasEnReporte).forEach((alcaldia) => {
          contAlcaldias[alcaldia] =
            (contAlcaldias[alcaldia] || 0) + alcaldiasEnReporte[alcaldia];
        });
      });

      return NextResponse.json(contAlcaldias);
    }
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}

function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX =
    /(Álvaro Obregón|Azcapotzalco|Benito Juárez|Coyoacán|Cuajimalpa de Morelos|Cuauhtémoc|Gustavo A. Madero|Iztacalco|Iztapalapa|La Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tlalpan|Tláhuac|Venustiano Carranza|Xochimilco)/gi;
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
