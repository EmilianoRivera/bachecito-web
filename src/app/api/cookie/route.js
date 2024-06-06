import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function GET(req) {
  cookies().set({
    name: 'b068931cc450442b63f5b3d276ea4297',
    value: 'true',
    httpOnly: true,
    path: '/',
  })


  return NextResponse.json({ message: "Ok" }, { status: 200 });
}


export async function DELETE(){
  cookies().delete("b068931cc450442b63f5b3d276ea4297")

  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
