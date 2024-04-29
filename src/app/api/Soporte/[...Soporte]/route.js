import { NextResponse } from "next/server";
import { db, collection, addDoc } from "../../../../../firebase";
export  async function POST(req, { params }) {
  
    try {
      console.log(params.Soporte)
      
      // Extraer los datos del cuerpo de la solicitud
      const [ errorSeleccionado, sistemaOperativo, navegador,rutaError, descripcionProblema, url] = params.Soporte;
      const rutitaD= decodeURIComponent(rutaError);
      const urlsitaD= decodeURIComponent(url);
      // Validar los datos si es necesario
      console.log(errorSeleccionado, " ", sistemaOperativo, " ", navegador, " ", rutitaD, " ", descripcionProblema, " ", urlsitaD)
      // Guardar los datos en la base de datos
      const docRef = await addDoc(collection(db, 'tickets'), {
        errorSeleccionado,
        sistemaOperativo,
        navegador,
        rutitaD,
        descripcionProblema,
        timestamp: new Date(),
        urlsitaD,
      });

      // Enviar una respuesta de éxito
      return NextResponse.json(docRef)
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      return NextResponse.error("Error al obtener reportes", { status: 500 });
    }
  
 
}
