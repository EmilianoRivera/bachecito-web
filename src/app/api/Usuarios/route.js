import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "../../../../firebase";
import { enc } from "@/scripts/Cifrado/Cifrar";
export async function GET(request) {
  try {
    const usuariosRef = collection(db, 'usuarios')
    const q = query(usuariosRef);
    const usuariosSnapshot = await getDocs(q);

    const usuarios = [];

   usuariosSnapshot.forEach((doc) => {
      const usu = doc.data();
      const usuEnc = enc(usu)
      usuarios.push(usuEnc);
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener users:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
