"use client";
import React, { useState, useEffect, useContext } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";
 
import {  auth, db } from "../../../../../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../../../../../context/AuthContext";
import "./Reportes.css";

function Soporte() {
  useAuthUser();
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
  const [descripcionProblema, setDescripcionProblema] =
    useState("Sin descripcion");

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
    { ruta: "/Cuenta/Administrador", modulo: "Inicio de Sesión" },
    { ruta: "/Administrador/Dashboard", modulo: "Dashboard" },
    { ruta: "/Administrador/Mapa", modulo: "Mapa" },
    { ruta: "/Administrador/NuevoAdmin", modulo: "Nuevo Administrador" },
    { ruta: "/Administrador/Reportes", modulo: "Reportes" },
    { ruta: "/Administrador/Papelera", modulo: "Reportes" },
    { ruta: "Otros", modulo: "Otra opción" },
  ];
 
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
    { clave: "T001", nombre: "Error al Enviar Ticket" },
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
    "Otro",
  ];

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
    setFoto(e.target.files[0]);
  };


  const handleDescripcionProblema = (e) => {
    setDescripcionProblema(e.target.value);
    console.log(descripcionProblema);
  };

  const handleFileUpload = async () => {
   
    console.log("first")
   /* 
    const storage = getStorage(appSoporte);
    const randomId = Math.random().toString(36).substring(7);
    const imageName = `Ticket_${randomId}`;
    const storageRef = ref(
      storage,
      `ImagenesTickets/${userData.uid}/${imageName}`
    );
    await uploadBytes(storageRef, archivito);
    return getDownloadURL(storageRef); */
  };
  // Acá va toda la lógica
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = userData.uid;
    const correoA = userData.correo;
    const nombre = userData.nombre
    const area = asignarTarea;

    if (!foto) {
      console.error("No se ha seleccionado ninguna foto");
      return;
    }

    const formData = new FormData();
    formData.append("file", foto);
    formData.append("uid", uid);
    formData.append("errorSeleccionado", errorSeleccionado);
    formData.append("sistemaOperativo", sistemaOperativo);
    formData.append("navegador", navegador);
    formData.append("selectedRutaError", encodeURIComponent(selectedRutaError));
    formData.append("descripcionProblema", descripcionProblema);
    formData.append("correoA", correoA);
    formData.append("nombre", nombre);
    formData.append("area", area);

  let res = prompt("¿Desea levantar el ticket? (SI/NO)");
  if (res.toUpperCase() === "SI") {
  try { 

        const ticketResponse = await fetch(
          `http://localhost:3001/api/Ticket/${userData.nombre}/${uid}/${errorSeleccionado}/${sistemaOperativo}/${navegador}/${encodeURIComponent(
            selectedRutaError
          )}/${descripcionProblema}/${correoA}/${nombre}/${area}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: formData,
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
    console.error("Error:", error);
  }
 }


   
  };
  
  return (
    <div className="bodySoporte">
      <div className="containerSoporte">
        <div className="containerPF">
          <h1>PREGUNTAS FRECUENTES ❓❓❓</h1>
        </div>
      </div>
      <div className="main-containerReportes">
        <br />
        <br />
        <br />
        <br />
        <h2>Hola este es un formulario para el soporte :D</h2>

        <form onSubmit={handleSubmit}>
          <label>Seleccione el error:</label>
          <select value={errorSeleccionado} onChange={handleError}>
            <option>Tipo de Error</option>
            {catalogoErrores.map((errorSeleccionado, index) => (
              <option key={index} value={errorSeleccionado.clave}>
                {`${errorSeleccionado.nombre}`}
              </option>
            ))}
          </select>
          <br />
          <br />
          <br />
          <label>Módulo donde se encontró el error: </label>
          <select value={selectedRutaError} onChange={handleRutaError}>
            <option>Módulo del Error</option>
            {catalogoRutaErrores.map((errorOption, index) => (
              <option key={index} value={errorOption.ruta}>
                {`${errorOption.modulo}`}
              </option>
            ))}
          </select>
          <br />
          <br />
          <br />
          <label>Carácter de error</label>
          <select value={asignarTarea} onChange={handleAsignarTarea}>
           <option >Escoger carácter de error</option>
           <option value="backend">Funcionalidad</option>
           <option value="frontend">Diseño</option>
          </select>
          <label>Seleccione su sistema operativo: </label>
          <select value={sistemaOperativo} onChange={handleSO}>
            <option value="">Seleccionar</option>
            {catalogoSistemaOperativo.map((sistema, index) => (
              <option key={index} value={sistema}>
                {`${sistema}`}
              </option>
            ))}
          </select>
          <br />
          <br />
          <br />

          <label>Seleccione su navegador: </label>
          <select value={navegador} onChange={handleNavegador}>
            <option value="">Seleccionar</option>
            {catalogoNavegadores.map((navegador, index) => (
              <option key={index} value={navegador}>
                {`${navegador}`}
              </option>
            ))}
          </select>
          <br />
          <br />
          <br />

          <label>Adjuntar fotografía del problema: </label>
          <input type="file" accept="image/*" onChange={handleFoto} />
          <br />
          <br />
          <br />

          <label>Descripción del problema: </label>
          <textarea
            value={descripcionProblema}
            onChange={handleDescripcionProblema}
            rows="4"
            cols="50"
          />
          <br />
          <br />
          <br />

          <button type="submit" id="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Soporte;
