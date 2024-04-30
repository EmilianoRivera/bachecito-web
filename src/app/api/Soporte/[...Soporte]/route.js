import { NextResponse } from "next/server";
import { db, collection, addDoc, getDocs } from "../../../../../firebase";
const nodemailer = require("nodemailer");
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

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,

  auth: {
    user: 'somos.gemma.01@gmail.com',
    pass: 'rje3vw$x4hGVhcw$h8eeukGSh5$C6@o6W5NH'
  }
});
async function enviarCorreo(destinatario, folio) {
  try {
    // Configura el contenido del correo electrónico
    const mailOptions = {
      from: 'somos.gemma.01@gmail.com',
      to: destinatario,
      subject: 'Confirmación de recepción de ticket',
      text: `Se ha recibido su ticket con el folio: 1.`
    };

    // Envía el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
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

    const docRef = await addDoc(collection(db, 'tickets'), {
        folio,
        priori,
        errorSeleccionado,
        sistemaOperativo,
        navegador,
        rutitaD,
        descripcionProblema,
        timestamp: new Date(),
        urlsitaD,
      }); 
      await enviarCorreo('melyssagabrielag@gmail.com', folio);
    // Enviar una respuesta de éxito
    return NextResponse.json(/* docRef */ "s");
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
