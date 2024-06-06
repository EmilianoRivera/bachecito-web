import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function GET(req) {
    cookies().set({
      name: '21232f297a57a5a743894a0e4a801fc3',
      value: 'true',
      httpOnly: true,
      path: '/',
    })

  
  
    return NextResponse.json({ message: "Ok" }, { status: 200 });
  }
  
export async function DELETE(){
    cookies().delete("21232f297a57a5a743894a0e4a801fc3")
  
    return NextResponse.json({ message: "Ok" }, { status: 200 });
  }
  