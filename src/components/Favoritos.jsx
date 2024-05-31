"use client";
import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import AuthContext from "../../context/AuthContext";

function Favoritos() {
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [foliosGuardados, setFoliosGuardados] = useState([]);
  const [repSinAtender, setRepSinAtender] = useState([]);
  const [repEnAtencion, setRepEnAtencion] = useState([]);
  const [repAtendidos, setRepAtendidos] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("sin-atender");

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLogged) {
        try {
          const userQuery = query(
            collection(db, "usuarios"),
            where("uid", "==", auth.currentUser.uid)
          );
          const userDocs = await getDocs(userQuery);

          if (!userDocs.empty) {
            const userDoc = userDocs.docs[0];
            const userData = userDoc.data();
            setUserData(userData);
            setFoliosGuardados(userData.foliosGuardados || []);
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

  const [starImages, setStarImages] = useState({}); // Estado para almacenar la imagen de cada reporte

  const cambiarImagen = (reporte) => {
    // Copiar el estado actual de las imágenes
    const newStarImages = { ...starImages };
    // Cambiar la imagen solo para el reporte seleccionado
    newStarImages[reporte.folio] = "https://i.postimg.cc/52PmmT4T/estrella.png";
    // Actualizar el estado
    setStarImages(newStarImages);
    // Después de un cierto tiempo, volver a la imagen original
    setTimeout(() => {
      newStarImages[reporte.folio] = "https://i.postimg.cc/W335wqws/estrella-2.png";
      setStarImages(newStarImages);
    }, 1000); // Cambiar después de 1 segundo (1000 milisegundos)
  };

  const getStarImage = (reporte) => {
    // Devolver la imagen correspondiente al reporte, si está definida en el estado, de lo contrario, la imagen predeterminada
    return starImages[reporte.folio] || "https://i.postimg.cc/W335wqws/estrella-2.png";
  };
  const eliminarFolio = async (folio) => {
    try {
      if (userData && userData.uid) {
        const userQuery = query(
          collection(db, "usuarios"),
          where("uid", "==", userData.uid)
        );

        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const foliosGuardadosAnteriores = userData.foliosGuardados || [];

            if (foliosGuardadosAnteriores.includes(folio)) {
              const nuevosFoliosGuardados = foliosGuardadosAnteriores.filter(
                (f) => f !== folio
              );

              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });

              setFoliosGuardados(nuevosFoliosGuardados);
              console.log("Folio eliminado de la base de datos del usuario.");
            } else {
              console.log("El folio no estaba presente en la base de datos del usuario.");
            }
          } else {
            console.error("El documento del usuario no existe en la base de datos.");
          }
        } else {
          console.error("No se encontró ningún documento de usuario que contenga el UID proporcionado.");
        }
      } else {
        console.error("No se proporcionaron datos de usuario válidos.");
      }
    } catch (error) {
      console.error("Error al eliminar el folio de la base de datos:", error);
    }
  };

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_RUTA_R
        const response = await fetch(`${baseURL}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const sinAtender = data.filter(report => foliosGuardados.includes(report.folio) && report.estado === 'Sin atender');
        const enAtencion = data.filter(report => foliosGuardados.includes(report.folio) && report.estado === 'En atención');
        const atendidos = data.filter(report => foliosGuardados.includes(report.folio) && report.estado === 'Atendido');

        setRepSinAtender(sinAtender);
        setRepEnAtencion(enAtencion);
        setRepAtendidos(atendidos);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchReportes();
  }, [foliosGuardados]);

  const [showTitles, setShowTitles] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 5;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > navbarHeight) {
        setShowTitles(false);
      } else {
        setShowTitles(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Sin atender':
        return 'estado-sin-atender';
      case 'En atención':
        return 'estado-en-atencion';
      case 'Atendido':
        return 'estado-atendidos';
      default:
        return '';
    }
  };

  const renderReportes = (reportes) => {
    return reportes.map((report, index) => (
      <div className="box2-favs" key={index}>
        <div className="column-favs-left">
          <div className="fotografía-favs">
            <img src={report.imagenURL} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: "1rem", }} alt="" />
          </div>
          <div className="column-favs-left-inferior">
            <div className="fecha-favs">
              {report.fechaReporte}
            </div>
            <div className="contador-favs">
              <div className="icon-favs">
                <img
                  src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                  className="logo-favs"
                />
              </div>
              <div className="number-favs">
                {report.contador}
              </div>
            </div>
          </div>
        </div>
        <div className="column-favs-right">
          <div className="column-favs-right-superior">
            <div className={`estado-favs ${getEstadoClass(report.estado)}`} id={`estado-${selectedColumn}`}>
            </div>
            <div className="guardar-favs" onClick={() => cambiarImagen(report)}> 
              <img
                src={getStarImage(report)} 
                style={{ transition: 'opacity 0.3s ease' }}
                className="icon-favs-star" onClick={() => eliminarFolio(report.folio)}
              />
            </div>
          </div>
          <div className="ubicacion-favs">
            <h3>Ubicación</h3>
            <div className="box-ubi-favs">
              {report.ubicacion}
            </div>
          </div>
          <div className="descripcion-favs">
            <h3>Descripción</h3>
            <div className="box-des-favs">
              {report.descripcion}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className='body-favoritos'>
      <div className="menu-mobile">
        <label id="select-edo" htmlFor="column-select">Selecciona el estado:</label>
        <select id="column-select" onChange={handleColumnChange}>
          <option value="sin-atender">🔴 Sin atender</option>
          <option value="en-atencion">🟡 En atención</option>
          <option value="atendidos">🟢 Atendidos</option>
        </select>
      </div>
      
      <div className={`container-tipos-favs ${showTitles ? '' : 'margin-top'}`}>
        
        <div className="column-favs">
          <h3 className='tipo' id='sin-at'>Sin Atender</h3>
        </div>
        <div className="column-favs">
          <h3 className='tipo' id='en-at'>En atención</h3>
        </div>
        <div className="column-favs">
          <h3 className='tipo' id='at'>Atendidos</h3>
        </div>
      </div>

      <div className="scrollable-section-favs">
        <div className="container-reportes-favs">
          <div className={`column-favs ${selectedColumn === "sin-atender" ? 'show' : 'hide'}`}>
          {repSinAtender.length === 0 ? (
              <div className="no-reportes-message2">
                <div>No tienes reportes guardados Sin Atender</div>
                <div className='Oculto'>
                <svg id="home" class="tab-four" xmlns="http://www.w3.org/2000/svg" viewBox="100 0 125 110">
  <title>tab5</title>
  <g id="_Group_" data-name="&lt;Group&gt;">
    <polygon id="_Path_" data-name="&lt;Path&gt;" class="cls-2" points="131.02 70.55 131.02 26.97 152.8 32.57 175.18 26.97 196.52 32.13 196.52 76.14 175.18 71.78 152.95 76.14 131.02 70.55" />
    <polygon id="_Path_2" data-name="&lt;Path&gt;" class="cls-3" points="152.8 32.57 152.95 76.14 175.18 71.78 175.18 26.97 152.8 32.57" />
    <g id="marker">
      <circle id="_Path_3" data-name="&lt;Path&gt;" class="cls-4" cx="141.87" cy="18.85" r="4.8" />
      <path id="_Compound_Path_" data-name="&lt;Compound Path&gt;" class="cls-3" d="M130.13,20.59V19a3.92,3.92,0,0,0,.11-.41,27.76,27.76,0,0,1,.48-2.77,11,11,0,0,1,4.76-6.57,11.69,11.69,0,0,1,9.28-1.51,10.78,10.78,0,0,1,6.24,4,13.26,13.26,0,0,1,2.35,10.57,12.24,12.24,0,0,1-2.22,5.12c-2.52,3.51-4.92,7.11-7.38,10.66l-1.86,2.67c-.1-.07-.16-.09-.18-.13l-6.08-8.82c-1-1.45-2-2.89-3-4.34A12.14,12.14,0,0,1,130.36,22C130.31,21.5,130.21,21,130.13,20.59ZM142,14.84A4.1,4.1,0,0,0,137.79,19a4.15,4.15,0,0,0,4,4.18,4.32,4.32,0,0,0,4.41-4.08A4.24,4.24,0,0,0,142,14.84Z" />
    </g>
    <g id="search">
      <path id="_Compound_Path_2" data-name="&lt;Compound Path&gt;" class="cls-2" d="M161.1,66.19c0-.34.1-.67.14-1a15.52,15.52,0,0,1,3.12-7.67,15.42,15.42,0,0,1,3.1-3,14.37,14.37,0,0,1,4.64-2.34,20.86,20.86,0,0,1,3.09-.62,15,15,0,0,1,2.83-.07,15.6,15.6,0,0,1,5,1.23,14.17,14.17,0,0,1,3.5,2.09,25.7,25.7,0,0,1,2.34,2.31,12.33,12.33,0,0,1,2,3.07,16.26,16.26,0,0,1,1.38,4.3,15.38,15.38,0,0,1,.18,3.92,15.15,15.15,0,0,1-3.14,8.23c-.2.25-.42.49-.6.76a.33.33,0,0,0,0,.31c.3.33.62.64.94.94a.38.38,0,0,0,.3.05,2.29,2.29,0,0,1,2.29.71c1.89,1.92,3.8,3.81,5.7,5.71.3.3.63.58.9.91a2.12,2.12,0,0,1,.27,2.42,2.09,2.09,0,0,1-1.87,1.21,2.29,2.29,0,0,1-1.85-.76q-3.2-3.25-6.45-6.46a2.3,2.3,0,0,1-.59-2.12.53.53,0,0,0-.09-.38c-.31-.35-.65-.67-1-1l-1,.75a14.64,14.64,0,0,1-5.9,2.75c-.82.18-1.66.26-2.49.36a10.1,10.1,0,0,1-1.42.07,15.87,15.87,0,0,1-5.7-1.19,15.63,15.63,0,0,1-4.16-2.52,15.75,15.75,0,0,1-5.15-8.53c-.17-.76-.21-1.55-.31-2.32a1.79,1.79,0,0,0-.07-.25Zm15.48,13.92a12.94,12.94,0,0,0,9.18-3.59,12.94,12.94,0,0,0,.74-18,12.47,12.47,0,0,0-9.58-4.35,12.93,12.93,0,0,0-13.07,12.34,12.51,12.51,0,0,0,3.33,9.33A12.73,12.73,0,0,0,176.58,80.11Z" />
      <path id="_Compound_Path_3" data-name="&lt;Compound Path&gt;" class="cls-5" d="M176.58,80.11a12.73,12.73,0,0,1-9.39-4.3,12.51,12.51,0,0,1-3.33-9.33,12.93,12.93,0,0,1,13.07-12.34,13,13,0,0,1,12.89,13.13,12.62,12.62,0,0,1-4,9.26A12.94,12.94,0,0,1,176.58,80.11ZM165.77,68.7a21.44,21.44,0,0,1,12.43-12.65A12.07,12.07,0,0,0,165.77,68.7Z" />
      <path id="_Path_4" data-name="&lt;Path&gt;" class="cls-5" d="M165.77,68.7a12.07,12.07,0,0,1,12.43-12.65A21.44,21.44,0,0,0,165.77,68.7Z" />
      <g id="_Group_3" data-name="&lt;Group&gt;">
        <path id="_Path_5" data-name="&lt;Path&gt;" class="cls-6" d="M175.4,55.87a1.68,1.68,0,0,0,1.1,1.41c.57.26,1.21.36,1.78.63a1.13,1.13,0,0,1,.5.38,2,2,0,0,1,.19.64,2.2,2.2,0,0,0,1.56,1.59,1.54,1.54,0,0,1,.61.22c.44.36.14,1.05.15,1.62,0,.78.66,1.37,1.08,2a.93.93,0,0,1,.2.68c-.09.39-.58.54-1,.51a3.84,3.84,0,0,0-1.2-.1c-.54.12-.87.64-1.25,1a.58.58,0,0,1-.52.24c-.26-.07-.31-.41-.3-.68a4.39,4.39,0,0,0-.08-1.43,1.29,1.29,0,0,0-1-1c-.71-.1-1.28.63-1.48,1.32a6.23,6.23,0,0,1-.64,2.05,9.26,9.26,0,0,1-.11-3.67,49.89,49.89,0,0,0,.14-7.36" />
        <path id="_Path_6" data-name="&lt;Path&gt;" class="cls-6" d="M175.13,60.75a10,10,0,0,1-5.63,2.11,15.58,15.58,0,0,0-1.76,0,1.57,1.57,0,0,0-1.33,1c-.08.31,0,.64-.13.94-.33.93-1.82.73-2.45,1.49a2.24,2.24,0,0,0-.36,1.4l0,1.63,1.56-.87a3.14,3.14,0,0,0,1.56-1.41,8.44,8.44,0,0,1,.38-1.31,2,2,0,0,1,1.86-.7,4.93,4.93,0,0,0,2.07-.06,9.26,9.26,0,0,0,1.44-1,8.88,8.88,0,0,1,2.59-.8.32.32,0,0,0,.21-.12.32.32,0,0,0,0-.21c-.16-.84.18-1.32,0-2.15" />
        <path id="_Path_7" data-name="&lt;Path&gt;" class="cls-6" d="M175.56,69.25q1.37,0,2.75-.07a7.16,7.16,0,0,0,6.78-7.13q0-2.17,0-4.35c.14,0,.21.18.23.32q.34,2.22.51,4.46a7.11,7.11,0,0,1-6.9,7.61q-1.82,0-3.63.2a1,1,0,0,1,.17-1.13" />
        <path id="_Path_8" data-name="&lt;Path&gt;" class="cls-6" d="M174.93,65.87H172v5.18a1.11,1.11,0,0,0,.13.64c.23.34.73.32,1.14.25l1.53-.24a.29.29,0,0,0,.31-.37l0-2.13a10.24,10.24,0,0,0-.4-3.3" />
        <path id="_Path_9" data-name="&lt;Path&gt;" class="cls-6" d="M187.1,63.68l1.19.32s-.28,8.18-8,7.43v-.9A7.33,7.33,0,0,0,187.1,63.68Z" />
        <polygon id="_Path_10" data-name="&lt;Path&gt;" class="cls-6" points="167.42 66.88 170.98 65.87 170.98 68.5 167.85 69.36 167.42 66.88" />
        <polygon id="_Path_11" data-name="&lt;Path&gt;" class="cls-6" points="168.1 70.54 170.98 69.75 170.98 70.54 168.1 71.48 168.1 70.54" />
        <path id="_Path_12" data-name="&lt;Path&gt;" class="cls-6" d="M168.67,58.81s2.28-2.62,4.86-2.44l.27,3.25s-2.12,2.39-4.25,1.85h-.87Z" />
      </g>
    </g>
  </g>
  <path id="line2" class="cls-7" d="M141.8,42.55a9.22,9.22,0,0,0,5.6,7.79,4.93,4.93,0,0,0,4.06.09,2.64,2.64,0,0,0,1.23-3.52,1.13,1.13,0,0,0-1.42-.07,2.67,2.67,0,0,0,.41,3c.65.85,1.56,1.48,2.23,2.31,2.12,2.62,1.35,6.75-.92,9.24S147.34,65,144,65.78s-7.28,1.54-8.68,4.65a8.32,8.32,0,0,0-.39,4.44c.51,4.07,2.76,8.61,6.83,9.17,3.78.52,7.32-2.69,11.11-2.23,4.83.58,7.09,6.48,11.45,8.65a8.55,8.55,0,0,0,11.53-5.14" />
  <path id="line" class="cls-7" d="M141.8,42.55a9.22,9.22,0,0,0,5.6,7.79,4.93,4.93,0,0,0,4.06.09,2.64,2.64,0,0,0,1.23-3.52,1.13,1.13,0,0,0-1.42-.07,2.67,2.67,0,0,0,.41,3c.65.85,1.56,1.48,2.23,2.31,2.12,2.62,1.35,6.75-.92,9.24S147.34,65,144,65.78s-7.28,1.54-8.68,4.65a8.32,8.32,0,0,0-.39,4.44c.51,4.07,2.76,8.61,6.83,9.17,3.78.52,7.32-2.69,11.11-2.23,4.83.58,7.09,6.48,11.45,8.65a8.55,8.55,0,0,0,11.53-5.14" />
</svg>
                </div>
              </div>
          ) : (
          <div className="reportes-boxes-favs">
              {renderReportes(repSinAtender)}
            </div>
    )}
            
          </div>
          <div className={`column-favs ${selectedColumn === "en-atencion" ? 'show' : 'hide'}`}>
          {repEnAtencion.length === 0 ? (
              <div className="no-reportes-message2">
              <div>No tienes reportes guardados en Atención</div>
              <div className='Oculto'>
              <svg id="home" class="tab-four" xmlns="http://www.w3.org/2000/svg" viewBox="100 0 125 110">
<title>tab5</title>
<g id="_Group_" data-name="&lt;Group&gt;">
  <polygon id="_Path_" data-name="&lt;Path&gt;" class="cls-2" points="131.02 70.55 131.02 26.97 152.8 32.57 175.18 26.97 196.52 32.13 196.52 76.14 175.18 71.78 152.95 76.14 131.02 70.55" />
  <polygon id="_Path_2" data-name="&lt;Path&gt;" class="cls-3" points="152.8 32.57 152.95 76.14 175.18 71.78 175.18 26.97 152.8 32.57" />
  <g id="marker">
    <circle id="_Path_3" data-name="&lt;Path&gt;" class="cls-4" cx="141.87" cy="18.85" r="4.8" />
    <path id="_Compound_Path_" data-name="&lt;Compound Path&gt;" class="cls-3" d="M130.13,20.59V19a3.92,3.92,0,0,0,.11-.41,27.76,27.76,0,0,1,.48-2.77,11,11,0,0,1,4.76-6.57,11.69,11.69,0,0,1,9.28-1.51,10.78,10.78,0,0,1,6.24,4,13.26,13.26,0,0,1,2.35,10.57,12.24,12.24,0,0,1-2.22,5.12c-2.52,3.51-4.92,7.11-7.38,10.66l-1.86,2.67c-.1-.07-.16-.09-.18-.13l-6.08-8.82c-1-1.45-2-2.89-3-4.34A12.14,12.14,0,0,1,130.36,22C130.31,21.5,130.21,21,130.13,20.59ZM142,14.84A4.1,4.1,0,0,0,137.79,19a4.15,4.15,0,0,0,4,4.18,4.32,4.32,0,0,0,4.41-4.08A4.24,4.24,0,0,0,142,14.84Z" />
  </g>
  <g id="search">
    <path id="_Compound_Path_2" data-name="&lt;Compound Path&gt;" class="cls-2" d="M161.1,66.19c0-.34.1-.67.14-1a15.52,15.52,0,0,1,3.12-7.67,15.42,15.42,0,0,1,3.1-3,14.37,14.37,0,0,1,4.64-2.34,20.86,20.86,0,0,1,3.09-.62,15,15,0,0,1,2.83-.07,15.6,15.6,0,0,1,5,1.23,14.17,14.17,0,0,1,3.5,2.09,25.7,25.7,0,0,1,2.34,2.31,12.33,12.33,0,0,1,2,3.07,16.26,16.26,0,0,1,1.38,4.3,15.38,15.38,0,0,1,.18,3.92,15.15,15.15,0,0,1-3.14,8.23c-.2.25-.42.49-.6.76a.33.33,0,0,0,0,.31c.3.33.62.64.94.94a.38.38,0,0,0,.3.05,2.29,2.29,0,0,1,2.29.71c1.89,1.92,3.8,3.81,5.7,5.71.3.3.63.58.9.91a2.12,2.12,0,0,1,.27,2.42,2.09,2.09,0,0,1-1.87,1.21,2.29,2.29,0,0,1-1.85-.76q-3.2-3.25-6.45-6.46a2.3,2.3,0,0,1-.59-2.12.53.53,0,0,0-.09-.38c-.31-.35-.65-.67-1-1l-1,.75a14.64,14.64,0,0,1-5.9,2.75c-.82.18-1.66.26-2.49.36a10.1,10.1,0,0,1-1.42.07,15.87,15.87,0,0,1-5.7-1.19,15.63,15.63,0,0,1-4.16-2.52,15.75,15.75,0,0,1-5.15-8.53c-.17-.76-.21-1.55-.31-2.32a1.79,1.79,0,0,0-.07-.25Zm15.48,13.92a12.94,12.94,0,0,0,9.18-3.59,12.94,12.94,0,0,0,.74-18,12.47,12.47,0,0,0-9.58-4.35,12.93,12.93,0,0,0-13.07,12.34,12.51,12.51,0,0,0,3.33,9.33A12.73,12.73,0,0,0,176.58,80.11Z" />
    <path id="_Compound_Path_3" data-name="&lt;Compound Path&gt;" class="cls-5" d="M176.58,80.11a12.73,12.73,0,0,1-9.39-4.3,12.51,12.51,0,0,1-3.33-9.33,12.93,12.93,0,0,1,13.07-12.34,13,13,0,0,1,12.89,13.13,12.62,12.62,0,0,1-4,9.26A12.94,12.94,0,0,1,176.58,80.11ZM165.77,68.7a21.44,21.44,0,0,1,12.43-12.65A12.07,12.07,0,0,0,165.77,68.7Z" />
    <path id="_Path_4" data-name="&lt;Path&gt;" class="cls-5" d="M165.77,68.7a12.07,12.07,0,0,1,12.43-12.65A21.44,21.44,0,0,0,165.77,68.7Z" />
    <g id="_Group_3" data-name="&lt;Group&gt;">
      <path id="_Path_5" data-name="&lt;Path&gt;" class="cls-6" d="M175.4,55.87a1.68,1.68,0,0,0,1.1,1.41c.57.26,1.21.36,1.78.63a1.13,1.13,0,0,1,.5.38,2,2,0,0,1,.19.64,2.2,2.2,0,0,0,1.56,1.59,1.54,1.54,0,0,1,.61.22c.44.36.14,1.05.15,1.62,0,.78.66,1.37,1.08,2a.93.93,0,0,1,.2.68c-.09.39-.58.54-1,.51a3.84,3.84,0,0,0-1.2-.1c-.54.12-.87.64-1.25,1a.58.58,0,0,1-.52.24c-.26-.07-.31-.41-.3-.68a4.39,4.39,0,0,0-.08-1.43,1.29,1.29,0,0,0-1-1c-.71-.1-1.28.63-1.48,1.32a6.23,6.23,0,0,1-.64,2.05,9.26,9.26,0,0,1-.11-3.67,49.89,49.89,0,0,0,.14-7.36" />
      <path id="_Path_6" data-name="&lt;Path&gt;" class="cls-6" d="M175.13,60.75a10,10,0,0,1-5.63,2.11,15.58,15.58,0,0,0-1.76,0,1.57,1.57,0,0,0-1.33,1c-.08.31,0,.64-.13.94-.33.93-1.82.73-2.45,1.49a2.24,2.24,0,0,0-.36,1.4l0,1.63,1.56-.87a3.14,3.14,0,0,0,1.56-1.41,8.44,8.44,0,0,1,.38-1.31,2,2,0,0,1,1.86-.7,4.93,4.93,0,0,0,2.07-.06,9.26,9.26,0,0,0,1.44-1,8.88,8.88,0,0,1,2.59-.8.32.32,0,0,0,.21-.12.32.32,0,0,0,0-.21c-.16-.84.18-1.32,0-2.15" />
      <path id="_Path_7" data-name="&lt;Path&gt;" class="cls-6" d="M175.56,69.25q1.37,0,2.75-.07a7.16,7.16,0,0,0,6.78-7.13q0-2.17,0-4.35c.14,0,.21.18.23.32q.34,2.22.51,4.46a7.11,7.11,0,0,1-6.9,7.61q-1.82,0-3.63.2a1,1,0,0,1,.17-1.13" />
      <path id="_Path_8" data-name="&lt;Path&gt;" class="cls-6" d="M174.93,65.87H172v5.18a1.11,1.11,0,0,0,.13.64c.23.34.73.32,1.14.25l1.53-.24a.29.29,0,0,0,.31-.37l0-2.13a10.24,10.24,0,0,0-.4-3.3" />
      <path id="_Path_9" data-name="&lt;Path&gt;" class="cls-6" d="M187.1,63.68l1.19.32s-.28,8.18-8,7.43v-.9A7.33,7.33,0,0,0,187.1,63.68Z" />
      <polygon id="_Path_10" data-name="&lt;Path&gt;" class="cls-6" points="167.42 66.88 170.98 65.87 170.98 68.5 167.85 69.36 167.42 66.88" />
      <polygon id="_Path_11" data-name="&lt;Path&gt;" class="cls-6" points="168.1 70.54 170.98 69.75 170.98 70.54 168.1 71.48 168.1 70.54" />
      <path id="_Path_12" data-name="&lt;Path&gt;" class="cls-6" d="M168.67,58.81s2.28-2.62,4.86-2.44l.27,3.25s-2.12,2.39-4.25,1.85h-.87Z" />
    </g>
  </g>
</g>
<path id="line2" class="cls-7" d="M141.8,42.55a9.22,9.22,0,0,0,5.6,7.79,4.93,4.93,0,0,0,4.06.09,2.64,2.64,0,0,0,1.23-3.52,1.13,1.13,0,0,0-1.42-.07,2.67,2.67,0,0,0,.41,3c.65.85,1.56,1.48,2.23,2.31,2.12,2.62,1.35,6.75-.92,9.24S147.34,65,144,65.78s-7.28,1.54-8.68,4.65a8.32,8.32,0,0,0-.39,4.44c.51,4.07,2.76,8.61,6.83,9.17,3.78.52,7.32-2.69,11.11-2.23,4.83.58,7.09,6.48,11.45,8.65a8.55,8.55,0,0,0,11.53-5.14" />
<path id="line" class="cls-7" d="M141.8,42.55a9.22,9.22,0,0,0,5.6,7.79,4.93,4.93,0,0,0,4.06.09,2.64,2.64,0,0,0,1.23-3.52,1.13,1.13,0,0,0-1.42-.07,2.67,2.67,0,0,0,.41,3c.65.85,1.56,1.48,2.23,2.31,2.12,2.62,1.35,6.75-.92,9.24S147.34,65,144,65.78s-7.28,1.54-8.68,4.65a8.32,8.32,0,0,0-.39,4.44c.51,4.07,2.76,8.61,6.83,9.17,3.78.52,7.32-2.69,11.11-2.23,4.83.58,7.09,6.48,11.45,8.65a8.55,8.55,0,0,0,11.53-5.14" />
</svg>
              </div>
            </div>
          ) : (
            <div className="reportes-boxes-favs">
              {renderReportes(repEnAtencion)}
            </div>
    )}

          </div>
          
          <div className={`column-favs ${selectedColumn === "atendidos" ? 'show' : 'hide'}`}>
          {repAtendidos.length === 0 ? (
              <div className="no-reportes-message2">
              <div>No tienes reportes guardados Atendidos</div>
              <div className='Oculto'>
              <svg id="home" class="tab-four" xmlns="http://www.w3.org/2000/svg" viewBox="100 0 125 110">
<title>tab5</title>
<g id="_Group_" data-name="&lt;Group&gt;">
  <polygon id="_Path_" data-name="&lt;Path&gt;" class="cls-2" points="131.02 70.55 131.02 26.97 152.8 32.57 175.18 26.97 196.52 32.13 196.52 76.14 175.18 71.78 152.95 76.14 131.02 70.55" />
  <polygon id="_Path_2" data-name="&lt;Path&gt;" class="cls-3" points="152.8 32.57 152.95 76.14 175.18 71.78 175.18 26.97 152.8 32.57" />
  <g id="marker">
    <circle id="_Path_3" data-name="&lt;Path&gt;" class="cls-4" cx="141.87" cy="18.85" r="4.8" />
    <path id="_Compound_Path_" data-name="&lt;Compound Path&gt;" class="cls-3" d="M130.13,20.59V19a3.92,3.92,0,0,0,.11-.41,27.76,27.76,0,0,1,.48-2.77,11,11,0,0,1,4.76-6.57,11.69,11.69,0,0,1,9.28-1.51,10.78,10.78,0,0,1,6.24,4,13.26,13.26,0,0,1,2.35,10.57,12.24,12.24,0,0,1-2.22,5.12c-2.52,3.51-4.92,7.11-7.38,10.66l-1.86,2.67c-.1-.07-.16-.09-.18-.13l-6.08-8.82c-1-1.45-2-2.89-3-4.34A12.14,12.14,0,0,1,130.36,22C130.31,21.5,130.21,21,130.13,20.59ZM142,14.84A4.1,4.1,0,0,0,137.79,19a4.15,4.15,0,0,0,4,4.18,4.32,4.32,0,0,0,4.41-4.08A4.24,4.24,0,0,0,142,14.84Z" />
  </g>
  <g id="search">
    <path id="_Compound_Path_2" data-name="&lt;Compound Path&gt;" class="cls-2" d="M161.1,66.19c0-.34.1-.67.14-1a15.52,15.52,0,0,1,3.12-7.67,15.42,15.42,0,0,1,3.1-3,14.37,14.37,0,0,1,4.64-2.34,20.86,20.86,0,0,1,3.09-.62,15,15,0,0,1,2.83-.07,15.6,15.6,0,0,1,5,1.23,14.17,14.17,0,0,1,3.5,2.09,25.7,25.7,0,0,1,2.34,2.31,12.33,12.33,0,0,1,2,3.07,16.26,16.26,0,0,1,1.38,4.3,15.38,15.38,0,0,1,.18,3.92,15.15,15.15,0,0,1-3.14,8.23c-.2.25-.42.49-.6.76a.33.33,0,0,0,0,.31c.3.33.62.64.94.94a.38.38,0,0,0,.3.05,2.29,2.29,0,0,1,2.29.71c1.89,1.92,3.8,3.81,5.7,5.71.3.3.63.58.9.91a2.12,2.12,0,0,1,.27,2.42,2.09,2.09,0,0,1-1.87,1.21,2.29,2.29,0,0,1-1.85-.76q-3.2-3.25-6.45-6.46a2.3,2.3,0,0,1-.59-2.12.53.53,0,0,0-.09-.38c-.31-.35-.65-.67-1-1l-1,.75a14.64,14.64,0,0,1-5.9,2.75c-.82.18-1.66.26-2.49.36a10.1,10.1,0,0,1-1.42.07,15.87,15.87,0,0,1-5.7-1.19,15.63,15.63,0,0,1-4.16-2.52,15.75,15.75,0,0,1-5.15-8.53c-.17-.76-.21-1.55-.31-2.32a1.79,1.79,0,0,0-.07-.25Zm15.48,13.92a12.94,12.94,0,0,0,9.18-3.59,12.94,12.94,0,0,0,.74-18,12.47,12.47,0,0,0-9.58-4.35,12.93,12.93,0,0,0-13.07,12.34,12.51,12.51,0,0,0,3.33,9.33A12.73,12.73,0,0,0,176.58,80.11Z" />
    <path id="_Compound_Path_3" data-name="&lt;Compound Path&gt;" class="cls-5" d="M176.58,80.11a12.73,12.73,0,0,1-9.39-4.3,12.51,12.51,0,0,1-3.33-9.33,12.93,12.93,0,0,1,13.07-12.34,13,13,0,0,1,12.89,13.13,12.62,12.62,0,0,1-4,9.26A12.94,12.94,0,0,1,176.58,80.11ZM165.77,68.7a21.44,21.44,0,0,1,12.43-12.65A12.07,12.07,0,0,0,165.77,68.7Z" />
    <path id="_Path_4" data-name="&lt;Path&gt;" class="cls-5" d="M165.77,68.7a12.07,12.07,0,0,1,12.43-12.65A21.44,21.44,0,0,0,165.77,68.7Z" />
    <g id="_Group_3" data-name="&lt;Group&gt;">
      <path id="_Path_5" data-name="&lt;Path&gt;" class="cls-6" d="M175.4,55.87a1.68,1.68,0,0,0,1.1,1.41c.57.26,1.21.36,1.78.63a1.13,1.13,0,0,1,.5.38,2,2,0,0,1,.19.64,2.2,2.2,0,0,0,1.56,1.59,1.54,1.54,0,0,1,.61.22c.44.36.14,1.05.15,1.62,0,.78.66,1.37,1.08,2a.93.93,0,0,1,.2.68c-.09.39-.58.54-1,.51a3.84,3.84,0,0,0-1.2-.1c-.54.12-.87.64-1.25,1a.58.58,0,0,1-.52.24c-.26-.07-.31-.41-.3-.68a4.39,4.39,0,0,0-.08-1.43,1.29,1.29,0,0,0-1-1c-.71-.1-1.28.63-1.48,1.32a6.23,6.23,0,0,1-.64,2.05,9.26,9.26,0,0,1-.11-3.67,49.89,49.89,0,0,0,.14-7.36" />
      <path id="_Path_6" data-name="&lt;Path&gt;" class="cls-6" d="M175.13,60.75a10,10,0,0,1-5.63,2.11,15.58,15.58,0,0,0-1.76,0,1.57,1.57,0,0,0-1.33,1c-.08.31,0,.64-.13.94-.33.93-1.82.73-2.45,1.49a2.24,2.24,0,0,0-.36,1.4l0,1.63,1.56-.87a3.14,3.14,0,0,0,1.56-1.41,8.44,8.44,0,0,1,.38-1.31,2,2,0,0,1,1.86-.7,4.93,4.93,0,0,0,2.07-.06,9.26,9.26,0,0,0,1.44-1,8.88,8.88,0,0,1,2.59-.8.32.32,0,0,0,.21-.12.32.32,0,0,0,0-.21c-.16-.84.18-1.32,0-2.15" />
      <path id="_Path_7" data-name="&lt;Path&gt;" class="cls-6" d="M175.56,69.25q1.37,0,2.75-.07a7.16,7.16,0,0,0,6.78-7.13q0-2.17,0-4.35c.14,0,.21.18.23.32q.34,2.22.51,4.46a7.11,7.11,0,0,1-6.9,7.61q-1.82,0-3.63.2a1,1,0,0,1,.17-1.13" />
      <path id="_Path_8" data-name="&lt;Path&gt;" class="cls-6" d="M174.93,65.87H172v5.18a1.11,1.11,0,0,0,.13.64c.23.34.73.32,1.14.25l1.53-.24a.29.29,0,0,0,.31-.37l0-2.13a10.24,10.24,0,0,0-.4-3.3" />
      <path id="_Path_9" data-name="&lt;Path&gt;" class="cls-6" d="M187.1,63.68l1.19.32s-.28,8.18-8,7.43v-.9A7.33,7.33,0,0,0,187.1,63.68Z" />
      <polygon id="_Path_10" data-name="&lt;Path&gt;" class="cls-6" points="167.42 66.88 170.98 65.87 170.98 68.5 167.85 69.36 167.42 66.88" />
      <polygon id="_Path_11" data-name="&lt;Path&gt;" class="cls-6" points="168.1 70.54 170.98 69.75 170.98 70.54 168.1 71.48 168.1 70.54" />
      <path id="_Path_12" data-name="&lt;Path&gt;" class="cls-6" d="M168.67,58.81s2.28-2.62,4.86-2.44l.27,3.25s-2.12,2.39-4.25,1.85h-.87Z" />
    </g>
  </g>
</g>
<path id="line2" class="cls-7" d="M141.8,42.55a9.22,9.22,0,0,0,5.6,7.79,4.93,4.93,0,0,0,4.06.09,2.64,2.64,0,0,0,1.23-3.52,1.13,1.13,0,0,0-1.42-.07,2.67,2.67,0,0,0,.41,3c.65.85,1.56,1.48,2.23,2.31,2.12,2.62,1.35,6.75-.92,9.24S147.34,65,144,65.78s-7.28,1.54-8.68,4.65a8.32,8.32,0,0,0-.39,4.44c.51,4.07,2.76,8.61,6.83,9.17,3.78.52,7.32-2.69,11.11-2.23,4.83.58,7.09,6.48,11.45,8.65a8.55,8.55,0,0,0,11.53-5.14" />
<path id="line" class="cls-7" d="M141.8,42.55a9.22,9.22,0,0,0,5.6,7.79,4.93,4.93,0,0,0,4.06.09,2.64,2.64,0,0,0,1.23-3.52,1.13,1.13,0,0,0-1.42-.07,2.67,2.67,0,0,0,.41,3c.65.85,1.56,1.48,2.23,2.31,2.12,2.62,1.35,6.75-.92,9.24S147.34,65,144,65.78s-7.28,1.54-8.68,4.65a8.32,8.32,0,0,0-.39,4.44c.51,4.07,2.76,8.61,6.83,9.17,3.78.52,7.32-2.69,11.11-2.23,4.83.58,7.09,6.48,11.45,8.65a8.55,8.55,0,0,0,11.53-5.14" />
</svg>
              </div>
            </div>
          ) : (
            <div className="reportes-boxes-favs">
              {renderReportes(repAtendidos)}
            </div>
    )}

          </div>
        </div>
      </div>
    </div>

  );
}

export default Favoritos;
