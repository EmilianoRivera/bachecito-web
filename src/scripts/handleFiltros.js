import {
  buscarAlcaldias,
  obtenerFechaActual,
  formatearFecha,
  parsearDeStringADate,
  formatearFechaDateAstring,
  extraerAnioDesdeString,
  getInicioSemana,
  getFinSemana,
  obtenerMesDesdeFecha,
  obtenerAñoDesdeFecha,
} from "./funcionesFiltro";
import { enc } from "./Cifrado/Cifrar";
import { db, collection, getDocs, query, where } from "../../firebase";

//Todos los casos del filtro de fecha
export async function fechaFiltroFormateada(
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
        let dat= doc.data()
        resultados.push(enc(dat));
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
          let rep = enc(reporte)
          resultados.push(rep);
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
        const reportesUltimoMes = await getDocs(collection(db, "reportes"));
        reportesUltimoMes.forEach((doc) => {
          const reporte = doc.data();
          const mesReporte = obtenerMesDesdeFecha(reporte.fechaReporte);
          const añoReporte = extraerAnioDesdeString(reporte.fechaReporte);
          const mesAnterior =
            obtenerMesDesdeFecha(formatearFecha(fechaActual)) - 1;
          const añoDeFechaActual = extraerAnioDesdeString(
            formatearFecha(fechaActual)
          );
          // Comparar el mes del reporte con el mes actual
          if (mesReporte == mesAnterior && añoReporte == añoDeFechaActual) {
            let rep = enc(reporte)
            resultados.push(rep);
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
            let rep = enc(reporte)
            resultados.push(rep);
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
            let rep = enc(reporte)
   
            resultados.push(rep);
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
        if (fechaReporte >= newStartDate && fechaReporte <= newLastEnd) {
          let rep = enc(reporte)
          resultados.push(rep);
        }
      });

      break;
    default:
      console.log("Opción no válida");
  }
  return resultados;
}

