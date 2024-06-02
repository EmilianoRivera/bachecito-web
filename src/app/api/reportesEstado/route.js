import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../firebase";
import { enc } from "@/scripts/Cifrado/Cifrar"; // Asegúrate de que la ruta sea correcta

export async function GET(request) {
  try {
    const reportesRef = collection(db, "reportes");
    const reportesSnapshot = await getDocs(reportesRef);
    let sinAtender = 0;
    let enAtencion = 0;
    let atendido = 0;

    reportesSnapshot.forEach((doc) => {
      const reporte = doc.data();
      if (reporte.estado === "Sin atender") {
        sinAtender += 1;
      } else if (reporte.estado === "En atención") {
        enAtencion += 1;
      } else {
        atendido += 1;
      }
    });

    const reportesEstado = {
      sinAtender: sinAtender,
      enAtencion: enAtencion,
      atendido: atendido,
    };

    // Cifrar los datos
    const cifradoDatos = enc(reportesEstado);

    return NextResponse.json({ cifrado: cifradoDatos });
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
