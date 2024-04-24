import { db, collection, query, where, getDocs, auth } from "../../../../../firebase";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  try {
    const uid = params.uid
    console.log(uid)
    const userQuery = query(
      collection(db, "reportes"), where("uidUsuario", "==", uid)
    );
    
    const userDocs = await getDocs(userQuery);
    const fetchedReportes = [];
    userDocs.forEach((doc) => {
      fetchedReportes.push({
        id: doc.id,
        ...doc.data(),
      });
    }); 
    return NextResponse.json(fetchedReportes);
  } catch (error) {
    
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
 