//Todos los casos especificos de los tres filtros
export async function fechaFiltroFormateadaEspecifico(
  fechaFiltro,
        fechaActual,
        estado,
        alcaldia,
        startDate,
        endDate
) {
  console.log(estado);
  let filtroEspecifico = [];
  switch (fechaFiltro) {
    case "Hoy":
      console.log("CASO DE HOY");

      const fechaActualHoy = formatearFecha(obtenerFechaActual());

      const filtroFechaHoy = query(
        collection(db, "reportes"),
        where("fechaReporte", "==", fechaActualHoy),
        where("estado", "==", estado)
      );
      const reportesFechaHoy = await getDocs(filtroFechaHoy);
      reportesFechaHoy.forEach((doc) => {
        const reporte = doc.data();
        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
        if (alcaldiaDelReporte === alcaldia) {
          let rep = enc(reporte)
          filtroEspecifico.push(rep);
        }
      });
      break;

    case "Esta semana":
      console.log("CASO DE ESTA SEMANA");
      const inicioSemana = getInicioSemana(new Date());
      const finSemana = getFinSemana(new Date());
      const referenciaReportes = query(
        collection(db, "reportes"),
        where("estado", "==", estado)
      );

      const reportesSemana = await getDocs(referenciaReportes);
      reportesSemana.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte);

        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
        if (
          fechaReporte >= inicioSemana &&
          fechaReporte <= finSemana &&
          alcaldiaDelReporte === alcaldia
        ) {
          let rep = enc(reporte)
          filtroEspecifico.push(rep);
        }
      });
      break;

    case "Último mes":
      console.log("CASO DE ULTIMO MES");
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
        const queryRepUltimoMes = query(
          collection(db, "reportes"),
          where("estado", "==", estado)
        );
        const reportesUltimoMes = await getDocs(queryRepUltimoMes);

        reportesUltimoMes.forEach((doc) => {
          const reporte = doc.data();
          const mesReporte = obtenerMesDesdeFecha(reporte.fechaReporte);
          const añoReporte = extraerAnioDesdeString(reporte.fechaReporte);
          const mesAnterior =
            obtenerMesDesdeFecha(formatearFecha(fechaActual)) - 1;
          const añoDeFechaActual = extraerAnioDesdeString(
            formatearFecha(fechaActual)
          );
          const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

          // Comparar el mes del reporte con el mes actual
          if (
            mesReporte == mesAnterior &&
            añoReporte == añoDeFechaActual &&
            alcaldiaDelReporte === alcaldia
          ) {
            let rep = enc(reporte)
          filtroEspecifico.push(rep);
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
        const refReportes = query(
          collection(db, "reportes"),
          where("estado", "==", estado)
        );
        const reportesSnapshot = await getDocs(refReportes);
        // Filtrar los reportes para obtener solo los de los últimos 6 meses
        reportesSnapshot.forEach((doc) => {
          const reporte = doc.data();
          const fechaReporte = parsearDeStringADate(reporte.fechaReporte);
          const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

         
          if (
            fechaReporte >= fechaSeisMesesAtras &&
            fechaReporte <= fechaActual &&
            alcaldiaDelReporte === alcaldia
          ) {
            let rep = enc(reporte)
            filtroEspecifico.push(rep);
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
        const refReportes = query(
          collection(db, "reportes"),
          where("estado", "==", estado)
        );

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
            let rep = enc(reporte)
            filtroEspecifico.push(rep);
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
      const refRep = query(
        collection(db, "reportes"),
        where("estado", "==", estado)
      );
      const reportesSnapshot = await getDocs(refRep);
      reportesSnapshot.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte); // Supongamos que la fecha del reporte se encuentra en la propiedad "fecha"
        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
/*         console.log(newStartDate, " ",newLastEnd )
        console.log("------")
        console.log(startDate, " ", endDate)
        console.log(alcaldia)
        console.log(alcaldiaDelReporte === alcaldia)
        console.log( fechaReporte >= newStartDate)
        console.log(  fechaReporte <= newLastEnd)
        console.log("FECHAS FIN: ",fechaReporte, " ", newLastEnd)
        console.log("FECHAS INICIO: ",fechaReporte, " ", newStartDate)
 */
        if (
          fechaReporte >= newStartDate &&
          fechaReporte <= newLastEnd &&
          alcaldiaDelReporte === alcaldia
        ) {
          let rep = enc(reporte)
          filtroEspecifico.push(rep);
        }
      });

      break;

    default:
      console.log("Opción no válida");
  }
  return filtroEspecifico;
}

//Maneja los casos cuando son todas las alcaldias
export async function fechaFiltroEGAlcaldias(
  fechaFiltro,
  fechaActual,
  startDate,
  endDate,
  estado
) {
  let filtroEspecifico = [];
  switch (fechaFiltro) {
    case "Hoy":
      console.log("CASO DE HOY");

      const fechaActualHoy = formatearFecha(obtenerFechaActual());

      const filtroFechaHoy = query(
        collection(db, "reportes"),
        where("fechaReporte", "==", fechaActualHoy),
        where("estado", "==", estado)
      );
      const reportesFechaHoy = await getDocs(filtroFechaHoy);
      reportesFechaHoy.forEach((doc) => {
        const reporte = doc.data();
        let rep = enc(reporte)
        filtroEspecifico.push(rep);
      });
      break;

    case "Esta semana":
      console.log("CASO DE ESTA SEMANA");
      const inicioSemana = getInicioSemana(new Date());
      const finSemana = getFinSemana(new Date());
      const referenciaReportes = query(
        collection(db, "reportes"),
        where("estado", "==", estado)
      );

      const reportesSemana = await getDocs(referenciaReportes);
      reportesSemana.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte);

        if (fechaReporte >= inicioSemana && fechaReporte <= finSemana) {
          const reporte = doc.data();
          let rep = enc(reporte)
          filtroEspecifico.push(rep);
        }
      });
      break;

    case "Último mes":
      console.log("CASO DE ULTIMO MES");
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
        const queryRepUltimoMes = query(
          collection(db, "reportes"),
          where("estado", "==", estado)
        );
        const reportesUltimoMes = await getDocs(queryRepUltimoMes);

        reportesUltimoMes.forEach((doc) => {
          const reporte = doc.data();
          const mesReporte = obtenerMesDesdeFecha(reporte.fechaReporte);
          const añoReporte = extraerAnioDesdeString(reporte.fechaReporte);
          const mesAnterior =
            obtenerMesDesdeFecha(formatearFecha(fechaActual)) - 1;
          const añoDeFechaActual = extraerAnioDesdeString(
            formatearFecha(fechaActual)
          );
          // Comparar el mes del reporte con el mes actual
          if (mesReporte == mesAnterior && añoReporte == añoDeFechaActual) {
            const reporte = doc.data();
            let rep = enc(reporte)
            filtroEspecifico.push(rep);
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
        const refReportes = query(
          collection(db, "reportes"),
          where("estado", "==", estado)
        );
        const reportesSnapshot = await getDocs(refReportes);

        // Filtrar los reportes para obtener solo los de los últimos 6 meses
        reportesSnapshot.forEach((doc) => {
          const reporte = doc.data();
          const fechaReporte = parsearDeStringADate(reporte.fechaReporte);

          if (
            fechaReporte >= fechaSeisMesesAtras &&
            fechaReporte <= fechaActual
          ) {
            const reporte = doc.data();
        let rep = enc(reporte)
        filtroEspecifico.push(rep);
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
        const refReportes = query(
          collection(db, "reportes"),
          where("estado", "==", estado)
        );

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
            const reporte = doc.data();
            let rep = enc(reporte)
            filtroEspecifico.push(rep);
          }
        });
      } catch (error) {
        console.error("Error al obtener los reportes del año actual:", error);
        throw error;
      }
      break;

    case "Rango personalizado":
      console.log(startDate, " ", endDate);
      const newStartDate = new Date(startDate);
      const newLastEnd = new Date(endDate);
      const refRep = query(
        collection(db, "reportes"),
        where("estado", "==", estado)
      );
      const reportesSnapshot = await getDocs(refRep);
      reportesSnapshot.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte); // Supongamos que la fecha del reporte se encuentra en la propiedad "fecha"
        if (fechaReporte >= newStartDate && fechaReporte <= newLastEnd) {
          const reporte = doc.data();
          let rep = enc(reporte)
          filtroEspecifico.push(rep);
        }
      });

      break;

    default:
      console.log("Opción no válida");
  }
  return filtroEspecifico;
}

