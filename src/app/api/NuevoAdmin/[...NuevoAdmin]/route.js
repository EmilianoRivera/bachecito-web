import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where, auth, addDoc } from "../../../../../firebase";
import { desc } from "@/scripts/Cifrado/Cifrar";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail, getAuth
  } from "firebase/auth";
export async function POST(request, {params}) {
  try {
    const [username, appat, apmat, fechaNacimiento, correo, password ] = params.NuevoAdmin

    const user = decodeURIComponent(username)
    const nombreUsuario = desc(user)

    const apellidoPat = decodeURIComponent(appat)
    const apellidoP = desc(apellidoPat)

    const apellidoMat = decodeURIComponent(apmat)
    const apellidoM = desc(apellidoMat)

    const fechaN = decodeURIComponent(fechaNacimiento)
    const fechaNac = desc(fechaN)

    const email = decodeURIComponent(correo) 
    const corr = desc(email)

    const pass = decodeURIComponent(password)
    const contrasena = desc(pass)

    const userCredential = await createUserWithEmailAndPassword(auth, corr, contrasena);

    const admin = userCredential.user;

    sendEmailVerification(admin);
    
    const uid = admin.uid;
    
    const usuariosCollection = collection(db, "usuarios");


    const nuevoUsuario = {
      uid: uid,
      nombre: nombreUsuario,
      apellidoPaterno: apellidoP,
      apellidoMaterno: apellidoM,
      fechaNacimiento: fechaNac,
      correo: corr,
      estadoCuenta: true,
      //password: password,
      rol:"admin",
      fechaCreacion: new Date(),
    };
    addDoc(usuariosCollection, nuevoUsuario);


    return NextResponse.json("Exito al crear cuenta");
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    return NextResponse.error("Error con el server para crear la cuenta", { status: 500 });
  }
}
