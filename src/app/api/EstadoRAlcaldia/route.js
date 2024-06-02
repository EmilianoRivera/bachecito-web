import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../firebase";
import { enc } from "@/scripts/Cifrado/Cifrar"; // Asegúrate de que la ruta sea correcta

export async function GET(request) {
  try {
    const reportesRef = collection(db, "reportes");
    const reportesSnapshot = await getDocs(reportesRef);
    const datos = {};

    const estadoMapping = {
      "Sin atender": "sinAtender",
      "En atención": "enAtencion",
      Atendido: "atendido",
    };

    reportesSnapshot.forEach((doc) => {
      const reporte = doc.data();
      const ubicacion = reporte.ubicacion;

      const alcaldiasEnUbicacion = obtenerAlcaldiasEnUbicacion(ubicacion);

      if (alcaldiasEnUbicacion && alcaldiasEnUbicacion.length > 0) {
        alcaldiasEnUbicacion.forEach((alcaldia) => {
          if (!datos[alcaldia]) {
            datos[alcaldia] = {
              sinAtender: 0,
              enAtencion: 0,
              atendido: 0,
            };
          }

          const estadoNormalizado = estadoMapping[reporte.estado];
          if (estadoNormalizado) {
            datos[alcaldia][estadoNormalizado]++;
          }
        });
      }
    });

    // Cifrar los datos
    const cifradoDatos = enc(datos);

    console.log(cifradoDatos);

    return NextResponse.json({cifrado: cifradoDatos});
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}

function obtenerAlcaldiasEnUbicacion(ubicacion) {
  const regexAlcaldiasCDMX =
    /(Azcapotzalco|Coyoacán|Cuajimalpa de Morelos|Gustavo A. Madero|Iztacalco|Iztapalapa|Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tláhuac|Tlalpan|Venustiano Carranza|Xochimilco)/gi;

  return ubicacion.match(regexAlcaldiasCDMX);
}
