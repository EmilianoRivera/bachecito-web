import { NextResponse } from "next/server";  
import { db, collection, addDoc, getDocs } from "../../../../../firebase";
import nodemailer from "nodemailer";


async function folioTicket(errorSeleccionado, rutaError) {
 
  const refTickets = collection(db, "tickets");
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
    case "0000":
      priori = "PRIORIDAD ALTA";
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
      priori = "PRIORIDAD MEDIA";
      break;
    default:
      priori = "PRIORIDAD DESCONOCIDA";
  }
  return priori; // Devuelve el string con la prioridad
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,

  auth: {
    user: 'somos.gemma.01@gmail.com',
    pass: ' rje3vw$x4hGVhcw$h8eeukGSh5$C6@o6W5NH'
  }
});

async function enviarCorreo(destinatario, folio) {
  try {
    // Configura el contenido del correo electrónico
    const mailOptions = {
      from: 'somos.gemma.01@gmail.com',
      to: destinatario,
      subject: 'Confirmación de recepción de ticket',
      text: `Se ha recibido su ticket con el folio: ${folio}.`
    };
    console.log("first")
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
      correo,
      nombre,
      url,

    ] = params.Soporte;
    const rutitaD = decodeURIComponent(rutaError);
    const urlsitaD = decodeURIComponent(url);
    const folio = await folioTicket(errorSeleccionado, rutaError);
    const priori = prioridad(errorSeleccionado);
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
      urlsitaD, " ", priori, " ", folio
    ); 

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
        nombre,
        correo,
      });

 
      const response = await enviarCorreo(correo, folio);
      console.log(response)
    // Enviar una respuesta de éxito
    return NextResponse.json(docRef );
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
