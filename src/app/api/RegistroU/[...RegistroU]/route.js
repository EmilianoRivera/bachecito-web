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
    const [nombre, appat, apmat, fechaNacimiento, email, password ] = params.RegistroU
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    sendEmailVerification(user);
    const uid = user.uid;
    const usuariosCollection = collection(db, "usuarios");
    const nuevoUsuario = {
      uid: uid,
      nombre: nombre,
      apellidoPaterno: appat,
      apellidoMaterno: apmat,
      fechaNacimiento: fechaNacimiento,
      correo: email,
      estadoCuenta: true,
    };
    addDoc(usuariosCollection, nuevoUsuario);


    return NextResponse.json("Exito al crear cuenta");
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    return NextResponse.error("Error con el server para crear la cuenta", { status: 500 });
  }
}
