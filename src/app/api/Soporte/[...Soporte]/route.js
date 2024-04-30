import { NextResponse } from "next/server";
import { db, collection, addDoc, getDocs } from "../../../../../firebase";

async function folioTicket(errorSeleccionado, rutaError) {
  const refTickets = collection(db, "tickets");
  const ticketsSnapShot = await getDocs(refTickets);
  ticketsSnapShot.forEach((doc) => {
    const tickets = doc.data();
    console.log(tickets);
  });
  console.log(errorSeleccionado, " ", rutaError);
  const fol = `${errorSeleccionado}-${rutaError}`;
  console.log(fol);
}

function prioridad(errorSeleccionado) {
  let priori = "";
  switch (errorSeleccionado) {
    case "S001" || "S002" || "0000":
      priori = "PRIORIDAD ALTA";
      break;
    case "D001" ||
      "D002" ||
      "M001" ||
      "M002" ||
      "R001" ||
      "R002" ||
      "R003" ||
      "P001" ||
      "P002" ||
      "T001":
      priori = "PRIORIDAD MEDIA";
      break;
  }
}

export async function POST(req, { params }) {
  try {
    console.log(params.Soporte);

    // Extraer los datos del cuerpo de la solicitud

    const [
      errorSeleccionado,
      sistemaOperativo,
      navegador,
      rutaError,
      descripcionProblema,
      url,
    ] = params.Soporte;
    const rutitaD = decodeURIComponent(rutaError);
    const urlsitaD = decodeURIComponent(url);
    // Validar los datos si es necesario
    console.log(
      errorSeleccionado,
      " ",
      sistemaOperativo,
      " ",
      navegador,
      " ",
      rutitaD,
      " ",
      descripcionProblema,
      " ",
      urlsitaD
    );
    // Guardar los datos en la base de datos

    const folio = folioTicket(errorSeleccionado, rutaError);
    const priori = prioridad(errorSeleccionado);

    /* const docRef = await addDoc(collection(db, 'tickets'), {
        folio,
        priori,
        errorSeleccionado,
        sistemaOperativo,
        navegador,
        rutitaD,
        descripcionProblema,
        timestamp: new Date(),
        urlsitaD,
      }); */

    // Enviar una respuesta de éxito
    return NextResponse.json(/* docRef */ "s");
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
