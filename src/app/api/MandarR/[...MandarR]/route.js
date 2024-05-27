import { NextResponse } from "next/server";
import {obtenerFechaActual, formatearFecha} from "../../../../scripts/funcionesFiltro"
import { db, collection, addDoc, query,doc, getDocs, writeBatch, where } from "../../../../../firebase";

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

  const contadorFunc = async (direccion) => {
    try {
  
    
      // Consultar todos los reportes que tienen la misma ubicación que la dirección proporcionada
      const reportesQuery = query(collection(db, 'reportes'), where("ubicacion", "==", direccion));
      const reportesSnap = await getDocs(reportesQuery);
      
      // Calcular el número actual de reportes en esa ubicación
      const cantidadReportes = reportesSnap.docs.length;
  
      // Actualizar el contador en todos los reportes con la misma dirección
      const batch = writeBatch(db);
      reportesSnap.forEach((doc) => {
        const reporte = doc.data();
        const nuevoContador = reporte.contador + 1;
        batch.update(doc.ref, { contador: nuevoContador });
      });
      await batch.commit();
   return cantidadReportes
  
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
     
    }
  }

export async function POST(request, { params }) {
  try {
    const [uidUsuario, nombre, apellidoPaterno, url, descripcion, ubicacion] =
      params.MandarR;
      const imagenURL = decodeURIComponent(url);
 /*
 AUTOMATIZAR FOLIO,  , Y CONTADOR */
    const folio = await obtenerFolioPorDireccion(ubicacion);
    const cantidadReportes =await contadorFunc(ubicacion)
    const fechaActual = obtenerFechaActual()
    const fechaReporte = formatearFecha(fechaActual)    
    const docRef = await addDoc(collection(db, "reportes"), {
      apellidoPaterno,
      contador: cantidadReportes + 1,
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
