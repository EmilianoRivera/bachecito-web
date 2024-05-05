"use client"
import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import AuthContext from "../../context/AuthContext";

function Favoritos() {
    const { isLogged } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [foliosGuardados, setFoliosGuardados] = useState([]);
    const [rep, setRep] = useState([]);
    const [repSinAtender, setRepSinAtender] = useState([]);
    const [repEnAtencion, setRepEnAtencion] = useState([]);
    const [repAtendidos, setRepAtendidos] = useState([]);

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
                      // Obtener los folios guardados del usuario
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


  const eliminarFolio = async (folio, userData) => {
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

                        console.log("Folio eliminado de la base de datos del usuario.");
                    } else {
                        console.log("El folio no estaba presente en la base de datos del usuario.");
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
              
              // Filtrar los reportes para cada estado basado en los folios guardados
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
        const navbarHeight = 5; // Ajusta según la altura de tu navbar
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

    
  
  return (
    <div className='body-favoritos'>
      
     
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
          <div className="column-favs">
            <div className="reportes-boxes-favs">
            {repSinAtender.map((report, index) => (
              <div className="box2-favs" key={index}>
                <div className="column-favs-left">
                  <div className="fotografía-favs">
                    <img src= {report.imagenURL} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius:"1rem", }} alt="" />
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
                    <div className="estado-favs" id='estado-sin-at'>
                    </div>

                    <div className="guardar-favs">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
                        className="icon-favs-star"  onClick={() => eliminarFolio(report.folio, userData)}
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
                 ))}
            </div>
          </div>

          <div className="column-favs">
            <div className="reportes-boxes-favs">
            {repEnAtencion.map((report, index) => (
              <div key={index} className="box2-favs" >
                <div className="column-favs-left">
                  <div className="fotografía-favs">
                    <img src= {report.imagenURL} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius:"1rem" }}alt="" />
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
                    <div className="estado-favs" id='estado-en-at'>
                    </div>

                    <div className="guardar-favs">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
                        className="icon-favs-star" onClick={() => eliminarFolio(report.folio, userData)}
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
                 ))}
            </div>
          </div>

          <div className="column-favs">
            <div className="reportes-boxes-favs">
            {repAtendidos.map((report, index) => (
              <div key={index} className="box2-favs" >
                <div className="column-favs-left">
                  <div className="fotografía-favs">
                    <img src= {report.imagenURL} style={{ width: '100%', height: '100%', borderRadius:"1rem" }} alt="Imagen bache ATENDIDO" />
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
                    <div className="estado-favs" id='estado-at'>
                    </div>

                    <div className="guardar-favs">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
                        className="icon-favs-star" onClick={() => eliminarFolio(report.folio, userData)}
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
                 ))}
            </div>
          </div>
          
        </div>
        
    </div>
      

    </div>
  );
}

export default Favoritos;


