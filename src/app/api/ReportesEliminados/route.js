import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "../../../../firebase";

export async function GET(request) {
  try {
    const reportesRef = collection(db, 'reportes')
    const q = query(reportesRef, where("eliminado", "==", true));
    const reportesSnapshot = await getDocs(q);

    const reportes = [];

    reportesSnapshot.forEach((doc) => {
      const reporte = doc.data();
      reportes.push(reporte);
    });

    return NextResponse.json(reportes);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
