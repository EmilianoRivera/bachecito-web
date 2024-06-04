"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";
import { auth, db, app2, app } from "../../../../../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../../../../../context/AuthContext";
import "./Soporte.css";
import { enc, desc } from "../../../../scripts/Cifrado/Cifrar";
function Soporte() {
  useAuthUser();
  //const [fecha, setFecha] = useState('');
  //const [rutaError, setRutaError] = useState('');
  const textareaRef = useRef(null);
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [errorSeleccionado, setErrorSeleccionado] = useState("S001");
  const [sistemaOperativo, setSistemaOperativo] = useState(
    "No se ha seleccionado un sistema operativo"
  );
  const [asignarTarea, setAsignarTarea] = useState("Otro");
  const [navegador, setNavegador] = useState(
    "No se ha seleccionado un navegador"
  );
  const [selectedRutaError, setSelectedRutaError] = useState("/NoEspecificado");
  const [foto, setFoto] = useState(null);
  const [descripcionProblema, setDescripcionProblema] = useState("");

  const [mostrarDetalle1, setMostrarDetalle1] = useState(false);
  const [mostrarDetalle2, setMostrarDetalle2] = useState(false);
  const [mostrarDetalle3, setMostrarDetalle3] = useState(false);
  const [mostrarDetalle4, setMostrarDetalle4] = useState(false);
  const [mostrarDetalle5, setMostrarDetalle5] = useState(false);
  const [mostrarDetalle6, setMostrarDetalle6] = useState(false);
  const [mostrarDetalle7, setMostrarDetalle7] = useState(false);
  const [mostrarDetalle8, setMostrarDetalle8] = useState(false);
  const [mostrarDetalle9, setMostrarDetalle9] = useState(false);
  const [mostrarDetalle10, setMostrarDetalle10] = useState(false);
  const [ticket, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ticketEncontrado, setTicketEncontrado] = useState([]);

  const toggleDetalle1 = () => {
    setMostrarDetalle1(!mostrarDetalle1);
  };

  const toggleDetalle2 = () => {
    setMostrarDetalle2(!mostrarDetalle2);
  };

  const toggleDetalle3 = () => {
    setMostrarDetalle3(!mostrarDetalle3);
  };

  const toggleDetalle4 = () => {
    setMostrarDetalle4(!mostrarDetalle4);
  };

  const toggleDetalle5 = () => {
    setMostrarDetalle5(!mostrarDetalle5);
  };

  const toggleDetalle6 = () => {
    setMostrarDetalle6(!mostrarDetalle6);
  };

  const toggleDetalle7 = () => {
    setMostrarDetalle7(!mostrarDetalle7);
  };

  const toggleDetalle8 = () => {
    setMostrarDetalle8(!mostrarDetalle8);
  };

  const toggleDetalle9 = () => {
    setMostrarDetalle9(!mostrarDetalle9);
  };

  const toggleDetalle10 = () => {
    setMostrarDetalle10(!mostrarDetalle10);
  };

  // Función para cambiar la imagen
  const obtenerImagen1 = () => {
    return mostrarDetalle1
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen2 = () => {
    return mostrarDetalle2
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen3 = () => {
    return mostrarDetalle3
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen4 = () => {
    return mostrarDetalle4
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen5 = () => {
    return mostrarDetalle5
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen6 = () => {
    return mostrarDetalle6
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen7 = () => {
    return mostrarDetalle7
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen8 = () => {
    return mostrarDetalle8
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen9 = () => {
    return mostrarDetalle9
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  const obtenerImagen10 = () => {
    return mostrarDetalle10
      ? "https://i.postimg.cc/wB2S0JqV/triangulo-1.png"
      : "https://i.postimg.cc/Z5XxTn6Y/triangulo.png";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          fetchData(uid);
        } else {
          router.push("/reportes");
        }
      });
      return () => unsubscribe();
    }
    async function fetchData(uid) {
      try {
        const E_uid = enc(uid);
        const baseURL = process.env.NEXT_PUBLIC_RUTA_U;
    
        const userResponse = await fetch(`${baseURL}/${encodeURIComponent(E_uid)}`);
    
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
    
        const encryptedUserDatas = await userResponse.json();
        const userDatas = desc(encryptedUserDatas);
        setUserData(userDatas);
      } catch (error) {
        console.error("Error al traer la info:", error);
      }
    }
    
  }, []);

  useEffect(() => {
    async function fetchTickets() {
      try {
        if (!userData || !userData.uid) {
          console.error("Los datos del usuario no están accesibles");
          return;
        }
    
        const uids = enc(userData.uid);
    
        const baseURL = process.env.NEXT_PUBLIC_RUTA_T;
        const ticketsData = await fetch(`${baseURL}/${encodeURIComponent(uids)}`);
        if (!ticketsData.ok) {
          throw new Error("Error al traer los datos");
        }
    
        const encryptedTickets = await ticketsData.json();
    
        // Asegúrate de que encryptedTickets es un array de strings
        const tickets = encryptedTickets.map(ticket => desc(ticket));
        
        setTickets(tickets);
      } catch (error) {
        console.error("Error al traer los tickets:", error);
      }
    }
    

    // Ejecutar fetchTickets() solo si userData está disponible y tiene un valor válido
    if (userData && userData.uid) {
      fetchTickets();
    }
  }, [userData]); // Ejecutar cuando userData cambie

  const catalogoRutaErrores = [
    { ruta: "/Cuenta/Administrador", modulo: "✅Inicio de Sesión" },
    { ruta: "/Administrador/Dashboard", modulo: "📊 Dashboard" },
    { ruta: "/Administrador/Mapa", modulo: "🗺️ Mapa" },
    { ruta: "/Administrador/NuevoAdmin", modulo: "👤 Nuevo Administrador" },
    { ruta: "/Administrador/Reportes", modulo: "⚠️ Reportes" },
    { ruta: "/Administrador/Papelera", modulo: "⚠️ Reportes" },
    { ruta: "Otros", modulo: "🔄️ Otra opción" },
  ];

  // Catálogo de errores
  const catalogoErrores = [
    { clave: "S001", nombre: "❌ Error de Inicio de Sesión" },
    { clave: "S002", nombre: "📝 Error de Registro" },
    { clave: "D001", nombre: "📊 Error al Cargar Estadísticas" },
    { clave: "D002", nombre: "➰ Error de Filtros" },
    { clave: "M001", nombre: "⏳ Error al Cargar el Mapa" },
    { clave: "M002", nombre: "📌 Error de Ubicación" },
    { clave: "R001", nombre: "⚠️ Error al Cargar los Reportes" },
    { clave: "R002", nombre: "🚩 Error al Cambiar estado de los Reportes" },
    { clave: "R003", nombre: "🗑️ Error al Mover reportes a la papelera" },
    { clave: "P001", nombre: "👀 Error al Visualizar reportes en la papelera" },
    { clave: "P002", nombre: "⛔ Error al Eliminar reportes de la papelera" },
    { clave: "T001", nombre: "📨 Error al Enviar Ticket" },
    { clave: "0000", nombre: "🔄️ Otro: (Especificar en Descripcion)" },
  ];

  // Catálogo de sistemas operativos
  const catalogoSistemaOperativo = [
    "Windows",
    "MacOS",
    "Linux",
    "Android",
    "iOS",
    "Chrome OS",
    "Windows Server",
    "Unix",
    "Ubuntu",
    "iOS/iPadOS",
    "Otro",
  ];

  // Catálogo de navegadores
  const catalogoNavegadores = [
    "Google Chrome",
    "Mozilla Firefox",
    "Microsoft Edge",
    "Safari",
    "Opera",
    "Internet Explorer",
    "Samsung Internet",
    "Otro",
  ];
  //Convertir timestamp
  function formatTimestamp(timestamp) {
    // Verifica si timestamp es un objeto con propiedades seconds y nanoseconds
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
      // Crea una nueva instancia de Date utilizando los segundos del timestamp
      const dateObject = new Date(timestamp.seconds * 1000); // Multiplica por 1000 para convertir segundos a milisegundos
      // Formatea la fecha como una cadena legible
      return dateObject.toLocaleDateString(); // Obtener solo la fecha sin la hora
    } else {
      // Si no se puede convertir, devuelve un mensaje de error
      return "Aun no Resuelto";
    }
  }

  const openModal = (folio) => {
    const ticketEncontrados = ticket.find((ticket) => ticket.folio === folio);
    if (ticketEncontrados) {
      //   console.log("Ticket encontrado:", ticketEncontrados);
      setTicketEncontrado(ticketEncontrados);
    } else {
      console.log("No se encontró ningún ticket con el folio:", folio);
    }
    setShowModal(true);
  };

  // Obtener fecha actual al cargar el componente
  /*
  useEffect(() => {
    const obtenerFechaActual = () => {
      const fechaActual = new Date();
      const dia = fechaActual.getDate();
      const mes = fechaActual.getMonth() + 1;
      const año = fechaActual.getFullYear();
      const fechaFormateada = ${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${año};
      setFecha(fechaFormateada);
    };

    obtenerFechaActual();
  }, []);
  */

  // Funciones para manejar los cambios en el select de errores y sistemas operativos

  const closeModal = () => {
    setShowModal(false);
  };

  const handleError = (e) => {
    const selectedErr = e.target.value;
    setErrorSeleccionado(selectedErr);
    //console.log(selectedErr);
  };

  const handleSO = (e) => {
    const selectedSO = e.target.value;
    setSistemaOperativo(selectedSO);
    //console.log(selectedSO);
  };

  const handleAsignarTarea = (e) => {
    const asignar = e.target.value;
    setAsignarTarea(asignar);
    //console.log(asignar);
  };
  const handleNavegador = (e) => {
    const selectedNavegador = e.target.value;
    setNavegador(selectedNavegador);
    //console.log(selectedNavegador);
  };

  const handleRutaError = (e) => {
    const ruta = e.target.value;
    // console.log(e.target.value);
    setSelectedRutaError(ruta);
  };

  const handleFoto = (e) => {
    setFoto(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFoto(selectedFile);
  };

  const handleDescripcionProblema = (e) => {
    setDescripcionProblema(e.target.value);
    //console.log(descripcionProblema);
    // Ajustar la altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleFileUpload = async ( ) => {

    const archivo = document.querySelector('input[type="file"]');
    const archivito = archivo.files[0];

    if (!archivito) {
      console.error("No se ha seleccionado ningún archivo");
      return;
    }

    const storage = getStorage(app2);
    const randomId = Math.random().toString(36).substring(7);
    const imageName = `Ticket_${randomId}`;
    const storageRef = ref(storage, `ImagenesTickets/${imageName}`);
    await uploadBytes(storageRef, archivito);
    return getDownloadURL(storageRef);
  };
  // Acá va toda la lógica

  const handleSubmit = async (e) => {
    e.preventDefault();

    const correoA = enc(userData.correo);
    const nombre = enc(userData.nombre);
    const area = enc(asignarTarea);
    const Uid = enc(userData.uid);
    const url = await handleFileUpload();
    const descProm = enc(descripcionProblema)
    const selectedRuta = enc(selectedRutaError)
    const errorSelec = enc(errorSeleccionado)
    let res = prompt("¿Desea levantar el ticket? (SI/NO)");
    if (res.toUpperCase() === "SI") {
      try {
        const baseURL = process.env.NEXT_PUBLIC_RUTA_RT;
        const parametros = {
          url: encodeURIComponent(url),
          Uid: encodeURIComponent(Uid),
          errorSeleccionado: encodeURIComponent(errorSelec),
          sistemaOperativo,
          navegador,
          selectedRutaError: encodeURIComponent(selectedRuta),
          descripcionProblema: encodeURIComponent(descProm),
          correoA:encodeURIComponent(correoA),
          nombre:encodeURIComponent(nombre),
          area: encodeURIComponent(area),
        }
        const ticketResponse = await fetch(
          `${baseURL}/${encodeURIComponent(
            url
          )}/${encodeURIComponent(Uid)}/${encodeURIComponent(errorSelec)}/${sistemaOperativo}/${navegador}/${encodeURIComponent(
            selectedRuta
          )}/${encodeURIComponent(descProm)}/${encodeURIComponent(correoA)}/${encodeURIComponent(nombre)}/${encodeURIComponent(area)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(parametros),
          }
        );
        if (ticketResponse.ok) {
          console.log("Formulario enviado con éxito");
          alert("Formulario enviado con exito");
      window.location.reload();
        } else {
          console.error(
            "Error al enviar el formulario:",
            ticketResponse.status
          );
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    } else {
      alert("NO SE LEVANTARA SU TICKET");
    }
  };

  return (
    <div className="bodySoporte">
      <div className="containerSoporte">
        <div className="containerPF">
          <div className="boxPF" id="boxPF">
            <div className="containerLetritasPF" id="containerLetritasPF">
              <svg className="svg-soporte">
                <text textAnchor="middle" x="50%" y="50%">
                  PREGUNTAS FRECUENTES
                </text>
              </svg>
            </div>
          </div>

          <div className="todas_las_pf">
            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>1.- ¿Cómo elimino un reporte de bache en el sistema?</p>
                <img src={obtenerImagen1()} alt="" onClick={toggleDetalle1} />
              </div>
              {mostrarDetalle1 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Para eliminar un reporte de bache del sistema primero accede
                    al apartado de "Reportes". Una vez allí, al posicionar el
                    cursor sobre cada reporte, verás la opción "ELIMINAR". Al
                    hacer clic en el ícono, el reporte se enviará a la papelera.
                    Si deseas eliminarlo de manera permanente, dirígete al
                    apartado de papelera dentro de "Reportes" y haz clic en el
                    ícono correspondiente, lo que eliminará el reporte sin
                    posibilidad de restaurarlo.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  2.- ¿Qué debo hacer si elimino accidentalmente un reporte?
                </p>
                <img src={obtenerImagen2()} alt="" onClick={toggleDetalle2} />
              </div>
              {mostrarDetalle2 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Si eliminaste accidentalmente un reporte, no te preocupes.
                    Dentro de "Reportes" se dispone de una papelera donde se
                    almacenan los reportes eliminados y los cuales pueden ser
                    restaurados nuevamente al panel de visualización de
                    reportes. Sin embargo, es importante tener en cuenta que si
                    eliminas un reporte dentro de la papelera, ya no habrá forma
                    de recuperarlo. Por lo tanto, te recomendamos leer
                    detenidamente las alertas de confirmación para evitar
                    eliminar reportes de manera accidental.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>3.- ¿Hay alguna forma de restaurar un reporte eliminado?</p>
                <img src={obtenerImagen3()} alt="" onClick={toggleDetalle3} />
              </div>
              {mostrarDetalle3 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Sí, dentro de "Reportes" contamos con una papelera de
                    reportes eliminados donde puedes restaurar los reportes que
                    eliminaste recientemente. Sin embargo, es importante tener
                    en cuenta que si decides eliminar un reporte desde la
                    papelera, ya no habrá manera de restaurarlo, por lo que te
                    recomendamos tener cuidado al manejar los reportes dentro de
                    la papelera.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  4.- ¿Qué acciones puedo realizar en el apartado de
                  visualización de reportes?
                </p>
                <img src={obtenerImagen4()} alt="" onClick={toggleDetalle4} />
              </div>
              {mostrarDetalle4 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Cada reporte está identificado por un número de folio,
                    fecha, fotografía, estado, dirección y el número de veces
                    que ha sido reportado. En esta sección, los usuarios pueden
                    realizar las siguientes acciones:
                    <br />
                    <ul>
                      <li>
                        <b>Filtrar los reportes por fecha:</b> En la esquina
                        superior izquierda, se puede filtrar cada reporte por
                        Rango Fechas con opciones como "Todos los tiempos",
                        "Hoy", "Esta semana", "Último mes", "Últimos 6 meses",
                        "Este año" y "Rango personalizado".
                      </li>
                      <li>
                        <b>Filtrar los reportes por alcaldía:</b> En la esquina
                        superior izquierda, se ofrece la posibilidad de filtrar
                        los reportes por alcaldía en los que se puede elegir
                        entre "Todas" o seleccionar cada alcaldía
                        individualmente.
                      </li>
                      <li>
                        <b>Filtrar los reportes por estado:</b> En la esquina
                        superior izquierda, los reportes pueden ser filtrados
                        por estado, en los que se incluyen opciones como
                        “Todos”, “Sin atender”, “En atención” y “Atendido”.{" "}
                      </li>
                      <li>
                        <b>Eliminar reporte:</b> Para eliminar un reporte, al
                        pasar el mouse sobre cada uno, aparece la opción
                        "ELIMINAR" junto a "#REPORTADO" en el lado derecho. Al
                        hacer clic, se despliega una alerta solicitando
                        confirmación de eliminación con el folio del reporte. Si
                        se selecciona eliminar, el reporte será trasladado a la
                        papelera, en caso de poner la opción de cancelar, el
                        reporte seguirá mostrándose.{" "}
                      </li>
                      <li>
                        {" "}
                        <b>Acceso a la papelera:</b> En la esquina superior
                        derecha, se ubica la papelera que contiene los reportes
                        eliminados. Cada uno conserva su identificación,
                        añadiendo las opciones de “RESTAURAR” para devolver el
                        reporte al panel de visualización de reportes y
                        “ELIMINAR” para eliminarlo permanentemente.{" "}
                      </li>
                    </ul>
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  5.- ¿Qué debo hacer si experimento problemas técnicos al usar
                  el sistema?
                </p>
                <img src={obtenerImagen5()} alt="" onClick={toggleDetalle5} />
              </div>
              {mostrarDetalle5 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Si experimentas problemas técnicos al usar el sistema te
                    recomendamos ir a nuestro apartado de "Soporte" en el que a
                    través de un formulario podrás reportar los problemas
                    técnicos que encuentres y nuestro equipo se encargará de
                    procesar tu reporte para resolver el problema lo antes
                    posible.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  6.- ¿Qué tipo de problemas puedo reportar a través del
                  formulario de soporte?
                </p>
                <img src={obtenerImagen6()} alt="" onClick={toggleDetalle6} />
              </div>
              {mostrarDetalle6 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Entre los problemas que se pueden reportar se encuentran los
                    errores en el funcionamiento del sistema, dificultades
                    técnicas al acceder a ciertas funciones, problemas de
                    rendimiento, errores de visualización o cualquier otra
                    dificultad que encuentres mientras utilizas el sistema.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  7.- ¿Cómo puedo verificar el estado de mi solicitud de
                  soporte?
                </p>
                <img src={obtenerImagen7()} alt="" onClick={toggleDetalle7} />
              </div>
              {mostrarDetalle7 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Para verificar el estado de su solicitud lo podrá ver en el
                    mismo módulo de soporte. Su ticket contendrá un apartado de
                    estado, donde podrá ver si está en proceso, resuelto o
                    enviado. Una vez que su solicitud sea atendida y resuelta,
                    verá que su estado cambia a "Resuelto". De esta manera,
                    podrá mantenerse al tanto del progreso y la resolución de su
                    solicitud.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  8.- ¿Cuál es el tiempo de respuesta esperado para los
                  problemas reportados a través del formulario de soporte?
                </p>
                <img src={obtenerImagen8()} alt="" onClick={toggleDetalle8} />
              </div>
              {mostrarDetalle8 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    El tiempo de respuesta esperado para los problemas
                    reportados a través del formulario de soporte dependerá del
                    tipo de error detectado por el usuario. Sin embargo, este
                    tendrá un plazo máximo de 24 horas después de haber enviado
                    el formulario para el ticket.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  9.- ¿Cuál es el horario de atención del equipo de soporte
                  técnico?
                </p>
                <img src={obtenerImagen9()} alt="" onClick={toggleDetalle9} />
              </div>
              {mostrarDetalle9 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    El horario de atención del equipo de soporte técnico es de
                    11:00 AM a 6:00 PM en el cual estaremos listos para procesar
                    y resolver cualquier problema técnico que puedas presentar.
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>
                  10.- ¿Cómo puedo descargar la aplicación móvil para reportar
                  baches en la Ciudad de México?
                </p>
                <img src={obtenerImagen10()} alt="" onClick={toggleDetalle10} />
              </div>
              {mostrarDetalle10 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Para descargar nuestra aplicación móvil dirígete al apartado
                    de "Inicio" antes de iniciar sesión, al final de esta
                    sección encontrarás un botón de "Descargar la Aplicación".
                    Haz clic en ese botón y podrás descargar la aplicación móvil
                    directamente a tu dispositivo. Una vez descargada, podrás
                    empezar a utilizarla para el reporte de baches de manera
                    rápida y sencilla.
                    <br />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="seccion-oculta">
        <div className="container_FormularioSoporte">
          <div className="containerFR">
            <br />
            <form onSubmit={handleSubmit}>
              <table className="table_form_sp">
                <thead>
                  <tr>
                    <td className="filita" colSpan="2">
                      <h2 id="titulo_sp">
                        👷 Formulario de Soporte Técnico 🛠️
                      </h2>
                    </td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="columna_soporte_1">
                      <label>Seleccione el error:</label>
                    </td>
                    <td className="columna_soporte_2">
                      <div className="select">
                        <select
                          value={errorSeleccionado}
                          onChange={handleError}
                        >
                          <option>Tipo de Error</option>
                          {catalogoErrores.map((errorSeleccionado, index) => (
                            <option key={index} value={errorSeleccionado.clave}>
                              {`${errorSeleccionado.nombre}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="columna_soporte_1">
                      <label>Módulo donde se encontró el error: </label>
                    </td>
                    <td className="columna_soporte_2">
                      <div className="select">
                        <select
                          value={selectedRutaError}
                          onChange={handleRutaError}
                        >
                          <option>Módulo del Error</option>
                          {catalogoRutaErrores.map((errorOption, index) => (
                            <option key={index} value={errorOption.ruta}>
                              {`${errorOption.modulo}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="columna_soporte_1">
                      <label>Carácter de error:</label>
                    </td>
                    <td className="columna_soporte_2">
                      <div className="select">
                        <select
                          value={asignarTarea}
                          onChange={handleAsignarTarea}
                        >
                          <option>Escoger carácter de error</option>
                          <option value="Backend">🖥️ Funcionalidad</option>
                          <option value="Frontend">🎨 Diseño</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="columna_soporte_1">
                      <label>Seleccione su sistema operativo: </label>
                    </td>
                    <td className="columna_soporte_2">
                      <div className="select">
                        <select value={sistemaOperativo} onChange={handleSO}>
                          <option value="">Sistema Operativo</option>
                          {catalogoSistemaOperativo.map((sistema, index) => (
                            <option key={index} value={sistema}>
                              {`${sistema}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="columna_soporte_1">
                      <label>Seleccione su navegador: </label>
                    </td>
                    <td className="columna_soporte_2">
                      <div className="select">
                        <select value={navegador} onChange={handleNavegador}>
                          <option value="">Navegador</option>
                          {catalogoNavegadores.map((navegador, index) => (
                            <option key={index} value={navegador}>
                              {`${navegador}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="columna_soporte_1">
                      <label>Adjuntar fotografía del problema: </label>
                    </td>
                    <td className="columna_soporte_2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFoto}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="columna_soporte_1">
                      <label>Descripción del problema: </label>
                    </td>
                    <td className="columna_soporte_2">
                      <div className="wrapper">
                        <textarea
                          ref={textareaRef}
                          value={descripcionProblema}
                          onChange={handleDescripcionProblema}
                          rows="1" // Esto evita que el textarea se ajuste automáticamente en altura
                          cols="50"
                          placeholder="El error se encontró en..."
                          style={{ resize: "none" }} // Esto evita que el usuario pueda ajustar manualmente el tamaño del textarea
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="filita" colSpan="2">
                      <br />
                      <button type="submit" id="submit">
                        Enviar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
            </form>
          </div>
        </div>
        <br /> <br />
        <div className="container_table_">
          <table className="ticket-table">
            <thead>
              <tr className="sticky-top">
                <th>Nombre</th>
                <th>Correo</th>
                <th>Area Encargada</th>
                <th>Descripcion del Problema</th>
                <th>Estado del Ticket</th>
                <th>Fecha De Envio</th>
                <th>Fecha De Resolución</th>
              </tr>
            </thead>
            <tbody>
              {ticket.map((ticket, index) => (
                <tr key={index}>
                  <td>{ticket.nom}</td>
                  <td>{ticket.corr}</td>
                  <td>{ticket.areas}</td>
                  <td>{ticket.dP}</td>
                  <td>{ticket.estado}</td>
                  <td>{formatTimestamp(ticket.fechaDeEnvio)}</td>
                  <td>{formatTimestamp(ticket.fechaResuelto)}</td>
                  <td>
                    <button
                      className="detallitos"
                      onClick={() => openModal(ticket.folio)}
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <p id="titulin_">Detalles del ticket 📑</p>
                <p>Prioridad: {ticketEncontrado.priori}</p>
                <p>Estado: {ticketEncontrado.estado}</p>
                <p>
                  Fecha Asignado:{" "}
                  {formatTimestamp(ticketEncontrado.fechaAsignado)}
                </p>
                <p>
                  Fecha De Envio:{" "}
                  {formatTimestamp(ticketEncontrado.fechaDeEnvio)}
                </p>
                <p>
                  Fecha De Resuelto:{" "}
                  {formatTimestamp(ticketEncontrado.fechaResuleto)}
                </p>
                <p>Folio: {ticketEncontrado.folio}</p>
                <p>Area: {ticketEncontrado.areas}</p>
                <p>Navegador: {ticketEncontrado.navegador}</p>
                <p>Sistema Operativo: {ticketEncontrado.sistemaOperativo}</p>
                <p>Tipo de error: {ticketEncontrado.errorE}</p>
                <p>Ruta: {ticketEncontrado.rutaE}</p>
                <p>
                  <button className="detallitos" onClick={closeModal}>
                    Cerrar
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
        </div>

      </div>
    </div>
  );
}
export default Soporte;
