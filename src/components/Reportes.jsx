import { useEffect, useState, useContext } from "react";
import "../app/Reportes/Reportes.css";
import React from "react";
import atendidoIcon from '../imgs/fondoVerde.png';
import enProcesoIcon from '../imgs/fondoAmarillo.png';
import sinAtenderIcon from '../imgs/fondoRojo.png';
import AuthContext from "../../context/AuthContext";
import estrella from "../imgs/estrella.png";
import estrellaLlena from "../imgs/estrella2.png";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { desc } from "@/scripts/Cifrado/Cifrar";
function ReportesComponente() {
  const [rep, setRep] = useState([]);
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchFolio, setSearchFolio] = useState("");
  const [searchDate, setSearchDate] = useState("");
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
        const baseURL = process.env.NEXT_PUBLIC_RUTA_R
        const response = await fetch(`${baseURL}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const dataE = data.map(rep => desc(rep))
        setRep(dataE);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);

  // Función para guardar o eliminar el folio en la base de datos
  const toggleGuardarFolio = async (folio) => {
    if (!userData || !userData.uid) {
      console.error("No se proporcionaron datos de usuario válidos.");
      return;
    }

    try {
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
          const foliosGuardados = userData.foliosGuardados || [];

          if (foliosGuardados.includes(folio)) {
            const nuevosFoliosGuardados = foliosGuardados.filter(
              (f) => f !== folio
            );
            await updateDoc(userDocRef, {
              foliosGuardados: nuevosFoliosGuardados,
            });
            console.log("Folio eliminado de la base de datos del usuario.");
          } else {
            const nuevosFoliosGuardados = [...foliosGuardados, folio];
            await updateDoc(userDocRef, {
              foliosGuardados: nuevosFoliosGuardados,
            });
            console.log("Folio guardado en la base de datos del usuario.");
          }
        } else {
          console.error("El documento del usuario no existe en la base de datos.");
        }
      } else {
        console.error("No se encontró ningún documento de usuario que contenga el UID proporcionado.");
      }
    } catch (error) {
      console.error("Error al guardar/eliminar el folio en la base de datos:", error);
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      foliosGuardados: prevUserData.foliosGuardados.includes(folio)
        ? prevUserData.foliosGuardados.filter((f) => f !== folio)
        : [...(prevUserData.foliosGuardados || []), folio],
    }));
  };
  const filteredReports = rep.filter((report) =>
    //report.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) &&
    report.ubicacion.toLowerCase().includes(searchLocation.toLowerCase()) &&
    (searchStatus === "" || report.estado.toLowerCase() === searchStatus.toLowerCase()) &&
    (searchFolio === "" || report.folio.startsWith(searchFolio)) &&
    (searchDate === "" || report.fechaReporte === searchDate)
  );



  return (
    <div>
      <div className="filters-search">
        <input
          className="Buscador"
          type="text"
          placeholder="Buscar ubicación..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <img className="Buscador-img" src="https://i.postimg.cc/k5QNBFHC/busqueda-1.png" alt="" />

        <select
          className="filter-estados"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Sin atender">Sin atender</option>
          <option value="En atención">En atención</option>
          <option value="Atendido">Atendido</option>
        </select>
        <select
          className="filter-estados"
          value={searchFolio}
          onChange={(e) => setSearchFolio(e.target.value)}
        >
          <option value="">Todas las alcaldías</option>
          <option value="001">🐴 Álvaro Obregón</option>
          <option value="002">🐜 Azcapotzalco</option>
          <option value="003">🐷 Benito Juárez</option>
          <option value="004">🐺 Coyoacán</option>
          <option value="005">🌳 Cuajimalpa de Morelos</option>
          <option value="006">🦅 Cuauhtémoc</option>
          <option value="007">🌿 Gustavo A. Madero</option>
          <option value="008">🏠 Iztacalco</option>
          <option value="009">🐭 Iztapalapa</option>
          <option value="010">🏔 La Magdalena Contreras</option>
          <option value="011">🦗 Miguel Hidalgo</option>
          <option value="012">🌾 Milpa Alta</option>
          <option value="013">🌋 Tláhuac</option>
          <option value="014">🦶 Tlalpan</option>
          <option value="015">🌻 Venustiano Carranza</option>
          <option value="016">🐠 Xochimilco</option>


        </select>
      </div>
      <div className="reportes-boxes">


        {filteredReports.length === 0 ? (
          <div className="alert alert-warning">
            <div><h2>No se encontraron resultados </h2></div>
            <div className="completo">
              <div className="ghost">
                <div className="face">
                  <div className="eyes">
                    <span></span><span></span>
                  </div>
                  <div className="mouth"></div>
                </div>

                <div className="hands">
                  <span></span><span></span>
                </div>

                <div className="feet">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          filteredReports.map((report, index) => (
            <div className="box2" id="box2" key={index}>
              <div className="prueba">
                <div className="columnm-left">
                  <div className="fotografía">
                    <img src={report.imagenURL} alt={""} style={{ width: '100%', maxHeight: '100%' }} />
                    <p className="no-foto2">No se pudo cargar la imagen</p>
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
                      <div className="number">{report.contador}</div>
                    </div>
                  </div>
                </div>
                <div className="column-right">
                  <div className="column-right-superior">
                    <div className="estado">
                      {report.estado === "Sin atender" && (
                        <img src={sinAtenderIcon.src} alt={"Sin atender"} style={{ width: "100%", height: "90%", borderRadius: "5vh" }} />
                      )}
                      {report.estado === "En atención" && (
                        <img src={enProcesoIcon.src} alt={"En atención"} style={{ width: "100%", height: "90%", borderRadius: "5vh" }} />
                      )}
                      {report.estado === "Atendido" && (
                        <img src={atendidoIcon.src} alt={"Atendido"} style={{ width: "100%", height: "90%", borderRadius: "5vh" }} />
                      )}
                    </div>
                    <div className="guardar">
                      {userData && userData.uid && userData.foliosGuardados && userData.foliosGuardados.includes(report.folio) ? (
                        <img
                          className="icon-star"
                          src="https://i.postimg.cc/RVrPJ3rN/estrella-1.png"
                          alt="Folio guardado"
                          style={{ opacity: 1, transition: 'opacity 0.3s ease' }}
                          onClick={() => toggleGuardarFolio(report.folio)}
                        />
                      ) : (
                        <img
                          className="icon-star"
                          src="https://i.postimg.cc/52PmmT4T/estrella.png"
                          alt="Guardar folio"
                          style={{ opacity: 0.5, transition: 'opacity 0.3s ease' }}
                          onClick={() => toggleGuardarFolio(report.folio)}
                        />
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
          ))
        )}
      </div>
    </div>
  );
}

export default ReportesComponente;
