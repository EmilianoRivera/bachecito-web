import { NextResponse } from "next/server";
import { db, collection, getDocs } from "../../../../firebase";
import { enc } from "@/scripts/Cifrado/Cifrar";
export async function GET(request) {
  try {
    const reportesRef = collection(db, 'reportes')
    const reportesSnapshot = await getDocs(reportesRef);
 /*    const reportes = []; */
    let cont = 0
    reportesSnapshot.forEach((doc) => {
/*       const reporte = doc.data();
      console.log(reporte) */
      cont += 1;
     /*  reportes.push(reporte); */
    });

    const con = enc(cont)

    return NextResponse.json(con);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
