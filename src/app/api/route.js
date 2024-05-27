import { NextResponse } from "next/server";
import {  db, collection, getDocs} from "../../../firebase.js";

export async function GET(request) {
  try {
    const usuariosRef = collection(db, 'usuarios')

    const usuariosSnapshot = await getDocs(usuariosRef);

    const usuarios = [];

    usuariosSnapshot.forEach((doc) => {
      const usuario = doc.data();
      usuarios.push(usuario);
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.error("Error al obtener usuarios", { status: 500 });
  }
}
