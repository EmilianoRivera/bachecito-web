import { NextResponse } from "next/server";
import {
  db2,
  collection,
  addDoc,
  getDocs,
  app2,
} from "../../../../../firebase";
import { desc, enc } from "../../../../scripts/Cifrado/Cifrar";

//import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_SOPORTE_RESEND_API_KEY);

async function folioTicket(errorSeleccionado, rutaError) {
  const refTickets = collection(db2, "tickets");
  const querySnapshot = await getDocs(refTickets);
  let maxNumeroFolio = 0;

  // Recorrer los documentos para encontrar el máximo número de folio del tipo de error seleccionado
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const folio = data.folio;

    // Verificar si el folio coincide con el tipo de error seleccionado y extraer el número de folio
    if (folio.startsWith(errorSeleccionado + "-")) {
      const numeroFolio = parseInt(folio.split("-")[1]);
      if (numeroFolio > maxNumeroFolio) {
        maxNumeroFolio = numeroFolio;
      }
    }
  });

  // Incrementar el número de folio en 1
  const nuevoNumeroFolio = maxNumeroFolio + 1;

  // Construir el nuevo folio
  const nuevoFolio = `${errorSeleccionado}-${nuevoNumeroFolio}`;

  return nuevoFolio;
}

function prioridad(errorSeleccionado) {
  let priori = "";
  switch (errorSeleccionado) {
    case "S001":
    case "S002":
    case "U003":
    case "U004":
    case "0000":
      priori = "ALTA";
      break;
    case "D001":
    case "D002":
    case "M001":
    case "M002":
    case "R001":
    case "R002":
    case "R003":
    case "P001":
    case "P002":
    case "T001":
    case "U001":
    case "U002":
      priori = "MEDIA";
      break;
    default:
      priori = "DESCONOCIDA";
  }
  return priori; // Devuelve el string con la prioridad
}

export async function POST(req, { params }) {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const [
      foto,
      Uid,
      errorSeleccionado,
      sistemaOperativo,
      navegador,
      rutaError,
      descripcionProblema,
      correoA,
      nombre,
      area,
    ] = params.RegistrarTicket;

    const url = foto;
    const rutitaD = decodeURIComponent(rutaError);
    const rutaE = desc(rutitaD);

    const error = decodeURIComponent(errorSeleccionado);
    const errorE = desc(error);

    // Obtener la URL de descarga del archivo
    const folio = await folioTicket(errorE, rutaE);
    const priori = prioridad(errorE);
    const estado = "Sin asignar";

    const id = decodeURIComponent(Uid);
    const uid = desc(id);

    const descProm = decodeURIComponent(descripcionProblema);
    const dP = desc(descProm);

    const email = decodeURIComponent(correoA);
    const corr = desc(email);

    const name = decodeURIComponent(nombre);
    const nom = desc(name);

    const ar = decodeURIComponent(area);
    const areas = desc(ar);
    //console.log(url)

    // Validar los datos si es necesario
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: corr,
      subject: "Confirmación de recepción de ticket",
      html: `Se ha recibido su ticket con el folio: ${folio}.`,
    });
    const docRef = await addDoc(collection(db2, "tickets"), {
      folio,
      uid,
      priori,
      errorE,
      sistemaOperativo,
      navegador,
      rutaE,
      dP, //descripcionProblema
      fechaDeEnvio: new Date(),
      corr, //correo
      nom, //nombre
      areas, //areas
      foto,
      estado,
    });
    // Enviar una respuesta de éxito
    return NextResponse.json("EXITO");
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
