import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../firebase";

export async function GET(request) {
  try {
    // Obtener la colección de reportes desde Firebase
    const reportesRef = collection(db, 'reportes')

    // Obtener todos los documentos de la colección
    const reportesSnapshot = await getDocs(reportesRef);

    // Crear un array para almacenar los reportes
    const reportes = [];

    // Iterar sobre cada documento de reporte
    reportesSnapshot.forEach((doc) => {
      // Obtener los datos del reporte
      const reporte = doc.data();
      // Agregar el reporte al array
      reportes.push(reporte);
    });

    // Devolver los reportes en la respuesta
    return NextResponse.json(reportes);
  } catch (error) {
    // Manejar errores
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
