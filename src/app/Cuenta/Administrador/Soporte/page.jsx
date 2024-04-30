"use client";
import React, { useState } from 'react';
import RutaProtegida from "@/components/RutaProtegida";
import "./Soporte.css";


function Soporte() {

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



  // Catálogo de errores
  const catalogoErrores = [
    { clave: "S001", nombre: "Error de Inicio de Sesión" },
    { clave: "S002", nombre: "Error de Registro" },
    { clave: "D001", nombre: "Error al Cargar Estadísticas" },
    { clave: "D002", nombre: "Error de Filtros" },
    { clave: "M001", nombre: "Error al Cargar el Mapa" },
    { clave: "M002", nombre: "Error de Ubicación" },
    { clave: "R001", nombre: "Error al Cargar los Reportes" },
    { clave: "R002", nombre: "Error al Cambiar estado de los Reportes" },
    { clave: "R003", nombre: "Error al Mover reportes a la papelera" },
    { clave: "P001", nombre: "Error al Visualizar reportes en la papelera" },
    { clave: "P002", nombre: "Error al Eliminar reportes de la papelera" },
    { clave: "S001", nombre: "Error al Enviar Ticket" },
    { clave: "0000", nombre: "Otro: (Especificar en Descripcion)" },
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
    "Otro"
  ];



  const [fecha, setFecha] = useState('');
  const [errorSeleccionado, setErrorSeleccionado] = useState('No se ha seleccionado un error');
  const [sistemaOperativo, setSistemaOperativo] = useState('No se ha seleccionado un sistema operativo');
  const [navegador, setNavegador] = useState('No se ha seleccionado un navegador');
  const [rutaError, setRutaError] = useState('');
  const [foto, setFoto] = useState('');
  const [descripcionProblema, setDescripcionProblema] = useState('');

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
    setSistemaOperativo(selectedSO);
    console.log(selectedSO);
  };

  const handleNavegador = (e) => {
    const selectedNavegador = e.target.value;
    setNavegador(selectedNavegador);
    console.log(selectedNavegador);
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

    try {
      const response = await fetch('/api/Soporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          errorSeleccionado,
          sistemaOperativo,
          navegador,
          rutaError,
          descripcionProblema
        })
      });

      if (response.ok) {
        console.log("Formulario enviado con éxito");
      } else {
        console.error("Error al enviar el formulario:", response.status);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  // Catálogo de errores, SO, versión de navegador, descripción del problema, ruta donde se encontró el error, evidencia fotográfica del problema, 
  // Internamente se obtiene fecha, prioridad con base al error seleccionado, número del ticket, su correo

  //<input type="text" value={fecha} readOnly />

  return (

    <RutaProtegida>
      <div className="bodySoporte">
        <div className="containerSoporte">
          <div className='containerPF'>
            <h1 id='titulo_pf'>PREGUNTAS FRECUENTES 👀❓❓❓</h1>

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

          <div className='container_FormularioSoporte'>
            <div className='containerFR'>
              <br /><br /><br /><br />
              <h2>Hola este es un formulario para el soporte :D</h2>

              <form onSubmit={handleSubmit}>

                {/* 
                <label>Fecha:</label>
                <input type="text" defaultValue={fecha} readOnly/>
                <br /><br />

                <h5>Obtener nombre del usuario acá</h5>
                <br />

                <h5>Obtener correo del usuario acá</h5>
                <br />
              */}

                <label>Seleccione el error:</label>
                <select value={errorSeleccionado} onChange={handleError}>
                  <option value="">Seleccionar</option>
                  {catalogoErrores.map((error, index) => (
                    <option key={index} value={error.nombre}>
                      {`${error.nombre}`}
                    </option>
                  ))}
                </select>
                <br /><br /><br />

                <label>Seleccione su sistema operativo: </label>
                <select value={sistemaOperativo} onChange={handleSO}>
                  <option value="">Seleccionar</option>
                  {catalogoSistemaOperativo.map((sistema, index) => (
                    <option key={index} value={sistema}>
                      {`${sistema}`}
                    </option>
                  ))}
                </select>
                <br /><br /><br />

                <label>Seleccione su navegador: </label>
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
                <br /><br /><br />

                <label>Ruta donde se encontró el error: </label>
                <input
                  type="text"
                  value={rutaError}
                  onChange={handleRutaError}
                />
                <br /><br /><br />

                <label>Adjuntar fotografía del problema: </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFoto}
                />
                <br /><br /><br />

                <label>Descripción del problema: </label>
                <textarea
                  value={descripcionProblema}
                  onChange={handleDescripcionProblema}
                  rows="4"
                  cols="50"
                />
                <br /><br /><br />

                <button type="submit" id="submit">Enviar</button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </RutaProtegida>

  );
}

export default Soporte;

