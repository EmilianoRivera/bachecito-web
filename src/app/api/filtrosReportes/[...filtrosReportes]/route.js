import { NextResponse } from "next/server";

export async function POST(request, {params}) {
  try {
    console.log(params)
    //const [estado, alcaldia, fechaFiltro, startDate, endDate] = params.filtrosReportes;

    return NextResponse.json(params);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
