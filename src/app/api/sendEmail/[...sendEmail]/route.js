import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
export async function POST(req, {params}) {
  try {
  const [ to, subject, text, incidenciaNum, nombreUsuario] = params.sendEmail;
  console.log(params.sendEmail)  
  // Configura el transportador de nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "somos.gemma.01@gmail.com", // Tu correo
      pass: "zuhxzlvmsmpxvaib", // Tu contraseña
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
console.log("correo a enviar: ",to, " ", subject, " ", text)
  const mailOptions = {
    from: "somos.gemma.01@gmail.com",
    to: to,
    subject: subject,
    text: `Hola ${nombreUsuario},

${text}

Saludos,
Equipo de Bachecito 26`,
  };

  
    await transporter.sendMail(mailOptions);
   return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return  NextResponse.json({ message: "Failed to send email" });
  }
}