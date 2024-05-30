import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where, auth, addDoc } from "../../../../../firebase";
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
    const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
    const admin = userCredential.user;
    sendEmailVerification(admin);
    const uid = admin.uid;
    const usuariosCollection = collection(db, "usuarios");
    console.log(username, " ", appat, " ", apmat, " ", fechaNacimiento, " ", correo, " ", password)
    const nuevoUsuario = {
      uid: uid,
      nombre: username,
      apellidoPaterno: appat,
      apellidoMaterno: apmat,
      fechaNacimiento: fechaNacimiento,
      correo: correo,
      estadoCuenta: true,
      rol:"admin"
    };
    addDoc(usuariosCollection, nuevoUsuario);


    return NextResponse.json("Exito al crear cuenta");
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    return NextResponse.error("Error con el server para crear la cuenta", { status: 500 });
  }
}
