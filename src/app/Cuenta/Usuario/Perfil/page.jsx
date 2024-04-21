"use client";
import React, { useState, useEffect, useContext } from "react";
import "./perfil.css";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../../firebase";
import AuthContext from "../../../../../context/AuthContext";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";
import Image from "next/image";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import Alerta from "@/components/Alerta2";
import atendidoIcon from "../../../../imgs/fondoVerde.png";
import enProcesoIcon from "../../../../imgs/fondoAmarillo.png";
import sinAtenderIcon from "../../../../imgs/fondoRojo.png";
import { userAgentFromString } from "next/server";

export default function Perfil() {
  useAuthUser();
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [foliosGuardados, setFoliosGuardados] = useState([]);
  //Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLogged) {
        try {
          // Realizar la consulta para obtener los datos del usuario
          const userQuery = query(
            collection(db, "usuarios"),
            where("uid", "==", auth.currentUser.uid)
          );
          const userDocs = await getDocs(userQuery);

          // Si hay documentos en el resultado de la consulta
          if (!userDocs.empty) {
            // Obtener el primer documento (debería haber solo uno)
            const userDoc = userDocs.docs[0];
            // Obtener los datos del documento
            const userData = userDoc.data();
            // Establecer los datos del usuario en el estado
            setUserData(userData);
          } else {
            console.log("No se encontró el documento del usuario");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [isLogged]);

  //REPORTES
  useEffect(() => {
    const obtenerReportes = async () => {
      // Verificar si userData no es null y tiene la propiedad uid
      if (userData && userData.uid) {
        const reportesRef = collection(db, "reportes");
        const q = query(reportesRef, where("uidUsuario", "==", userData.uid));

        try {
          const querySnapshot = await getDocs(q);
          const fetchedReportes = [];
          querySnapshot.forEach((doc) => {
            fetchedReportes.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          console.log(
            "Reportes obtenidos de la base de datos:",
            fetchedReportes
          );
          setReportes(fetchedReportes);
        } catch (error) {
          console.error("Error al obtener reportes:", error);
        }
      }
    };
    obtenerReportes();
  }, [userData]);

  useEffect(() => {
    console.log("Estado actual de reportes:", reportes);
  }, [reportes]);
  ///FOLIOS
  useEffect(() => {
    console.log("Folios guardados:", foliosGuardados);
    // Guardar el array de folios en la base de datos cada vez que cambie
    guardarFoliosEnDB(foliosGuardados);
  }, [foliosGuardados]);

  // Función para guardar el array de folios en la base de datos
  // Función para guardar el array de folios en la base de datos
  const guardarFoliosEnDB = async (folio, userData) => {
    try {
      // Verificar si userData no es null y tiene la propiedad uid
      if (userData && userData.uid) {
        // Realizar una consulta para encontrar el documento del usuario
        const userQuery = query(
          collection(db, "usuarios"),
          where("uid", "==", userData.uid)
        );
  
        // Obtener el resultado de la consulta
        const userQuerySnapshot = await getDocs(userQuery);
  
        // Verificar si se encontró algún documento
        if (!userQuerySnapshot.empty) {
          // Obtener la referencia al primer documento encontrado
          const userDocRef = userQuerySnapshot.docs[0].ref;
  
          // Obtener el documento del usuario
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            // Obtener los datos actuales del documento del usuario
            const userData = userDocSnap.data();
            const foliosGuardadosAnteriores = userData.foliosGuardados || [];
  
            // Agregar el nuevo folio al array de folios guardados
            const nuevosFoliosGuardados = [...foliosGuardadosAnteriores, folio];
  
            // Actualizar el documento del usuario con el nuevo array de folios
            await updateDoc(userDocRef, {
              foliosGuardados: nuevosFoliosGuardados,
            });
  
            console.log("Folio guardado en la base de datos del usuario.");
          } else {
            console.error(
              "El documento del usuario no existe en la base de datos."
            );
          }
        } else {
          console.error(
            "No se encontró ningún documento de usuario que contenga el UID proporcionado."
          );
        }
      } else {
        console.error("No se proporcionaron datos de usuario válidos.");
      }
    } catch (error) {
      console.error("Error al guardar el folio en la base de datos:", error);
    }
  };
  const [windowWidth, setWindowWidth] = useState(0);
  const [showLeftSide, setShowLeftSide] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);

  useEffect(() => {
    // Handler para el cambio de tamaño de la ventana
    function handleResize() {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width <= 800) {
        setShowLeftSide(false);
        setShowToggleButton(true);
      } else {
        setShowLeftSide(true);
        setShowToggleButton(false);
      }
    }

    // Configuración inicial
    handleResize();

    // Agregar el listener del evento resize
    window.addEventListener("resize", handleResize);

    // Limpieza del listener del evento resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  //cerrar sesion y desactivar cuenta
  const CerrarSesion = () => {
    signOut(auth)
      .then(() => {
        console.log("Cierre de sesión exitoso");
        router.push("/Cuenta");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  const eliminarCuenta = async () => {
    try {
      const reportesRef = collection(db, "usuarios");
      const q = query(reportesRef, where("uid", "==", userData.uid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { estadoCuenta: false });
        console.log("cuenta desactivada");
        alert("Cuenta desactivada, esperamos verte de nuevo(:");
        CerrarSesion();
      });
    } catch (error) {
      console.error("Error al desactivar la cuenta:", error);
    }
  };

  return (
    <div className="container-perfil">
      <Alerta pageId="Pagina-Perfil"></Alerta>
      {isLogged && userData && (
        <div id="leftSide" style={{ display: showLeftSide ? "block" : "none" }}>
          <div class="profile-card">
            <div class="profile-image">
              {userData.imagen ? (
                <Image src={userData.imagen} alt={"Imagen de perfil"} />
              ) : (
                <Image
                  src="https://i.pinimg.com/564x/34/f9/c2/34f9c2822cecb80691863fdf76b29dc0.jpg"
                  alt={"Imagen de perfil predeterminada"}
                />
              )}{" "}
            </div>
            <div class="profile-details">
              <div class="nombre">{userData.nombre} </div>
              <div class="name-fields">
                <div class="field appat">{userData.apellidoPaterno}</div>
                <div class="field apmat">{userData.apellidoMaterno}</div>
              </div>
              <div class="fecha-nac">{userData.fechaNacimiento} </div>
              <div class="email">{userData.correo}</div>
              <div class="buttons">
                <button class="cerrar-sesion-btn" onClick={CerrarSesion}>
                  Cerrar Sesión
                </button>
                <button class="desactivar-cuenta-btn" onClick={eliminarCuenta}>
                  Desactivar Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="line-vertical"></div>
      <div className="right-side">
        <div className="encabezado-historial">
          <h2>Tu historial de reportes:</h2>
        </div>
        {reportes.map((reporte, index) => (
          <div className="box2" id="box2" key={index}>
            <div className="column-left">
              <div className="fotografía">
                <Image
                  src={reporte.imagenURL}
                  alt={""}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
              <div className="column-left-inferior">
                <div className="fecha">{reporte.fechaReporte}</div>

                <div className="contador">
                  <div className="icon">
                    <Image
                      src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                      className="logo"
                    />
                  </div>
                  <div className="number"></div>
                </div>
              </div>
            </div>

            <div className="column-right">
              <div className="column-right-superior">
                <div className="estado">
                  {reporte.estado === "Sin atender" && (
                    <Image
                      src={sinAtenderIcon.src}
                      alt={"Sin atender"}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5vh",
                      }}
                    />
                  )}
                  {reporte.estado === "En atención" && (
                    <Image
                      src={enProcesoIcon.src}
                      alt={"En atención"}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5vh",
                      }}
                    />
                  )}
                  {reporte.estado === "Atendido" && (
                    <Image
                      src={atendidoIcon.src}
                      alt={"Atendido"}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5vh",
                      }}
                    />
                  )}
                </div>

                <div className="guardar">
                  {reporte.folio}
                  <button
                    onClick={() => guardarFoliosEnDB(reporte.folio, userData)}
                  >
                    Guardar Folio
                  </button>
                </div>
              </div>

              <div className="ubicacion">
                <h3>Ubicación:</h3>
                <div className="box-ubi">{reporte.ubicacion}</div>
              </div>

              <div className="descripcion">
                <h3>Descripción</h3>
                <div className="box-des">{reporte.descripcion}</div>
              </div>
            </div>
          </div>
        ))}

        {showToggleButton && (
          <button id="toggleButton" onClick={toggleLeftSide}>
            {showLeftSide ? (
              <Image
                src="https://i.postimg.cc/kMxkBZBm/angulo-izquierdo.png"
                alt={"Cerrar"}
              />
            ) : (
              <Image
                src="https://i.postimg.cc/NMkBsTBm/angulo-derecho.png"
                alt={"Abrir"}
              />
            )}
          </button>
        )}
      </div>
      {isLogged && !userData && <p>Cargando datos del usuario...</p>}
    </div>
  );
}
