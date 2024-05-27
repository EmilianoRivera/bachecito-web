import { NextResponse } from "next/server";
import { db, collection, addDoc } from "../../../../../firebase";
export async function POST(request, { params }) {
  try {
    const [uidUsuario, nombre, apellidoPaterno, url, descripcion, ubicacion] =
      params.MandarR;
    console.log(
      uidUsuario,
      " ",
      nombre,
      " ",
      apellidoPaterno,
      " ",
      imagenURL,
      " ",
      ubicacion,
      " ",
      descripcion
    );
    const imagenURL = decodeURIComponent(url);

    const folio = "002-5";

    const docRef = await addDoc(collection(db, "reportes"), {
      apellidoPaterno,
      contador: 5,
      descripcion,
      eliminado: false,
      estado: "Sin atender",
      fechaReporte: "22/5/2024",
      folio,
      imagenURL,
      nombre,
      ubicacion,
      uidUsuario,
    });

    /*

apellidoPaterno
contador,
descripcion
eliminado
estado
fechaReporte
folio
imagenURL
nombre
ubicacion
uidUsuario

*/
    return NextResponse.json(docRef);
  } catch (error) {
    console.error("Hubo un error en la api");
    return NextResponse.error(new Error("Hubo un error en la api"));
  }
}
