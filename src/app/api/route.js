import { NextResponse } from "next/server";
import {  db, collection} from "../../../firebase";

export async function GET(request) {
  try {
    // Obtener la colección de usuarios desde Firebase
    const reportesSnapshot = await db.collection("Reportes").get();

    // Crear un array para almacenar los usuarios
    const reportes = [];

    // Iterar sobre cada documento de usuario
    reportesSnapshot.forEach((doc) => {
      // Obtener los datos del usuario
      const usuario = doc.data();
      // Agregar el usuario al array
      reportes.push(usuario);
    });

    // Devolver los reportes en la respuesta
    return NextResponse.json(reportes);
  } catch (error) {
    // Manejar errores
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
