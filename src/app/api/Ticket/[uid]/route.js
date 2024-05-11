import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where} from "../../../../../firebase";

export async function GET(request, {params}) {
  try {
    const uid = params.uid
    const res = await fetch(`http://localhost:3001/api/EnviarTicket/${uid}`)
    if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const tickets = await res.json();
      console.log("first")
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    return NextResponse.error("Error al obtener tickets", { status: 500 });
  }
}