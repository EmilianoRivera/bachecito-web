import { NextResponse } from "next/server";
import { desc, enc } from "../../../../scripts/Cifrado/Cifrar";

import { db2, collection, getDocs, query, where} from "../../../../../firebase";

export async function GET(request, {params}) {
  try {
    const id = decodeURIComponent(params.uid)
    const uid = desc(id)
    const ticketsRef = collection(db2, 'tickets')
    const q = query(ticketsRef,  where("uid", "==", uid));
    const ticketsSnapshot = await getDocs(q);
    
    const tickets = [];
    
    ticketsSnapshot.forEach((doc) => {
      const ticket = doc.data();
      const ticketEncrypted = enc(ticket)
      console.log("-----------",ticketEncrypted)
      tickets.push(ticketEncrypted);
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    return NextResponse.error("Error al obtener tickets", { status: 500 });
  }
}


/* import { NextResponse } from "next/server";
import { db2, collection, getDocs, query, where} from "../../../../../firebase";

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
} */