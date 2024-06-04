import { NextResponse } from "next/server";
import { db, collection, addDoc, query, doc, getDocs, writeBatch, where } from "../../../../../firebase";
import { desc } from "@/scripts/Cifrado/Cifrar";
import { getDoc } from "firebase/firestore";

const obtenerFolioPorDireccion = async (direccion) => {
  try {
    const alcaldiasRef = doc(db, 'alcaldia', 'NFEUuhTpDlLA0ycwqNPm');
    const alcaldiasSnap = await getDoc(alcaldiasRef);

    if (alcaldiasSnap.exists()) {
      const alcaldiasData = alcaldiasSnap.data();
      let alcaldiaEncontrada = null;
      let folioAlcaldiaEncontrada = null;

      for (const [alcaldia, folio] of Object.entries(alcaldiasData)) {
        if (direccion.includes(alcaldia)) {
          alcaldiaEncontrada = alcaldia;
          folioAlcaldiaEncontrada = folio;
          break;
        }
      }

      if (alcaldiaEncontrada) {
        const reportesQuery = query(collection(db, 'reportes'));
        const reportesSnap = await getDocs(reportesQuery);
        const reportes = reportesSnap.docs.map(doc => doc.data());
        const reportesEnAlcaldia = reportes.filter(reporte => reporte.ubicacion.includes(alcaldiaEncontrada));
        const cantidadReportes = reportesEnAlcaldia.length;
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
    const reportesQuery = query(collection(db, 'reportes'), where("ubicacion", "==", direccion));
    const reportesSnap = await getDocs(reportesQuery);
    const cantidadReportes = reportesSnap.docs.length;

    const batch = writeBatch(db);
    reportesSnap.forEach((doc) => {
      const reporte = doc.data();
      const nuevoContador = reporte.contador + 1;
      batch.update(doc.ref, { contador: nuevoContador });
    });
    await batch.commit();
    return cantidadReportes;
  } catch (error) {
    console.error('Error al enviar el reporte:', error);
  }
};


function obtenerFechaActual() {
  const fechaActual = new Date();
  const dia = String(fechaActual.getDate()).padStart(2, '0');
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Se agrega 1 porque los meses van de 0 a 11
  const año = fechaActual.getFullYear();

  // Formatear la fecha en el formato deseado (dd-mm-yyyy)
  const fechaFormateada = `${dia}-${mes}-${año}`;

  return fechaFormateada;
}
export async function POST(request, { params }) {
  try {
    
    const [uidUsuario, nombre, apellidoPaterno, imagenURL, descripcion, ubicacion] = params.MandarR;
    
    const id = decodeURIComponent(uidUsuario);
    const uid = desc(id);

    const folio = await obtenerFolioPorDireccion(ubicacion);
    const cantidadReportes = await contadorFunc(ubicacion);
    const fechaReporte = obtenerFechaActual();
   

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
      uid,
    });

    return NextResponse.json("ESTATUS 200");
  } catch (error) {
    console.error("Hubo un error en la api", error);
    return NextResponse.error(new Error("Hubo un error en la api"));
  }
}
