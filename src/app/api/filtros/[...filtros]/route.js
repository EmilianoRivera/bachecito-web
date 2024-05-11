import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "../../../../../firebase";
 
 
function buscarAlcaldias(ubicacion) {
  const regexAlcaldiasCDMX =
    /(Azcapotzalco|Coyoacán|Cuajimalpa de Morelos|Gustavo A. Madero|Iztacalco|Iztapalapa|Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tláhuac|Tlalpan|Venustiano Carranza|Xochimilco)/gi;
  const alcaldiasEnUbicacion = ubicacion.match(regexAlcaldiasCDMX);

  if (alcaldiasEnUbicacion) {
    // Convertir el array de alcaldías encontradas a un conjunto para eliminar duplicados
    const alcaldiasUnicas = new Set(alcaldiasEnUbicacion);

    // Convertir el conjunto de alcaldías únicas a un array y unirlo en una cadena separada por comas
    const alcaldiasString = Array.from(alcaldiasUnicas).join(", ");

    return alcaldiasString;
  } else {
    return "No se encontraron alcaldías en la ubicación proporcionada.";
  }
}
//Obtiene la fecha de actual en forma de Date
function obtenerFechaActual() {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Se agrega 1 porque los meses van de 0 a 11
  const año = fechaActual.getFullYear();

  // Formatear la fecha en el formato deseado (por ejemplo, dd/mm/yyyy)
  const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}/${
    mes < 10 ? "0" : ""
  }${mes}/${año}`;

  return fechaFormateada;
}

//De string del formato 12/04/2024 pasa a 12/4/2024
function formatearFecha(fecha) {
  const partesFecha = fecha.split("/"); // Dividir la fecha en partes por el separador '/'
  const dia = partesFecha[0];
  const mes = partesFecha[1];
  const año = partesFecha[2];

  // Formatear la fecha en el formato deseado (por ejemplo, dd/mm/yyyy)
  return `${parseInt(dia)}/${parseInt(mes)}/${año}`;
}


function parsearDeStringADate(dateString) {
  const parts = dateString.split("/");
  // La cadena "12/3/2024" se dividirá en ["12", "3", "2024"]

  // Si la fecha tiene menos de 3 partes, no es válida
  if (parts.length !== 3) {
    throw new Error("Formato de fecha no válido");
  }

  // Aseguramos que los valores de día y mes tengan dos dígitos
  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  // Construimos la cadena de fecha en formato "MM/DD/YYYY"
  const formattedDate = `${month}/${day}/${year}`;

  // Creamos el objeto de fecha
  return new Date(formattedDate);
}

//Del objeto Date de la fecha, lo pasa a string
function formatearFechaDateAstring(fecha) {
  // Obtener el día, el mes y el año de la fecha
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
  const año = fecha.getFullYear();

  // Formatear la fecha en el formato dd/mm/yyyy
  const fechaFormateada = `${dia}/${mes}/${año}`;

  return fechaFormateada;
}

function extraerAnioDesdeString(fechaString) {
  // La expresión regular para extraer el año es \d{4}, que coincide con cuatro dígitos numéricos
  const regexAnio = /\d{4}/;
  
  // Ejecutar la expresión regular en el string de fecha para encontrar el año
  const resultado = regexAnio.exec(fechaString);
  
  // El año se encuentra en el primer grupo capturado por la expresión regular
  // Si se encuentra un año, devolverlo; de lo contrario, devolver null
  return resultado ? parseInt(resultado[0]) : null;
}

// Función para obtener el primer día de la semana
function getInicioSemana(fechaHoy) {
  const diaSemana = fechaHoy.getDay();
  const inicioSemana = fechaHoy;
  inicioSemana.setDate(fechaHoy.getDate() - diaSemana);
  inicioSemana.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00

  return inicioSemana;
}

// Función para obtener el último día de la semana
function getFinSemana(fechaHoy) {
  const diaSemana = fechaHoy.getDay();
  const finSemana = new Date(fechaHoy);
  finSemana.setDate(fechaHoy.getDate() + (6 - diaSemana));
  finSemana.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59
  return finSemana;
}

//Obtiene el mes de la fecha
function obtenerMesDesdeFecha(fecha) {
  // Dividir la fecha en partes por el separador '/'
  const partesFecha = fecha.split("/");
  // Obtener el mes (la parte en la posición 1 del array)
  const mes = parseInt(partesFecha[1]);
  return mes;
}

//Obtiene el año
function obtenerAñoDesdeFecha(fecha) {
  // Dividir la fecha en partes (día, mes, año)
  const partesFecha = fecha.split("/");

  // Obtener el año (la última parte)
  const año = parseInt(partesFecha[2]);

  return año;
}

//Todos los casos del filtro de fecha
async function fechaFiltroFormateada(
  fechaFiltro,
  fechaActual,
  startDate,
  endDate
) {
  let resultados = []; // Array para almacenar los datos obtenidos
  switch (fechaFiltro) {
    case "Hoy":

      const fechaActualHoy = formatearFecha(obtenerFechaActual());
      const filtroFechaHoy = query(
        collection(db, "reportes"),
        where("fechaReporte", "==", fechaActualHoy)
      );
      const reportesFechaHoy = await getDocs(filtroFechaHoy);
      reportesFechaHoy.forEach((doc) => {
        resultados.push(doc.data());
      });
      break;

    case "Esta semana":
      const inicioSemana = getInicioSemana(new Date());
      const finSemana = getFinSemana(new Date());
      const referenciaReportes = collection(db, "reportes");
      console.log("CASO GENERAL", inicioSemana, " ", finSemana);

      const reportesSemana = await getDocs(referenciaReportes);
      reportesSemana.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte);
        if (fechaReporte >= inicioSemana && fechaReporte <= finSemana) {
          console.log(reporte)
          resultados.push(reporte);
        }
      });
      break;

    case "Último mes":
      // Agregar lógica para el último mes
      const fechaActualUltimoMes = new Date();
      const primerDiaMesPasado = new Date(
        fechaActualUltimoMes.getFullYear(),
        fechaActualUltimoMes.getMonth() - 1,
        1
      );
      primerDiaMesPasado.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00

      // Obtener el último día del mes pasado
      const ultimoDiaMesPasado = new Date(
        fechaActualUltimoMes.getFullYear(),
        fechaActualUltimoMes.getMonth(),
        0
      );
      ultimoDiaMesPasado.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59

      try { 
        const reportesUltimoMes = await getDocs(collection(db, "reportes")   );
        reportesUltimoMes.forEach((doc) => {
          const reporte = doc.data();
          const mesReporte = obtenerMesDesdeFecha(reporte.fechaReporte);
          const añoReporte = extraerAnioDesdeString(reporte.fechaReporte)
          const mesAnterior = obtenerMesDesdeFecha(formatearFecha(fechaActual)) -1 ;
          const añoDeFechaActual = extraerAnioDesdeString(formatearFecha(fechaActual))
          // Comparar el mes del reporte con el mes actual
          if (mesReporte == mesAnterior && añoReporte == añoDeFechaActual ) {
            console.log(reporte)
            resultados.push(reporte);
          }
        });
      } catch (error) {
        console.error("Error al obtener los reportes del último mes:", error);
        throw error;
      }

      break;

    case "Últimos 6 meses":
      try {
        console.log("CASO ULTIMOS 6 MESES");
        // Obtener la fecha actual y la fecha que estaba hace 6 meses
        const fechaActual = new Date();
        const fechaSeisMesesAtras = new Date();
        fechaSeisMesesAtras.setMonth(fechaSeisMesesAtras.getMonth() - 6);

        // Consultar la base de datos para obtener todos los reportes
        const refReportes = collection(db, "reportes");
        const reportesSnapshot = await getDocs(refReportes);

        // Filtrar los reportes para obtener solo los de los últimos 6 meses
        reportesSnapshot.forEach((doc) => {
          const reporte = doc.data();
          const fechaReporte = parsearDeStringADate(reporte.fechaReporte);
          if (
            fechaReporte >= fechaSeisMesesAtras &&
            fechaReporte <= fechaActual
          ) {
            console.log(reporte)
            resultados.push(reporte);
          }
        });

        // Hacer lo que necesites con los reportes de los últimos 6 meses
      } catch (error) {
        console.error(
          "Error al obtener los reportes de los últimos 6 meses:",
          error
        );
        throw error;
      }
      break;

    case "Este año":
      try {
        // Obtener la fecha actual
        const fechaActual = new Date();

        // Establecer el primer día del año actual
        const primerDiaAñoActual = new Date(fechaActual.getFullYear(), 0, 1);
        primerDiaAñoActual.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00

        // Establecer el último día del año actual
        const ultimoDiaAñoActual = new Date(fechaActual.getFullYear(), 11, 31);
        ultimoDiaAñoActual.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59

        // Consultar la base de datos para obtener los reportes del año actual
        const refReportes = collection(db, "reportes");

        const reportesAñoActual = await getDocs(refReportes);

        // Iterar sobre los reportes y mostrarlos o hacer lo que necesites con ellos
        reportesAñoActual.forEach((doc) => {
          const reporte = doc.data();

          // Obtener el año de la fecha reporte.fechaReporte
          const añoReporte = obtenerAñoDesdeFecha(reporte.fechaReporte);

          // Obtener el año actual
          const añoActual = new Date().getFullYear();

          // Comparar los años
          if (añoReporte === añoActual) {
            console.log(reporte)
            resultados.push(reporte);
          }
        });
      } catch (error) {
        console.error("Error al obtener los reportes del año actual:", error);
        throw error;
      }
      break;
    
    case "Rango personalizado":
      const newStartDate = new Date(startDate);
      const newLastEnd = new Date(endDate);
      const refRep = collection(db, "reportes");
      const reportesSnapshot = await getDocs(refRep);

      reportesSnapshot.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte);
 /*        console.log(parsearDeStringADate(reporte.fechaReporte), " ", new Date(endDate))
        console.log(parsearDeStringADate(reporte.fechaReporte)<= new Date(endDate))
        console.log(parsearDeStringADate(reporte.fechaReporte)>= new Date(startDate))
         */
        if ( fechaReporte >= newStartDate && fechaReporte <= newLastEnd) {
          resultados.push(reporte);
        }
      });

      break;

    default:
      console.log("Opción no válida");
  }
  return resultados;
}

//Todos los casos especificos de los tres filtros
async function fechaFiltroFormateadaEspecifico(
  fechaFiltro,
  fechaActual,
  estado,
  alcaldia,
  startDate,
  endDate
) {
  console.log(estado)
  let filtroEspecifico = []
  switch (fechaFiltro) {
    case "Hoy":
      console.log("CASO DE HOY")

      const fechaActualHoy = formatearFecha(obtenerFechaActual());
  
      const filtroFechaHoy = query(
        collection(db, "reportes"),
        where("fechaReporte", "==", fechaActualHoy),
        where("estado", "==",estado)
      );
      const reportesFechaHoy = await getDocs(filtroFechaHoy);
      reportesFechaHoy.forEach((doc) => {
        const reporte = doc.data();
        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
        if (alcaldiaDelReporte === alcaldia  ) {
          console.log(reporte)
          filtroEspecifico.push(reporte)
        }
      });
      break;

    case "Esta semana":
      console.log("CASO DE ESTA SEMANA")
      const inicioSemana = getInicioSemana(new Date());
      const finSemana = getFinSemana(new Date());
      const referenciaReportes = query(collection(db, "reportes"), where("estado", "==", estado));

      const reportesSemana = await getDocs(referenciaReportes);
      reportesSemana.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte);
        
        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
        if (fechaReporte >= inicioSemana && fechaReporte <= finSemana && alcaldiaDelReporte === alcaldia) {
          console.log(reporte)
          filtroEspecifico.push(reporte)
        }
      });
      break;

    case "Último mes":
      console.log("CASO DE ULTIMO MES")
    const fechaActualUltimoMes = new Date();
        const primerDiaMesPasado = new Date(
          fechaActualUltimoMes.getFullYear(),
          fechaActualUltimoMes.getMonth() - 1,
          1
        );
        primerDiaMesPasado.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00
  
        // Obtener el último día del mes pasado
        const ultimoDiaMesPasado = new Date(
          fechaActualUltimoMes.getFullYear(),
          fechaActualUltimoMes.getMonth(),
          0
        );
        ultimoDiaMesPasado.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59
  
        try { 
          const queryRepUltimoMes = query(collection(db, "reportes"), where("estado", "==", estado))
          const reportesUltimoMes = await getDocs(queryRepUltimoMes);

          reportesUltimoMes.forEach((doc) => {
            const reporte = doc.data();
            const mesReporte = obtenerMesDesdeFecha(reporte.fechaReporte);
            const añoReporte = extraerAnioDesdeString(reporte.fechaReporte)
            const mesAnterior = obtenerMesDesdeFecha(formatearFecha(fechaActual)) -1 ;
            const añoDeFechaActual = extraerAnioDesdeString(formatearFecha(fechaActual))
            const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

            // Comparar el mes del reporte con el mes actual
            if (mesReporte == mesAnterior && añoReporte == añoDeFechaActual && alcaldiaDelReporte === alcaldia ) {
              filtroEspecifico.push(reporte)
              console.log(reporte)
            }
          });
        } catch (error) {
          console.error("Error al obtener los reportes del último mes:", error);
          throw error;
        }
  
        break;

    case "Últimos 6 meses":
      try {
        console.log("CASO ULTIMOS 6 MESES");
        // Obtener la fecha actual y la fecha que estaba hace 6 meses
        const fechaActual = new Date();
        const fechaSeisMesesAtras = new Date();
        fechaSeisMesesAtras.setMonth(fechaSeisMesesAtras.getMonth() - 6);

        // Consultar la base de datos para obtener todos los reportes
        const refReportes = query(collection(db, "reportes"), where("estado", "==", estado));
        const reportesSnapshot = await getDocs(refReportes);

        // Filtrar los reportes para obtener solo los de los últimos 6 meses
        reportesSnapshot.forEach((doc) => {
          const reporte = doc.data();
          const fechaReporte = parsearDeStringADate(reporte.fechaReporte);
          const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

          if (
            fechaReporte >= fechaSeisMesesAtras &&
            fechaReporte <= fechaActual && alcaldiaDelReporte === alcaldia 
            

          ) {
            console.log(reporte)
            filtroEspecifico.push(reporte)

          }
        });

        // Hacer lo que necesites con los reportes de los últimos 6 meses
      } catch (error) {
        console.error(
          "Error al obtener los reportes de los últimos 6 meses:",
          error
        );
        throw error;
      }
      break;

    case "Este año":
      try {
        // Obtener la fecha actual
        const fechaActual = new Date();

        // Establecer el primer día del año actual
        const primerDiaAñoActual = new Date(fechaActual.getFullYear(), 0, 1);
        primerDiaAñoActual.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00

        // Establecer el último día del año actual
        const ultimoDiaAñoActual = new Date(fechaActual.getFullYear(), 11, 31);
        ultimoDiaAñoActual.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59

        // Consultar la base de datos para obtener los reportes del año actual
        const refReportes = query(collection(db, "reportes"), where("estado","==", estado));

        const reportesAñoActual = await getDocs(refReportes);

        // Iterar sobre los reportes y mostrarlos o hacer lo que necesites con ellos
        reportesAñoActual.forEach((doc) => {
          const reporte = doc.data();

          // Obtener el año de la fecha reporte.fechaReporte
          const añoReporte = obtenerAñoDesdeFecha(reporte.fechaReporte);

          // Obtener el año actual
          const añoActual = new Date().getFullYear();

          const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

          // Comparar los años
          if (añoReporte === añoActual && alcaldiaDelReporte === alcaldia) {
            console.log(reporte)
            filtroEspecifico.push(reporte)

          }
        });
      } catch (error) {
        console.error("Error al obtener los reportes del año actual:", error);
        throw error;
      }
      break;
    
     case "Rango personalizado":
      const newStartDate = new Date(startDate);
      const newLastEnd = new Date(endDate);
      const refRep = query(collection(db, "reportes"), where("estado","==", estado));
      const reportesSnapshot = await getDocs(refRep);
      reportesSnapshot.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte); // Supongamos que la fecha del reporte se encuentra en la propiedad "fecha"
        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
        
        if (fechaReporte >= newStartDate && fechaReporte <= newLastEnd
          && alcaldiaDelReporte === alcaldia
        ) {
          console.log(reporte)
          filtroEspecifico.push(reporte)

        }

      });

      break;

    default:
      console.log("Opción no válida");
  }
  return filtroEspecifico
}

//Maneja todos los casos cuando alguno de los filtros tiene valores generales como Todos los estados o Todas las alcaldias o Todos los tiempos
async function filtroGeneral(
  fechaFiltro = "Todos los tiempos",
  fechaActual,
  estado = "Todos",
  alcaldia = "Todas",
  startDate,
  endDate
) {
  let elementosFiltrados = [];  
  if (alcaldia === "Todas" && fechaFiltro === "Todos los tiempos") {
    console.log(alcaldia, " ", fechaFiltro)
    const filtroGeneralAlcaldiaFechaQuery = query(
      collection(db, "reportes"),
      where("estado", "==", estado)
    );
    
    const reportesAlcaldiaFecha = await getDocs(
      filtroGeneralAlcaldiaFechaQuery
    );
    reportesAlcaldiaFecha.forEach((doc) => {
      elementosFiltrados.push(doc.data())
    });

  } else if (alcaldia === "Todas" && estado === "Todos") {
    const formateoFechaFiltro = await fechaFiltroFormateada(
      fechaFiltro,
      fechaActual,
      startDate,
      endDate
    );
    elementosFiltrados.push(formateoFechaFiltro)
  } else if (fechaFiltro === "Todos los tiempos" && estado === "Todos") {
    //obtener ubicacion
    const refDoc = collection(db, "reportes");
    const reportesAlcaldiaFecha = await getDocs(refDoc);
    reportesAlcaldiaFecha.forEach((doc) => {
      const reporte = doc.data();
      const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
      if (alcaldia === alcaldiaDelReporte) {
        elementosFiltrados.push(reporte)
      }
    });
  }
  return elementosFiltrados;
}

//Maneja todos los casos que son específicos, exceptuando los valores de cuando son Todos los estado o Todas las alcaldias o Todos los tiempos
async function filtroEspecifico(
  fechaFiltro,
  fechaActual,
  estado,
  alcaldia,
  startDate,
  endDate
) {
  let filtroEspecifico = []
  const formateoFechaFiltroEspecifico = await fechaFiltroFormateadaEspecifico(
    fechaFiltro,
    fechaActual,
    estado,
    alcaldia,
    startDate,
    endDate
  );

  filtroEspecifico.push(formateoFechaFiltroEspecifico)
  return filtroEspecifico
}

//Funcion que recibe y envia la petición
export async function POST(request, { params }) {
  try {
    const [estado, alcaldia, fechaFiltro, startDate, endDate] = params.filtros; // Desestructura el array filtros en 5 variables
    //llamada a funciones
    const fechaActual = obtenerFechaActual();
    console.log(estado)
    if (
      estado === "Todos" ||
      alcaldia === "Todas" ||
      fechaFiltro === "Todos los tiempos"
    ) {

      const filtradoGeneral = await filtroGeneral(
        fechaFiltro,
        fechaActual,
        estado,
        alcaldia,
        startDate,
        endDate
      );
      return NextResponse.json(filtradoGeneral)

    } else {

      const filtradoEspecifico = await filtroEspecifico(
        fechaFiltro,
        fechaActual,
        estado,
        alcaldia,
        startDate,
        endDate
      );
      return NextResponse.json(filtradoEspecifico)
    }  
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}