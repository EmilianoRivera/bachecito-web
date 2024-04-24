import { auth, db, query, collection, where, getDocs } from '../../../../../firebase';
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  try {
    const uid = params.uid
    console.log(uid)
    const userQuery = query(
      collection(db, 'usuarios'),
      where('uid', '==', uid) // Ajusta esto según cómo envíes el UID desde el cliente
    );
    const userDocs = await getDocs(userQuery);

    if (!userDocs.empty) {
      const userData = userDocs.docs[0].data();
      return NextResponse.json(userData);
    }  
  } catch (error) {
   
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
 