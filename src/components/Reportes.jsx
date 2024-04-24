"use client";
import { useEffect, useState, useContext } from "react";
import "../app/Reportes/Reportes.css";
import React from "react";
import atendidoIcon from '../imgs/fondoVerde.png';
import enProcesoIcon from '../imgs/fondoAmarillo.png';
import sinAtenderIcon from '../imgs/fondoRojo.png';
import AuthContext from "../../context/AuthContext";
import estrella from "../imgs/estrella.png";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";


function ReportesComponente() {
  const [rep, setRep] = useState([]);
  const { isLogged } = useContext(AuthContext);
  const [foliosGuardados, setFoliosGuardados] = useState([]);
  const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/Reportes");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRep(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Folios guardados:", foliosGuardados);
    // Guardar el array de folios en la base de datos cada vez que cambie
    guardarFoliosEnDB(foliosGuardados);
  }, [foliosGuardados]);
  
  // Función para guardar el array de folios en la base de datos
  // Función para guardar el array de folios en la base de datos
  const guardarFoliosEnDB = async (folio, userData) => {
    try {    // Verificar si userData no es null y tiene la propiedad uid
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
  
              console.log("Folio eliminado de la base de datos del usuario.");
            } else {
              // Agregar el nuevo folio al array de folios guardados
              const nuevosFoliosGuardados = [...foliosGuardadosAnteriores, folio];
  
              // Actualizar el documento del usuario con el nuevo array de folios
              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });
  
              console.log("Folio guardado en la base de datos del usuario.");
            }
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
  
  return (
      
    <div className="reportes-boxes">
    {rep.map((report, index) => (
      <div className="box2" id="box2" key={index}>
        <div className="prueba">
          <div className="columnm-left">
            <div className="fotografía">
              <img src={report.imagenURL} alt={""} style={{ maxWidth: '100%', maxHeight: '100%' }}/>
            </div>

            <div className="column-left-inferior">
              <div className="fecha">{report.fechaReporte}</div>

              <div className="contador">
                <div className="icon">
                  <img
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
                <div className="estado">  {report.estado === "Sin atender" && (
    <img src={sinAtenderIcon.src} alt={"Sin atender"}   style={{ width: "100%", height: "100%", borderRadius: "5vh" }} />
  )}
  {report.estado === "En atención" && (
    <img src={enProcesoIcon.src} alt={"En atención"}   style={{ width: "100%", height: "100%", borderRadius: "5vh" }}/>
  )}
  {report.estado === "Atendido" && (
    <img src={atendidoIcon.src} alt={"Atendido"}  style={{ width: "100%", height: "100%", borderRadius: "5vh" }} />
  )}</div>
                <div className="guardar">
                {userData && userData.uid && userData.foliosGuardados && userData.foliosGuardados.includes(report.folio) ? (
    <img className="icon-star" src="https://i.postimg.cc/W335wqws/estrella-2.png"
                     alt="Folio guardado" onClick={() => guardarFoliosEnDB(report.folio, userData)} />
  ) : (
    <img className="icon-star" src={estrella.src} alt="Guardar folio" onClick={() => guardarFoliosEnDB(report.folio, userData)} />
  )}
                </div>
              </div>

              <div className="ubicacion">
                <h3>Ubicación: </h3>
                <div className="box-ubi">{report.ubicacion}</div>
              </div>

              <div className="descripcion">
                <h3>Descripción: </h3>
                <div className="box-des">{report.descripcion}</div>
              </div>
          </div>
        </div>
          
      </div>
        ))}
    </div>
    
  );
}

export default ReportesComponente;


/*
"use client";
import { useEffect, useState } from "react";
import "../app/Reportes/Reportes.css";
import React from "react";

{report.rep_imagenURL}
<div className="reportes-boxes">
      <div className="box2" id="box2">
        {rep.map(report => {
          <div className="column-left">
          <div className="fotografía">
            <img src="" alt="" />
          </div>
          <div className="column-left-inferior">
            <div className="fecha"> {report.fe}</div>

            <div className="contador">
              <div className="icon">
                <img
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
            <div className="estado"></div>

            <div className="guardar">
              <img
                src="https://i.postimg.cc/52PmmT4T/estrella.png"
                className="icon-star"
              />
            </div>
          </div>

          <div className="ubicacion">
            <h3>Ubicación</h3>
            <div className="box-ubi"></div>
          </div>

          <div className="descripcion">
            <h3>Descripción {report.rep_descripcion}</h3>
            <div className="box-des"></div>
          </div>
        </div>
        })
        
        
        }
      </div>
    </div> */
