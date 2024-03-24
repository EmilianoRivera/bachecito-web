import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET( request) {
    const reportes =await  prisma.reportes.findMany()

    console.log(reportes) 
    return NextResponse.json(reportes)
}