"use client";
import React, { useState, useEffect, useContext } from "react";
import "./perfil.css";
import { signOut } from "firebase/auth";
//import AuthGuard from "@/components/AuthGuard";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../../firebase";
import AuthContext from "../../../../../context/AuthContext";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import atendidoIcon from "../../../../imgs/fondoVerde.png";
import enProcesoIcon from "../../../../imgs/fondoAmarillo.png";
import sinAtenderIcon from "../../../../imgs/fondoRojo.png";
import Alerta from "@/components/Alerta3";

import Router from 'next/router';
import Preloader from "@/components/preloader2";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";

export default function Perfil() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeComplete);

    // Limpieza de los eventos al desmontar el componente
    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, []);

  useAuthUser();
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [reportes, setReportes] = useState([]);
  const [foliosGuardados, setFoliosGuardados] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showLeftSide, setShowLeftSide] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          fetchData(uid);
        } else {
          router.push("/Cuenta");
        }
      });
      return () => unsubscribe();
    }

    async function fetchData(uid) {
      try {
        const Uid = enc(uid)
        const id = encodeURIComponent(Uid)
        const baseURL= process.env.NEXT_PUBLIC_RUTA_U
        const baseURLR = process.env.NEXT_PUBLIC_RUTA_RP
       

        const userResponse = await fetch(`${baseURL}/${id}`);
       
        const reportesResponse = await fetch(`${baseURLR}/${id}`);
        if (!userResponse.ok || !reportesResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        const reportesData = await reportesResponse.json();

        const userDataDesc = desc(userData)
        const reportesDesc = reportesData.map(rep => desc(rep))

        setUserData(userDataDesc);
        setReportes(reportesDesc);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, []);

  ///FOLIOS
  useEffect(() => {
    // Guardar el array de folios en la base de datos cada vez que cambie
    guardarFoliosEnDB(foliosGuardados);
  }, [foliosGuardados]);
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

            // Verificar si el folio ya ha sido guardado previamente
            if (foliosGuardadosAnteriores.includes(folio)) {
              // Eliminar el folio del array de folios guardados
              const nuevosFoliosGuardados = foliosGuardadosAnteriores.filter(
                (f) => f !== folio
              );

              // Actualizar el documento del usuario con el nuevo array de folios
              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });

              console.log("Folio eliminado  del usuario.");
            } else {
              // Agregar el nuevo folio al array de folios guardados
              const nuevosFoliosGuardados = [
                ...foliosGuardadosAnteriores,
                folio,
              ];

              // Actualizar el documento del usuario con el nuevo array de folios
              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });

              console.log("Folio guardado  del usuario.");
            }
          } else {
            console.error(
              "El documento del usuario no existe."
            );
          }
        } else {
          console.error(
            "No se encontró ningún documento de usuario."
          );
        }
      } else {
        console.error("No se proporcionaron datos de usuario válidos.");
      }
    } catch (error) {
      console.error("Error al guardar el folio:", error);
    }
  };

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
  async function deleteCokies() {
    const response = await fetch('http://localhost:3000/api/cookie', {
      method: 'DELETE'
    })
    const data = await response.json()
    console.log(data)
  }
  //cerrar sesion y desactivar cuenta
  const CerrarSesion = () => {
    signOut(auth)
      .then(() => 
        deleteCokies().then(()=>{
          console.log("Cierre de sesión exitoso");
        router.push("/Cuenta");
        })
      )
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

        alert("Cuenta desactivada, esperamos verte de nuevo(:");
        CerrarSesion();
      });
    } catch (error) {
      console.error("Error al desactivar la cuenta:", error);
    }
  };

  return (
    <>
    {loading && <Preloader />}
    <div className="container-perfil">
      <Alerta pageId="Perfil"></Alerta> 
      {isLogged && userData && (
        <div id="leftSide" style={{ display: showLeftSide ? "block" : "none" }}>
          <div className="profile-card">
            <div className="profile-image">
              {userData.imagen ? (
                <img src={userData.imagen} alt="Imagen de perfil" />
              ) : (
                <img
                  src="https://i.pinimg.com/564x/34/f9/c2/34f9c2822cecb80691863fdf76b29dc0.jpg"
                  alt="Imagen de perfil predeterminada"
                />
              )}{" "}
            </div>
            <div className="profile-details">
              <div className="nombre">{userData.nombre} </div>
              <div className="name-fields">
                <div className="field appat">{userData.apellidoPaterno}</div>
                <div className="field apmat">{userData.apellidoMaterno}</div>
              </div>
              <div className="fecha-nac">{userData.fechaNacimiento} </div>
              <div className="email">{userData.correo}</div>
              <div className="buttons">
                <button className="cerrar-sesion-btn" onClick={CerrarSesion}>
                  Cerrar Sesión
                </button>
                <button
                  className="desactivar-cuenta-btn"
                  onClick={eliminarCuenta}
                >
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

        {reportes.length === 0 ? (
            <div className="no-founds">
              <div className="ast-centered">
              <div className="backg">
		<div className="planet">
			<div className="r1"></div>
			<div className="r2"></div>
			<div className="r3"></div>
			<div className="r4"></div>
			<div className="r5"></div>
			<div className="r6"></div>
			<div className="r7"></div>
			<div className="r8"></div>
			<div className="shad"></div>
		</div>
		<div className="stars">
			<div className="s1"></div>
			<div className="s2"></div>
			<div className="s3"></div>
			<div className="s4"></div>
			<div className="s5"></div>
			<div className="s6"></div>
		</div>
		<div className="an">
			<div className="tank"></div>
			<div className="astro">
					
					<div className="helmet">
						<div className="glass">
							<div className="shine"></div>
						</div>
					</div>
					<div className="dress">
						<div className="c">
							<div className="btn1"></div>
							<div className="btn2"></div>
							<div className="btn3"></div>
							<div className="btn4"></div>
						</div>
					</div>
					<div className="handl">
						<div className="handl1">
							<div className="glovel">
								<div className="thumbl"></div>
								<div className="b2"></div>
							</div>
						</div>
					</div>
					<div className="handr">
						<div className="handr1">
							<div className="glover">
								<div className="thumbr"></div>
								<div className="b1"></div>
							</div>
						</div>
					</div>
					<div className="legl">
						<div className="bootl1">
							<div className="bootl2"></div>
						</div>
					</div>
					<div className="legr">
						<div className="bootr1">
							<div className="bootr2"></div>
						</div>
					</div>
					<div className="pipe">
						<div className="pipe2">
							<div className="pipe3"></div>
						</div>
					</div>
				</div>
			</div>
    </div>
              </div>
<div className="nofounds-txt">
<p>¡Vaya! Parece que no has hecho ningún reporte todavía.</p>
  </div>              
            </div>
          ) : (
            reportes.map((reporte, index) => (
          <div className="box2-2" id="box2-2" key={index}>
            <div className="column-left2">
              <div className="fotografía2">
                <img
                  src={reporte.imagenURL}
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "100%", borderRadius:"1rem", }}
                />
                <p className="no-foto2">No se pudo cargar la imagen</p>
              </div>
              <div className="column-left-inferior2">
                <div className="fecha2">{reporte.fechaReporte}</div>

                <div className="contador2">
                  <div className="icon2">
                    <img
                      src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                      className="logo2"
                    />
                  </div>
                  <div className="number2">{reporte.contador}</div>
                </div>
              </div>
            </div>

            <div className="column-right2">
              <div className="column-right-superior2">
                <div className="estado2">
                  <div className="folio">Folio: {reporte.folio}</div>
                  {reporte.estado === "Sin atender" && (
                    <img
                      src={sinAtenderIcon.src}
                      alt="Sin atender"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5vh",
                      }}
                    />
                  )}
                  {reporte.estado === "En atención" && (
                    <img
                      src={enProcesoIcon.src}
                      alt="En atención"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5vh",
                      }}
                    />
                  )}
                  {reporte.estado === "Atendido" && (
                    <img
                      src={atendidoIcon.src}
                      alt="Atendido"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5vh",
                      }}
                    />
                  )}
                </div>

                <div className="guardar2">
 
                  {userData && userData.uid && userData.foliosGuardados && userData.foliosGuardados.includes(reporte.folio) ? (
                    <img 
                    className="icon-star2"
                    src="https://i.postimg.cc/RVrPJ3rN/estrella-1.png"
                    style={{ opacity: 1, transition: 'opacity 0.3s ease' }}
                    alt="Folio guardado" 
                    onClick={() => guardarFoliosEnDB(reporte.folio, userData)}/>
                  ) : (
                    <img
                      className="icon-star2"
                      src="https://i.postimg.cc/52PmmT4T/estrella.png"
                      style={{ opacity: 0.5, transition: 'opacity 0.3s ease' }}
                      alt="Guardar folio"
                      onClick={() => guardarFoliosEnDB(reporte.folio, userData)}
                    />
                  )}
                </div>
              </div>

              <div className="ubicacion2">
                <h3>Ubicación:</h3>
                <div className="box-ubi2">{reporte.ubicacion}</div>
              </div>

              <div className="descripcion2">
                <h3>Descripción</h3>
                <div className="box-des2">{reporte.descripcion}</div>
              </div>
            </div>
          </div>
        ))
          )}

        

        {showToggleButton && (
          <button id="toggleButton" onClick={toggleLeftSide}>
            {showLeftSide ? (
              <img
                src="https://i.postimg.cc/kMxkBZBm/angulo-izquierdo.png"
                alt="Cerrar"
              />
            ) : (
              <img
                src="https://i.postimg.cc/NMkBsTBm/angulo-derecho.png"
                alt="Abrir"
              />
            )}
          </button>
        )}
      </div>
      {isLogged && !userData && <p>Cargando datos del usuario...</p>}
    </div>
</>    
  );
}