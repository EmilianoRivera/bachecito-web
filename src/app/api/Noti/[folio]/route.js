import { NextResponse } from "next/server";

export async function POST(request, {folio}) {
    try {
      // Obtener los datos de la solicitud
      const { ticketFolio } = folio.Noti
      console.log(`Notificación recibida para el ticket ${ticketFolio}`);
  return NextResponse.json("respuest")
    } catch (error) {
      console.error("Error al procesar la notificación:", error);
      return NextResponse.error("Error al procesar la notificación", { status: 500 });
    }
  }
