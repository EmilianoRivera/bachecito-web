import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where, auth, addDoc } from "../../../../../firebase";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail, getAuth
  } from "firebase/auth";
import { desc } from "@/scripts/Cifrado/Cifrar";

function formatearFecha(fecha) {
  const partesFecha = fecha.split("-"); 
  const dia = partesFecha[2];
  const mes = partesFecha[1];
  const año = partesFecha[0];
  return `${dia}-${mes}-${año}`;
}
export async function POST(request, {params}) {
  try {
    const [nombre, appat, apmat, fechaNacimiento, email, password ] = params.RegistroU
    const name = decodeURIComponent(nombre)
    const aP = decodeURIComponent(appat)
    const aM = decodeURIComponent(apmat)
    const fN = decodeURIComponent(fechaNacimiento)
    const correo = decodeURIComponent(email)
    const contra = decodeURIComponent(password)

    const nom = desc(name)
    const apellidoP = desc(aP)
    const apellidoM = desc(aM)
    const fechaN = desc(fN)
    const corr = desc(correo)
    const pass = desc(contra)

    const fechaNFormateada = formatearFecha(fechaN)


    const userCredential = await createUserWithEmailAndPassword(auth, corr, pass);

    const user = userCredential.user;

    sendEmailVerification(user);

     const uid = user.uid;
    const usuariosCollection = collection(db, "usuarios");

    const nuevoUsuario = {
      uid: uid,
      nombre: nom,
      apellidoPaterno: apellidoP,
      apellidoMaterno: apellidoM,
      fechaNacimiento: fechaNFormateada,
      correo: corr.toLowerCase(),
      rol:"usuario",
      estadoCuenta: true,
      fechaCreacion: new Date(),
      incidencias:0,
      numRep:0,
      inhabilitada: false
 
    };
    addDoc(usuariosCollection, nuevoUsuario);


    return NextResponse.json("Exito al crear cuenta");
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    return NextResponse.error("Error con el server para crear la cuenta", { status: 500 });
  }
}
