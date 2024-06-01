import { auth, db, query, collection, where, getDocs } from '../../../../../firebase';
import { desc, enc } from "../../../../scripts/Cifrado/Cifrar";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const E_uid = decodeURIComponent(params.uid);
    const uid = desc(E_uid);

    const userQuery = query(
      collection(db, 'usuarios'),
      where('uid', '==', uid)
    );
    const userDocs = await getDocs(userQuery);
    if (!userDocs.empty) {
      const userData = userDocs.docs[0].data();
      const encryptedUserData = enc(userData);  // Cifrar los datos antes de enviarlos de vuelta
      return NextResponse.json(encryptedUserData);
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.json({ error: "Error al obtener reportes" }, { status: 500 });
  }
}
