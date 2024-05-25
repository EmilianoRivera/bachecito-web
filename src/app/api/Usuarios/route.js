import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "../../../../firebase";

export async function GET(request) {
  try {
    const usuariosRef = collection(db, 'usuarios')
    const q = query(usuariosRef);
    const usuariosSnapshot = await getDocs(q);

    const usuarios = [];

   usuariosSnapshot.forEach((doc) => {
      const usu = doc.data();
      usuarios.push(usu);
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener users:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