//Maneja los casos cuando son todos los estados
export async function fechaFiltroEGEstados(
  fechaFiltro,
  fechaActual,
  startDate,
  endDate,
  alcaldia
) {
  let filtroEspecifico = [];
  switch (fechaFiltro) {
    case "Hoy":
      console.log("CASO DE HOY");

      const fechaActualHoy = formatearFecha(obtenerFechaActual());

      const filtroFechaHoy = query(
        collection(db, "reportes"),
        where("fechaReporte", "==", fechaActualHoy)
      );
      const reportesFechaHoy = await getDocs(filtroFechaHoy);
      reportesFechaHoy.forEach((doc) => {
        const reporte = doc.data();
        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
        if (alcaldiaDelReporte === alcaldia) {
          const rep = enc(reporte)          
          filtroEspecifico.push(rep);
        }
      });
      break;

    case "Esta semana":
      console.log("CASO DE ESTA SEMANA");
      const inicioSemana = getInicioSemana(new Date());
      const finSemana = getFinSemana(new Date());
      const referenciaReportes = query(collection(db, "reportes"));

      const reportesSemana = await getDocs(referenciaReportes);
      reportesSemana.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte);

        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);
        if (
          fechaReporte >= inicioSemana &&
          fechaReporte <= finSemana &&
          alcaldiaDelReporte === alcaldia
        ) {
          const rep = enc(reporte)          
          filtroEspecifico.push(rep);
        }
      });
      break;

    case "Último mes":
      console.log("CASO DE ULTIMO MES");
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
        const queryRepUltimoMes = query(collection(db, "reportes"));
        const reportesUltimoMes = await getDocs(queryRepUltimoMes);

        reportesUltimoMes.forEach((doc) => {
          const reporte = doc.data();
          const mesReporte = obtenerMesDesdeFecha(reporte.fechaReporte);
          const añoReporte = extraerAnioDesdeString(reporte.fechaReporte);
          const mesAnterior =
            obtenerMesDesdeFecha(formatearFecha(fechaActual)) - 1;
          const añoDeFechaActual = extraerAnioDesdeString(
            formatearFecha(fechaActual)
          );
          const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

          // Comparar el mes del reporte con el mes actual
          if (
            mesReporte == mesAnterior &&
            añoReporte == añoDeFechaActual &&
            alcaldiaDelReporte === alcaldia
          ) {
            const rep = enc(reporte)          
          filtroEspecifico.push(rep);
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
        const refReportes = query(collection(db, "reportes"));
        const reportesSnapshot = await getDocs(refReportes);

        // Filtrar los reportes para obtener solo los de los últimos 6 meses
        reportesSnapshot.forEach((doc) => {
          const reporte = doc.data();
          const fechaReporte = parsearDeStringADate(reporte.fechaReporte);
          const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

          if (
            fechaReporte >= fechaSeisMesesAtras &&
            fechaReporte <= fechaActual &&
            alcaldiaDelReporte === alcaldia
          ) {
            const rep = enc(reporte)          
            filtroEspecifico.push(rep);
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
        const refReportes = query(collection(db, "reportes"));

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
            const rep = enc(reporte)          
            filtroEspecifico.push(rep);
          }
        });
      } catch (error) {
        console.error("Error al obtener los reportes del año actual:", error);
        throw error;
      }
      break;

    case "Rango personalizado":
      console.log(startDate, " ", endDate);
      const newStartDate = new Date(startDate);
      const newLastEnd = new Date(endDate);
      const refRep = collection(db, "reportes");

      const reportesSnapshot = await getDocs(refRep);
      reportesSnapshot.forEach((doc) => {
        const reporte = doc.data();
        const fechaReporte = parsearDeStringADate(reporte.fechaReporte); // Supongamos que la fecha del reporte se encuentra en la propiedad "fecha"
        const alcaldiaDelReporte = buscarAlcaldias(reporte.ubicacion);

        if (
          fechaReporte >= newStartDate &&
          fechaReporte <= newLastEnd &&
          alcaldiaDelReporte === alcaldia
        ) {
          const rep = enc(reporte)          
          filtroEspecifico.push(rep);
        }
      });

      break;

    default:
      console.log("Opción no válida");
  }
  return filtroEspecifico;
}
