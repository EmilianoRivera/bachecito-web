"use client";import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import AuthContext from "../../context/AuthContext";

function Favoritos() {
    const { isLogged } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [foliosGuardados, setFoliosGuardados] = useState([]);
    const [rep, setRep] = useState([]);

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
    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch("/api/Reportes");
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            // Filtrar los reportes para mostrar solo aquellos que tienen el mismo folio que se guardó
            const filteredReports = data.filter(report => foliosGuardados.includes(report.folio));
            setRep(filteredReports);
            console.log(filteredReports)
          } catch (error) {
            console.log("Error fetching data: ", error);
          }
        }
      
        fetchData();
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
    <div className='body'>
      
     
        <div className={`container-tipos ${showTitles ? '' : 'margin-top'}`}>

        <div className="column">
          <h3 className='tipo' id='sin-at'>Sin Atender</h3>
        </div>

        <div className="column">
          <h3 className='tipo' id='en-at'>En atención</h3>
        </div>

        <div className="column">
          <h3 className='tipo' id='at'>Atendidos</h3>
        </div>

        </div>


      <div className="scrollable-section">
        <div className="container-reportes">
          <div className="column">
            <div className="reportes-boxes">
            {rep.map((report, index) => (
              <div className="box2" id="box2">
                <div className="column-left">
                  <div className="fotografía">
                    <img src= {report.imagenURL} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="" />
                  </div>
                  <div className="column-left-inferior">
                    <div className="fecha">
                        {report.fechaReporte}
                    </div>

                    <div className="contador">
                      <div className="icon">
                        <img
                          src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                          className="logo" 
                        />
                      </div>
                      <div className="number">
                        0
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column-right">
                  <div className="column-right-superior">
                    <div className="estado" id='estado-sin-at'>
                    </div>

                    <div className="guardar">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
                        className="icon-star" 
                      />
                    </div>
                  </div>

                  <div className="ubicacion">
                    <h3>Ubicación</h3>
                    <div className="box-ubi">
                        {report.ubicacion}
                    </div>
                  </div>

                  <div className="descripcion">
                    <h3>Descripción</h3>
                    <div className="box-des">
                    {report.descripcion}
                    </div>
                  </div>
                </div>
              </div>
                 ))}
            </div>
          </div>

          <div className="column">
            <div className="reportes-boxes">
              <div className="box2" id="box2">
                <div className="column-left">
                  <div className="fotografía">
                    <img src="" alt="" />
                  </div>
                  <div className="column-left-inferior">
                    <div className="fecha">
                    </div>

                    <div className="contador">
                      <div className="icon">
                        <img
                          src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                          className="logo" 
                        />
                      </div>
                      <div className="number">
                        0
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column-right">
                  <div className="column-right-superior">
                    <div className="estado" id='estado-en-at'>
                    </div>

                    <div className="guardar">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
                        className="icon-star" 
                      />
                    </div>
                  </div>

                  <div className="ubicacion">
                    <h3>Ubicación</h3>
                    <div className="box-ubi">
                    </div>
                  </div>

                  <div className="descripcion">
                    <h3>Descripción</h3>
                    <div className="box-des">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="column">
            <div className="reportes-boxes">
              <div className="box2" id="box2">
                <div className="column-left">
                  <div className="fotografía">
                    <img src="" alt="" />
                  </div>
                  <div className="column-left-inferior">
                    <div className="fecha">
                    </div>

                    <div className="contador">
                      <div className="icon">
                        <img
                          src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                          className="logo" 
                        />
                      </div>
                      <div className="number">
                        0
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column-right">
                  <div className="column-right-superior">
                    <div className="estado" id='estado-at'>
                    </div>

                    <div className="guardar">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
                        className="icon-star" 
                      />
                    </div>
                  </div>

                  <div className="ubicacion">
                    <h3>Ubicación</h3>
                    <div className="box-ubi">
                    </div>
                  </div>

                  <div className="descripcion">
                    <h3>Descripción</h3>
                    <div className="box-des">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
    </div>
      

    </div>
  );
}

export default Favoritos;


