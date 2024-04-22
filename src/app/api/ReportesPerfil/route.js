import { db, collection, query, where, getDocs, auth } from "../../../../firebase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userQuery = query(
      collection(db, "usuarios"),
      where("uid", "==", auth.currentUser.uid)
    );
    const userDocs = await getDocs(userQuery);
    const fetchedReportes = [];
    userDocs.forEach((doc) => {
      fetchedReportes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.send(200, fetchedReportes);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.send(500, { error: 'Error interno del servidor' });
  }
}
