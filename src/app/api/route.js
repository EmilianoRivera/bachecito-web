import { NextResponse } from "next/server";
import {  db, collection, getDocs} from "../../../firebase.js";

export async function GET(request) {
  try {
    // Obtener la colección de reportes desde Firebase
    const usuariosRef = collection(db, 'usuarios')

    // Obtener todos los documentos de la colección
    const usuariosSnapshot = await getDocs(usuariosRef);

    // Crear un array para almacenar los reportes
    const usuarios = [];

    // Iterar sobre cada documento de reporte
    usuariosSnapshot.forEach((doc) => {
      // Obtener los datos del reporte
      const usuario = doc.data();
      // Agregar el usuarios al array
      usuarios.push(usuario);
    });

    // Devolver los usuarios en la respuesta
    return NextResponse.json(usuarios);
  } catch (error) {
    // Manejar errores
    console.error("Error al obtener usuarios:", error);
    return NextResponse.error("Error al obtener usuarios", { status: 500 });
  }
}
