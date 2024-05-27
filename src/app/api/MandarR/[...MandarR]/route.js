import { NextResponse } from "next/server";
import {obtenerFechaActual, formatearFecha} from "../../../../scripts/funcionesFiltro"
import { db, collection, addDoc, query,doc, getDocs, } from "../../../../../firebase";

import { getDoc } from "firebase/firestore";
// Función para obtener el folio por alcaldía
   const obtenerFolioPorDireccion = async (direccion) => {
    try {
      // Obtener la referencia a la colección de alcaldías
      const alcaldiasRef = doc(db, 'alcaldia', 'NFEUuhTpDlLA0ycwqNPm');
      const alcaldiasSnap = await getDoc(alcaldiasRef);
  
      // Verificar si la colección de alcaldías existe
      if (alcaldiasSnap.exists()) {
        const alcaldiasData = alcaldiasSnap.data();
        let alcaldiaEncontrada = null;
        let folioAlcaldiaEncontrada = null;
  
        // Iterar sobre las alcaldías para encontrar la coincidencia con la dirección
        for (const [alcaldia, folio] of Object.entries(alcaldiasData)) {
          if (direccion.includes(alcaldia)) {
            alcaldiaEncontrada = alcaldia;
            folioAlcaldiaEncontrada = folio;
            break; // Una vez encontrada la alcaldía, salir del bucle
          }
        }
  console.log("ALCALDIA ENCONTRADA",folioAlcaldiaEncontrada)
        // Verificar si se encontró la alcaldía
        if (alcaldiaEncontrada) {
          // Consultar todos los reportes
          const reportesQuery = query(collection(db, 'reportes'));
          const reportesSnap = await getDocs(reportesQuery);
          
          // Almacenar todos los reportes en una variable
          const reportes = reportesSnap.docs.map(doc => doc.data());
          
          // Filtrar los reportes que pertenecen a la misma alcaldía que la dirección proporcionada
          const reportesEnAlcaldia = reportes.filter(reporte => reporte.ubicacion.includes(alcaldiaEncontrada));
          // Calcular el número de reportes para esta alcaldía
          const cantidadReportes = reportesEnAlcaldia.length;
          console.log(folioAlcaldiaEncontrada)
          // Construir el folio con el formato adecuado (ejemplo: "002-4")
          return `${folioAlcaldiaEncontrada}-${cantidadReportes + 1}`;

        } else {
          console.log('La dirección no coincide con ninguna alcaldía.');
          return null;
        }
      } else {
        console.log('El documento de alcaldías no existe.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el folio:', error);
      throw error;
    }
  };
export async function POST(request, { params }) {
  try {
    const [uidUsuario, nombre, apellidoPaterno, url, descripcion, ubicacion] =
      params.MandarR;
      const imagenURL = decodeURIComponent(url);
 /*
 AUTOMATIZAR FOLIO,  , Y CONTADOR */
    const folio = await obtenerFolioPorDireccion(ubicacion);
    const contador = 4
    const fechaActual = obtenerFechaActual()
    const fechaReporte = formatearFecha(fechaActual)
 console.log("ESTE ES EL FOLIO: ",folio)



    const docRef = await addDoc(collection(db, "reportes"), {
      apellidoPaterno,
      contador: contador,
      descripcion,
      eliminado: false,
      estado: "Sin atender",
      fechaReporte: fechaReporte,
      folio,
      imagenURL,
      nombre,
      ubicacion,
      uidUsuario,
    });
  
    return NextResponse.json("ESTATUS 200");
  } catch (error) {
    console.error("Hubo un error en la api");
    return NextResponse.error(new Error("Hubo un error en la api"));
  }
}
