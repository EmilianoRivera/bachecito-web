"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";
import { app, auth, db } from "../../../../../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../../../../../context/AuthContext";
import RutaProtegida from "@/components/RutaProtegida";
import "./Reportes.css";
import "./Soporte.css";


function Soporte() {
  useAuthUser();
  const [fecha, setFecha] = useState('');
  const [rutaError, setRutaError] = useState('');
  const textareaRef = useRef(null);
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [errorSeleccionado, setErrorSeleccionado] = useState("S001");
  const [sistemaOperativo, setSistemaOperativo] = useState(
    "No se ha seleccionado un sistema operativo"
  );
  const [asignarTarea, setAsignarTarea] = useState("-")
  const [navegador, setNavegador] = useState(
    "No se ha seleccionado un navegador"
  );
  const [selectedRutaError, setSelectedRutaError] = useState("/NoEspecificado");
  const [foto, setFoto] = useState("");
  const [descripcionProblema, setDescripcionProblema] = useState("");

  const [mostrarDetalle1, setMostrarDetalle1] = useState(false);
  const [mostrarDetalle2, setMostrarDetalle2] = useState(false);
  const [mostrarDetalle3, setMostrarDetalle3] = useState(false);
  const [mostrarDetalle4, setMostrarDetalle4] = useState(false);

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

  // Función para cambiar la imagen
  const obtenerImagen1 = () => {
    return mostrarDetalle1 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
  };

  const obtenerImagen2 = () => {
    return mostrarDetalle2 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
  };

  const obtenerImagen3 = () => {
    return mostrarDetalle3 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
  };

  const obtenerImagen4 = () => {
    return mostrarDetalle4 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
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
  const catalogoRutaErrores = [
    { ruta: "/Cuenta/Administrador", modulo: "✅Inicio de Sesión" },
    { ruta: "/Administrador/Dashboard", modulo: "📊 Dashboard" },
    { ruta: "/Administrador/Mapa", modulo: "🗺️ Mapa" },
    { ruta: "/Administrador/NuevoAdmin", modulo: "👤 Nuevo Administrador" },
    { ruta: "/Administrador/Reportes", modulo: "⚠️ Reportes" },
    { ruta: "/Administrador/Papelera", modulo: "⚠️ Reportes" },
    { ruta: "Otros", modulo: "🔄️ Otra opción" },
  ];
  /*
  Inicio de sesion , Nuevo Administrador, Otros -> ALTA
  DASH, MAPA, REPORTES, PAPELERA -> Media
  */

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



  // Obtener fecha actual al cargar el componente
  /*
  useEffect(() => {
    const obtenerFechaActual = () => {
      const fechaActual = new Date();
      const dia = fechaActual.getDate();
      const mes = fechaActual.getMonth() + 1;
      const año = fechaActual.getFullYear();
      const fechaFormateada = `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${año}`;
      setFecha(fechaFormateada);
    };

    obtenerFechaActual();
  }, []);
  */

  // Funciones para manejar los cambios en el select de errores y sistemas operativos


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
    const asignar = e.target.value
    setAsignarTarea(asignar)
    console.log(asignar)
  }
  const handleNavegador = (e) => {
    const selectedNavegador = e.target.value;
    setNavegador(selectedNavegador);
    console.log(selectedNavegador);
  };

  const handleRutaError = (e) => {
    const ruta = e.target.value;
    console.log(e.target.value)
    setSelectedRutaError(ruta);
  };

  const handleFoto = (e) => {
    setFoto(e.target.value);
  };

  const handleDescripcionProblema = (e) => {
    setDescripcionProblema(e.target.value);
    console.log(descripcionProblema);
    // Ajustar la altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleFileUpload = async () => {
    const archivo = document.querySelector('input[type="file"]');
    const archivito = archivo.files[0];

    if (!archivito) {
      console.error("No se ha seleccionado ningún archivo");
      return;
    }

    const storage = getStorage(app);
    const randomId = Math.random().toString(36).substring(7);
    const imageName = `Ticket_${randomId}`;
    const storageRef = ref(
      storage,
      `ImagenesTickets/${userData.uid}/${imageName}`
    );
    await uploadBytes(storageRef, archivito);
    return getDownloadURL(storageRef);
  };
  // Acá va toda la lógica
  const handleSubmit = async (e) => {
    e.preventDefault();

    const correoA = userData.correo;
    const nombre = userData.nombre;
    const area = asignarTarea
    const url = await handleFileUpload();
    const parametros = {
      errorSeleccionado: errorSeleccionado,
      sistemaOperativo: sistemaOperativo,
      navegador: navegador,
      selectedRutaError: encodeURIComponent(selectedRutaError),
      descripcionProblema: descripcionProblema,
      correoA: correoA,
      nombre: nombre,
      url: encodeURIComponent(url),
      area: area
    };
    let res = prompt("A la hora de levantar el ticket, vamos a recuperar su información para darle seguimiento a su ticket, desea aceptar?")
    if (res === "SI") {
      try {
        const response = await fetch(
          `http://localhost:3001/api/Ticket/${errorSeleccionado}/${sistemaOperativo}/${navegador}/${encodeURIComponent(
            selectedRutaError
          )}/${descripcionProblema}/${correoA}/${nombre}/${encodeURIComponent(url)}/${area}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(parametros),
          }
        );

        if (response.ok) {
          console.log("Formulario enviado con éxito");
        } else {
          console.error("Error al enviar el formulario:", response.status);
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    } else {
      alert("NO SE LEVANTARA SU TICKET")
    }

  };

  return (
    <RutaProtegida>
      <div className="bodySoporte">
        <div className="containerSoporte">
          <div className='containerPF'>
            <h1 id='titulo_pf'>PREGUNTAS FRECUENTES 👀❓❓❓</h1>
            <div className="todas_las_pf">
              <div className='container_preguntaFrecuente'>
                <div className='pf'>
                  <p>1.- ¿Cómo instalo la app móvil de Bachecito 26?</p>
                  <img src={obtenerImagen1()} alt="" onClick={toggleDetalle1} />
                </div>
                {mostrarDetalle1 && (
                  <div className="descripcion_pf">
                    <p>
                      <br />
                      Detalle de la respuesta a la pregunta frecuente 1.
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
                      <br />
                    </p>
                  </div>
                )}
              </div>

              <br />

              <div className='container_preguntaFrecuente'>
                <div className='pf'>
                  <p>2.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                  <img src={obtenerImagen2()} alt="" onClick={toggleDetalle2} />
                </div>
                {mostrarDetalle2 && (
                  <div className="descripcion_pf">
                    <p>
                      <br />
                      Detalle de la respuesta a la pregunta frecuente 2.
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
                      <br />
                    </p>
                  </div>
                )}
              </div>

              <br />

              <div className='container_preguntaFrecuente'>
                <div className='pf'>
                  <p>2.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                  <img src={obtenerImagen3()} alt="" onClick={toggleDetalle3} />
                </div>
                {mostrarDetalle3 && (
                  <div className="descripcion_pf">
                    <p>
                      <br />
                      Detalle de la respuesta a la pregunta frecuente 2.
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
                      <br />
                    </p>
                  </div>
                )}
              </div>

              <br />

              <div className='container_preguntaFrecuente'>
                <div className='pf'>
                  <p>2.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                  <img src={obtenerImagen4()} alt="" onClick={toggleDetalle4} />
                </div>
                {mostrarDetalle4 && (
                  <div className="descripcion_pf">
                    <p>
                      <br />
                      Detalle de la respuesta a la pregunta frecuente 2.
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
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
                      <td className="filita" colSpan="2"><h2 id='titulo_sp'>Formulario de Soporte Técnico 👷</h2></td>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="columna_soporte_1"><label>Seleccione el error ❌:</label></td>
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
                      <td className="columna_soporte_1"><label>Módulo donde se encontró el error 🔍: </label></td>
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
                      <td className="columna_soporte_1"><label>Carácter de error 👀:</label></td>
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
                      <td className="columna_soporte_1"><label>Seleccione su sistema operativo 🖥️: </label></td>
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
                      <td className="columna_soporte_1"><label>Seleccione su navegador 🌎: </label></td>
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
                      <td className="columna_soporte_1"><label>Adjuntar fotografía del problema 📸: </label></td>
                      <td className="columna_soporte_2">
                        <input type="file" accept="image/*" onChange={handleFoto} />
                      </td>
                    </tr>

                    <tr>
                      <td className="columna_soporte_1"><label>Descripción del problema 📝: </label></td>
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
              </form>

              {/*
              <form onSubmit={handleSubmit}>

                
                <label>Fecha:</label>
                <input type="text" defaultValue={fecha} readOnly/>
                <br /><br />

                <h5>Obtener nombre del usuario acá</h5>
                <br />

                <h5>Obtener correo del usuario acá</h5>
                <br />
              

                <label>Seleccione el error ❌:</label>
                <br />
                <div className='select'>
                  <select value={errorSeleccionado} onChange={handleError}>
                    <option value="">Seleccionar</option>
                    {catalogoErrores.map((error, index) => (
                      <option key={index} value={error.nombre}>
                        {`${error.nombre}`}
                      </option>
                    ))}
                  </select>
                </div>

                <br /><br /><br />

                <label>Seleccione su sistema operativo 🖥️: </label>
                <br />
                <div className='select'>
                  <select value={sistemaOperativo} onChange={handleSO}>
                    <option value="">Seleccionar</option>
                    {catalogoSistemaOperativo.map((sistema, index) => (
                      <option key={index} value={sistema}>
                        {`${sistema}`}
                      </option>
                    ))}
                  </select>
                </div>

                <br /><br /><br />

                <label>Seleccione su navegador 🌎: </label>
                <br />
                <div className='select'>
                  <select
                    value={navegador}
                    onChange={handleNavegador}
                  >
                    <option value="">Seleccionar</option>
                    {catalogoNavegadores.map((navegador, index) => (
                      <option key={index} value={navegador}>
                        {`${navegador}`}
                      </option>
                    ))}
                  </select>
                </div>

                <br /><br /><br />

                <label>Ruta donde se encontró el error 🔍: </label>
                <br />
                <input
                  type="text"
                  value={rutaError}
                  onChange={handleRutaError}
                />
                <br /><br /><br />

                <label>Adjuntar fotografía del problema 📸: </label>
                <br />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFoto}
                />
                
                <br /><br /><br />

                <div className="wrapper">
                  <label>Descripción del problema 📝: </label>
                  <br />
                  <textarea
                    ref={textareaRef}
                    value={descripcionProblema}
                    onChange={handleDescripcionProblema}
                    rows="1" // Esto evita que el textarea se ajuste automáticamente en altura
                    cols="50"
                    placeholder="Se encontró un error en..."
                    style={{ resize: 'none' }} // Esto evita que el usuario pueda ajustar manualmente el tamaño del textarea
                  />
                </div>

                <br /><br /><br />

                <button type="submit" id="submit">Enviar</button>

              </form>
              */}

              <br /><br />
            </div>
          </div>
        </div>
      </div>
    </RutaProtegida>
  );
}

export default Soporte;


