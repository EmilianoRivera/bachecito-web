import { NextResponse } from "next/server";
import { db, collection, addDoc } from "../../../../../firebase";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extraer los datos del cuerpo de la solicitud
      const { errorSeleccionado, sistemaOperativo, navegador, rutaError, descripcionProblema } = req.body;

      // Validar los datos si es necesario

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
      res.status(200).json({ message: 'Formulario enviado con éxito', docRefId: docRef.id });
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      res.status(500).json({ message: 'Error al enviar el formulario' });
    }
  } else {
    // Método de solicitud no permitido
    res.status(405).end();
  }
}
