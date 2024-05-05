"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";
import { auth, db , app2, app} from "../../../../../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../../../../../context/AuthContext";
import "./Soporte.css";

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
  const [descripcionProblema, setDescripcionProblema] =
    useState("");

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
        const userResponse = await fetch(`/api/Usuario/${uid}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userDatas = await userResponse.json();

        setUserData(userDatas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    
  }, []);

  
  useEffect(() => {
    async function fetchTickets() {
      try {
        if (!userData || !userData.uid) {
          console.error("UserData is not available or invalid");
          return;
        }
  
        const uid = userData.uid;
        const ticketsData = await fetch(`http://localhost:3000/api/Ticket/${uid}`);
        if (!ticketsData.ok) {
          throw new Error("Failed to fetch tickets data");
        }
        console.log("first");
        const tickets = await ticketsData.json();
        console.log("VA POR AQUI", tickets);
        setTickets(tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
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
 
    const ticketEncontrados = ticket.find(ticket => ticket.folio === folio);
    if (ticketEncontrados) { 
      console.log("Ticket encontrado:", ticketEncontrados);
      setTicketEncontrado(ticketEncontrados)
    } else {
      console.log("No se encontró ningún ticket con el folio:", folio);
    }
    setShowModal(true);
  }

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
    console.log(selectedErr);
  };

  const handleSO = (e) => {
    const selectedSO = e.target.value;
    setSistemaOperativo(selectedSO);
    console.log(selectedSO);
  };

  const handleAsignarTarea = (e) => {
    const asignar = e.target.value;
    setAsignarTarea(asignar);
    console.log(asignar);
  };
  const handleNavegador = (e) => {
    const selectedNavegador = e.target.value;
    setNavegador(selectedNavegador);
    console.log(selectedNavegador);
  };

  const handleRutaError = (e) => {
    const ruta = e.target.value;
    console.log(e.target.value);
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
    console.log(descripcionProblema);
    // Ajustar la altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleFileUpload = async () => {
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
    const correoA = userData.correo;
    const nombre = userData.nombre;
    const area = asignarTarea;
    const uid = userData.uid;
      const url = await handleFileUpload();
     
    let res = prompt("¿Desea levantar el ticket? (SI/NO)");
    if (res.toUpperCase() === "SI") {
      try {
        const ticketResponse = await fetch(
          `http://localhost:3001/api/Ticket/${url}/${uid}/${errorSeleccionado}/${sistemaOperativo}/${navegador}/${encodeURIComponent(
            selectedRutaError
          )}/${descripcionProblema}/${correoA}/${nombre}/${area}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url,
              uid: uid,
              errorSeleccionado,
              sistemaOperativo,
              navegador,
              selectedRutaError: encodeURIComponent(selectedRutaError),
              descripcionProblema,
              correoA,
              nombre,
              area,
            }),
          }
        );

        if (ticketResponse.ok) {
          console.log("Formulario enviado con éxito");
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


  //LETRITAS COOL DE PF
  const routerPF = useRouter();
    useEffect(() => {
        const mouse = newV2();
        const center = newV2();
        const distanceFromCenter = newV2();
        const distanceLerped = newV2();
        let simulateMouseMovement = true;

        const perspective = 500;
        const translateZ = -22;
        const rotate = 1.5;
        const skew = 3;

        const containerReportes = document.getElementById("containerLetritasPF");
        const copies = document.getElementsByClassName("copyPF");

        function updateCenter() {
            const rect = containerReportes.getBoundingClientRect();
            center.x = rect.left + rect.width / 2;
            center.y = rect.top + rect.height / 2;
        }

        function trackMousePosition(event) {
            simulateMouseMovement = false;
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            distanceFromCenter.x = center.x - mouse.x;
            distanceFromCenter.y = center.y - mouse.y;
        }

        function fakeMousePosition(t) {
            distanceFromCenter.x = Math.sin(t / 500) * window.innerWidth * 0.5;
            distanceFromCenter.y = Math.cos(t / 500) * window.innerWidth * 0.2;
        }

        function updateTextPosition(t) {
            if (simulateMouseMovement) fakeMousePosition(t);

            lerpV2(distanceLerped, distanceFromCenter);

            for (var i = 1; i < copies.length + 1; i++) {
                const copy = copies[i - 1];
                copy.style.transform = makeTransformString(
                    i * distanceLerped.y * 0.05,
                    i * translateZ,
                    i * rotate * (distanceLerped.x * 0.003),
                    i * skew * (distanceLerped.x * 0.003)
                );
            }

            requestAnimationFrame(updateTextPosition);
        }

        function makeTransformString(y, z, rotate, skew) {
            return `perspective(${perspective}px) translate3d(0px, ${y}px, ${z}px) rotate(${rotate}deg) skew(${skew}deg)`;
        }

        function lerpV2(position, targetPosition) {
            position.x += (targetPosition.x - position.x) * 0.2;
            position.y += (targetPosition.y - position.y) * 0.2;
        }

        function newV2(x = 0, y = 0) {
            return {
                x: x,
                y: y
            };
        }

        updateCenter();
        document.addEventListener("mousemove", trackMousePosition);
        window.addEventListener("resize", updateCenter);
        requestAnimationFrame(updateTextPosition);

        return () => {
            document.removeEventListener("mousemove", trackMousePosition);
            window.removeEventListener("resize", updateCenter);
        };
    }, [routerPF]);


  return (
    <div className="bodySoporte">
      <div className="containerSoporte">
        <div className="containerPF">

          <div className="boxPF" id="boxPF">
                <div className="containerLetritasPF" id="containerLetritasPF">
                    <header>
                        <h1>Preguntas Frecuentes</h1>
                        <span aria-hidden="true" className="copyPF copy-1_PF">Preguntas Frecuentes</span>
                        <span aria-hidden="true" className="copyPF copy-2_PF">Preguntas Frecuentes</span>
                        <span aria-hidden="true" className="copyPF copy-3_PF">Preguntas Frecuentes</span>
                        <span aria-hidden="true" className="copyPF copy-4_PF">Preguntas Frecuentes</span>
                    </header>
                </div>
            </div>

          <div className="todas_las_pf">
            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>1.- ¿Cómo instalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen1()} alt="" onClick={toggleDetalle1} />
              </div>
              {mostrarDetalle1 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 1. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>2.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen2()} alt="" onClick={toggleDetalle2} />
              </div>
              {mostrarDetalle2 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 2. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>3.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen3()} alt="" onClick={toggleDetalle3} />
              </div>
              {mostrarDetalle3 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 3. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br />

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>4.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen4()} alt="" onClick={toggleDetalle4} />
              </div>
              {mostrarDetalle4 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 4. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>5.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen5()} alt="" onClick={toggleDetalle5} />
              </div>
              {mostrarDetalle5 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 4. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>6.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen6()} alt="" onClick={toggleDetalle6} />
              </div>
              {mostrarDetalle6 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 4. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>
            
            <br/>

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>7.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen7()} alt="" onClick={toggleDetalle7} />
              </div>
              {mostrarDetalle7 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 4. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>8.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen8()} alt="" onClick={toggleDetalle8} />
              </div>
              {mostrarDetalle8 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 4. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>9.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen9()} alt="" onClick={toggleDetalle9} />
              </div>
              {mostrarDetalle9 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 4. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className="container_preguntaFrecuente">
              <div className="pf">
                <p>10.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen10()} alt="" onClick={toggleDetalle10} />
              </div>
              {mostrarDetalle10 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 4. Lorem
                    ipsum dolor sit amet consectetur, adipisicing elit. Harum
                    aspernatur inventore optio cumque eius. Quisquam facilis quo
                    possimus omnis veniam, provident odit architecto dolore,
                    minima, placeat maiores alias sed recusandae. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Deleniti
                    suscipit labore quo molestiae quis illo sunt nulla
                    cupiditate magni voluptatem eos aliquam impedit mollitia
                    officia, minus distinctio ullam voluptates earum?
                    <br />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='container_FormularioSoporte'>
            <div className='containerFR'>
              <br />
              <form onSubmit={handleSubmit}>

                <table className='table_form_sp'>
                  <thead>
                    <tr>
                      <td className="filita" colSpan="2"><h2 id='titulo_sp'>👷 Formulario de Soporte Técnico 🛠️</h2></td>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="columna_soporte_1"><label>Seleccione el error:</label></td>
                      <td className="columna_soporte_2">
                        <div className="select">
                          <select value={errorSeleccionado} onChange={handleError}>
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
                      <td className="columna_soporte_1"><label>Módulo donde se encontró el error: </label></td>
                      <td className="columna_soporte_2">
                        <div className="select">
                          <select value={selectedRutaError} onChange={handleRutaError}>
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
                      <td className="columna_soporte_1"><label>Carácter de error:</label></td>
                      <td className="columna_soporte_2">
                        <div className="select">
                          <select value={asignarTarea} onChange={handleAsignarTarea}>
                            <option >Escoger carácter de error</option>
                            <option value="backend">🖥️ Funcionalidad</option>
                            <option value="frontend">🎨 Diseño</option>
                          </select>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="columna_soporte_1"><label>Seleccione su sistema operativo: </label></td>
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
                      <td className="columna_soporte_1"><label>Seleccione su navegador: </label></td>
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
                      <td className="columna_soporte_1"><label>Adjuntar fotografía del problema: </label></td>
                      <td className="columna_soporte_2">
                        <input type="file" accept="image/*" onChange={handleFoto} />
                      </td>
                    </tr>

                    <tr>
                      <td className="columna_soporte_1"><label>Descripción del problema: </label></td>
                      <td className="columna_soporte_2">
                        <div className="wrapper">
                          <textarea
                            ref={textareaRef}
                            value={descripcionProblema}
                            onChange={handleDescripcionProblema}
                            rows="1" // Esto evita que el textarea se ajuste automáticamente en altura
                            cols="50"
                            placeholder="El error se encontró en..."
                            style={{ resize: 'none' }} // Esto evita que el usuario pueda ajustar manualmente el tamaño del textarea
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
                <br/>
              </form>
          </div>
        </div>

        <br /> <br />
          <div className="">
              <table>
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
                    <td>{ticket.nombre}</td>
                    <td>{ticket.correoA}</td>
                    <td>{ticket.area}</td>
                    <td>{ticket.descripcionProblema}</td>
                    <td>{ticket.estado}</td>
                    <td>{formatTimestamp(ticket.fechaDeEnvio)}</td>
                    <td>{formatTimestamp(ticket.fechaResuelto)}</td>
                    <td><button onClick={() => openModal(ticket.folio)}>Detalles</button></td>
  
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
                   <p>Detalles del ticket</p>
       <p><button onClick = {closeModal}>Cerrar</button></p>
                    <p>Prioridad: {ticketEncontrado.priori}</p>
                    <p>Estado: {ticketEncontrado.estado}</p>
                   <p>Fecha Asignado: {formatTimestamp(ticketEncontrado.fechaAsignado)}</p>
                   <p>Fecha De Envio: {formatTimestamp(ticketEncontrado.fechaDeEnvio)}</p>
                   <p>Fecha De Resuelto: {formatTimestamp(ticketEncontrado.fechaResuleto)}</p>
                   <p>Folio: {ticketEncontrado.folio}</p>
                   <p>Area: {ticketEncontrado.area}</p>
                   <p>Navegador: {ticketEncontrado.navegador}</p>
                   <p>Sistema Operativo: {ticketEncontrado.sistemaOperativo}</p>
                   <p>Tipo de error: {ticketEncontrado.errorSeleccionado}</p>
                   <p>Ruta: {ticketEncontrado.rutitaD}</p>
                 </div>
               </div>
              )}

            </div>
      </div>
    </div>
  );
}
export default Soporte;

