import { NextResponse } from "next/server";
import { db, collection, addDoc } from "../../../../../firebase";
export  async function POST(req, { params }) {
  
    try {
      console.log(params.Soporte)
      // Extraer los datos del cuerpo de la solicitud
      const [ errorSeleccionado, sistemaOperativo, navegador, rutaError, descripcionProblema,fechaTicket ] = params.Soporte;

      // Validar los datos si es necesario
      console.log(errorSeleccionado, " ", sistemaOperativo, " ", navegador, " ", rutaError, " ", descripcionProblema, fechaTicket)
      // Guardar los datos en la base de datos
      const docRef = await addDoc(collection(db, 'Tickets'), {
        errorSeleccionado,
        sistemaOperativo,
        navegador,
        rutaError,
        descripcionProblema,
        timestamp: new Date()
      });

      // Enviar una respuesta de éxito
      return NextResponse.json(docRef)
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      res.status(500).json({ message: 'Error al enviar el formulario' });
    }
  
 
}
