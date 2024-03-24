import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET( request) {
    const usuarios =await  prisma.nombre_Usuario.findMany()

    console.log(usuarios) 
    return NextResponse.json(usuarios)
}

/* 
export async function POST( request) {
    const {uid} = await request.json()
    console.log(uid)

    const nuevoNombreUsuario = await prisma.nombre_Usuario.create({
        data: {
            nomu_fb_uid: uid,
            
        }
    })
    return NextResponse.json(nuevoNombreUsuario)
}
 */




/*export async function POST(request) {

    try {
        const insertarDatosAlcaldia = await prisma.estado_reporte.createMany({
            data: [
                {alc_id: 2, alc_nombre: "Azcapotzalco"},
                {alc_id: 3, alc_nombre: "Coyoacán"},
                {alc_id: 4, alc_nombre: "Cuajimalpa de Morelos"},
                {alc_id: 5, alc_nombre: "Gustavo A. Madero"},
                {alc_id: 6, alc_nombre: "Iztacalco"},
                {alc_id: 7, alc_nombre: "Iztapalapa"},
                {alc_id: 8, alc_nombre: "La Magdalena Contreras"},
                {alc_id: 9, alc_nombre: "Milpa Alta"},
                {alc_id: 10, alc_nombre: "Álvaro Obregón"},
                {alc_id: 11, alc_nombre: "Tláhuac"},
                {alc_id: 12, alc_nombre: "Tlalpan"},
                {alc_id: 13, alc_nombre: "Xochimilco"},
                {alc_id: 14, alc_nombre: "Benito Juárez"},
                {alc_id: 15, alc_nombre: "Cuauhtémoc"},
                {alc_id: 16, alc_nombre: "Miguel Hidalgo"},
                {alc_id: 17, alc_nombre: "Venustiano Carranza"},
            ]
        })
        return  NextResponse.json(insertarDatosAlcaldia)

    } catch (error) {
        console.log(error.code)
        console.log(error.message)

    }

}

*/