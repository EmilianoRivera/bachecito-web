import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../firebase";
import { getDoc } from "firebase/firestore";

export async function GET(request, {params}) {
  try {
    const estado = params.estado;
    const refCol = collection(db, "reportes")
    const reportes = await getDocs(refCol)
    let sinAtender = 0;
    let enAtencion = 0;
    let atendido = 0;

    reportes.forEach((doc) => {
      const reporte = doc.data();
       
    });
    return NextResponse.json({ estado });
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
