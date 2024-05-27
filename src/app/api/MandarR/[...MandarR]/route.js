import { NextResponse } from "next/server";
import { db, collection, addDoc } from "../../../../../firebase";
export async function POST(request, { params }) {
  try {
    const [uidUsuario, nombre, apellidoPaterno, url, descripcion, ubicacion] =
      params.MandarR;
      const imagenURL = decodeURIComponent(url);
 /*
 AUTOMATIZAR FOLIO, FECHA, Y CONTADOR */
    const folio = "002-6";
    const contador = 4
    const fechaReporte  = "27/5/2024"
    const docRef = await addDoc(collection(db, "reportes"), {
      apellidoPaterno,
      contador: contador,
      descripcion,
      eliminado: false,
      estado: "Sin atender",
      fechaReporte: fechaReporte,
      folio,
      imagenURL,
      nombre,
      ubicacion,
      uidUsuario,
    });
  
    return NextResponse.json("ESTATUS 200");
  } catch (error) {
    console.error("Hubo un error en la api");
    return NextResponse.error(new Error("Hubo un error en la api"));
  }
}
