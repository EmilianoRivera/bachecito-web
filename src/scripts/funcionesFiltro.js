export function buscarAlcaldias(ubicacion) {
    const regexAlcaldiasCDMX =
      /(Álvaro Obregón|Azcapotzalco|Benito Juárez|Coyoacán|Cuajimalpa de Morelos|Cuauhtémoc|Gustavo A. Madero|Iztacalco|Iztapalapa|La Magdalena Contreras|Miguel Hidalgo|Milpa Alta|Tlalpan|Tláhuac|Venustiano Carranza|Xochimilco)/gi;
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
  export function obtenerFechaActual() {
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
  export function formatearFecha(fecha) {
    const partesFecha = fecha.split("/"); // Dividir la fecha en partes por el separador '/'
    const dia = partesFecha[0];
    const mes = partesFecha[1];
    const año = partesFecha[2];
  
    // Formatear la fecha en el formato deseado (por ejemplo, dd/mm/yyyy)
    return `${parseInt(dia)}/${parseInt(mes)}/${año}`;
  }
  
  export function parsearDeStringADate(dateString) {
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
  export function formatearFechaDateAstring(fecha) {
    // Obtener el día, el mes y el año de la fecha
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
    const año = fecha.getFullYear();
  
    // Formatear la fecha en el formato dd/mm/yyyy
    const fechaFormateada = `${dia}/${mes}/${año}`;
  
    return fechaFormateada;
  }
  
  export function extraerAnioDesdeString(fechaString) {
    // La expresión regular para extraer el año es \d{4}, que coincide con cuatro dígitos numéricos
    const regexAnio = /\d{4}/;
  
    // Ejecutar la expresión regular en el string de fecha para encontrar el año
    const resultado = regexAnio.exec(fechaString);
  
    // El año se encuentra en el primer grupo capturado por la expresión regular
    // Si se encuentra un año, devolverlo; de lo contrario, devolver null
    return resultado ? parseInt(resultado[0]) : null;
  }
  
  // Función para obtener el primer día de la semana
  export function getInicioSemana(fechaHoy) {
    const diaSemana = fechaHoy.getDay();
    const inicioSemana = fechaHoy;
    inicioSemana.setDate(fechaHoy.getDate() - diaSemana);
    inicioSemana.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00
  
    return inicioSemana;
  }
  
  // Función para obtener el último día de la semana
  export function getFinSemana(fechaHoy) {
    const diaSemana = fechaHoy.getDay();
    const finSemana = new Date(fechaHoy);
    finSemana.setDate(fechaHoy.getDate() + (6 - diaSemana));
    finSemana.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59
    return finSemana;
  }
  
  //Obtiene el mes de la fecha
  export function obtenerMesDesdeFecha(fecha) {
    // Dividir la fecha en partes por el separador '/'
    const partesFecha = fecha.split("/");
    // Obtener el mes (la parte en la posición 1 del array)
    const mes = parseInt(partesFecha[1]);
    return mes;
  }
  
  //Obtiene el año
  export function obtenerAñoDesdeFecha(fecha) {
    // Dividir la fecha en partes (día, mes, año)
    const partesFecha = fecha.split("/");
  
    // Obtener el año (la última parte)
    const año = parseInt(partesFecha[2]);
  
    return año;
  }