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
        const response = await fetch("/api/Reportes");
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
            <div className="reportes-boxes-favs">
              {renderReportes(repSinAtender)}
            </div>
          </div>
          <div className={`column-favs ${selectedColumn === "en-atencion" ? 'show' : 'hide'}`}>
            <div className="reportes-boxes-favs">
              {renderReportes(repEnAtencion)}
            </div>
          </div>
          <div className={`column-favs ${selectedColumn === "atendidos" ? 'show' : 'hide'}`}>
            <div className="reportes-boxes-favs">
              {renderReportes(repAtendidos)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favoritos;
