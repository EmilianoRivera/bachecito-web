import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
export async function POST(req, {params}) {
  try {
  const [ to, subject, text ] = params.sendEmail;
  console.log(params.sendEmail)  
  // Configura el transportador de nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER, // Tu correo
      pass:process.env.NEXT_PUBLIC_EMAIL_PASS, // Tu contraseña
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
console.log("correo a enviar: ",to, " ", subject, " ", text)
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  
    await transporter.sendMail(mailOptions);
   return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return  NextResponse.json({ message: "Failed to send email" });
  }
}
