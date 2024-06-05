import { enc, desc } from "@/scripts/Cifrado/Cifrar";
import { db, collection, query, where, getDocs, auth } from "../../../../../firebase";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  try {
    const id = params.uid
    const Uid = decodeURIComponent(id)
    const UId = desc(Uid)
    const userQuery = query(
      collection(db, "reportes"), where("uid", "==", UId), where("eliminado", "==", false)
    );
    
    const userDocs = await getDocs(userQuery);
    const fetchedReportes = [];
    userDocs.forEach((doc) => {
     
      fetchedReportes.push(enc({
        id: doc.id,
        ...doc.data(),
      }));
    }); 
    return NextResponse.json(fetchedReportes);
  } catch (error) {
    
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
 