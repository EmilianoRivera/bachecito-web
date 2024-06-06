"use client";
import { useEffect, useState, useContext } from "react";
import "../app/Reportes/Reportes.css";
import React from "react";
import atendidoIcon from '../imgs/fondoVerde.png';
import enProcesoIcon from '../imgs/fondoAmarillo.png';
import sinAtenderIcon from '../imgs/fondoRojo.png';
import AuthContext from "../../context/AuthContext";
import Link from 'next/link';
import estrella from "../imgs/estrella.png";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";
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
    const [selectedReportIndex, setSelectedReportIndex] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [searchFolio, setSearchFolio] = useState("");
    const [searchDate, setSearchDate] = useState("");
    useEffect(() => {
        const fetchUserData = async () => {
            if (isLogged) {
                try {
                    const currentUid = auth.currentUser.uid
                    const id = enc(currentUid)
                    const uid = encodeURIComponent(id)
                    const baseURL= process.env.NEXT_PUBLIC_RUTA_U
                    const res = await fetch(`${baseURL}/${uid}`)
                    if(!res.ok) {
                        throw new Error("Error al obtener la información");   
                    }
                    const data = res.json()
                    const datDesc = desc(data)
                    console.log(datDesc)
                    setUserData(datDesc)
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
                    throw new Error("Error al traer los reportes");
                }
                const data = await response.json();
                const dataD = data.map(rep => desc(rep))
                console.log(dataD)
                setRep(dataD);
            } catch (error) {
                console.log("Error al traer la información: ", error);
            }
        }

        fetchData();
    }, []);
    const handleStarClick = (index) => {
        setSelectedReportIndex(index);
        setShowAlert(true);
    };

    const handleAlertButton = (action) => {
        // Aquí puedes manejar la lógica para los botones de la alerta
        if (action === "confirm") { 
            // Acción cuando se confirma la alerta
        } else if (action === "cancel") {
        }
        setShowAlert(false);
    };

    const filteredReports = rep.filter((report) => {
        const locationMatch = report.ubicacion.toLowerCase().includes(searchLocation.toLowerCase());
        const statusMatch = searchStatus === "" || report.estado.toLowerCase() === searchStatus.toLowerCase();
        const folioMatch = searchFolio === "" || report.folio.startsWith(searchFolio);
        const dateMatch = searchDate === "" || report.fechaReporte === searchDate;
        return locationMatch && statusMatch && folioMatch && dateMatch;
      });

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

            <div className="responsive-filters">
            <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="filter-estados"
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
            </div>

            <div className="reportes-boxes">
            
            {/* <input
    type="text"
    placeholder="Buscar fecha (DD/MM/YYYY)..."
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
/> */}
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
                                    <div className="estado">  {report.estado === "Sin atender" && (
                                        <img src={sinAtenderIcon.src} alt={"Sin atender"} style={{ width: "100%", height: "90%", borderRadius: "5vh" }} />
                                    )}
                                        {report.estado === "En atención" && (
                                            <img src={enProcesoIcon.src} alt={"En atención"} style={{ width: "100%", height: "90%", borderRadius: "5vh" }} />
                                        )}
                                        {report.estado === "Atendido" && (
                                            <img src={atendidoIcon.src} alt={"Atendido"} style={{ width: "100%", height: "90%", borderRadius: "5vh" }} />
                                        )}</div>
                                    <div className="guardar">
                                        <img className="icon-star" src={estrella.src} alt="Guardar folio" onClick={() => handleStarClick(index)} />
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
            {showAlert && (
                <div className="custom-alert">
                    <div className="alert-content">
                        <h3 className="titulooo">¡Momento! ✋</h3>
                        <p className="textooo">Necesitas tener una cuenta y una sesión activa para poder realizar esta acción</p>
                        <div className="alert-buttons">
                            <Link className="opc-cambios1" href="/Cuenta">
                                Ir a cuenta
                            </Link>
                            <button className="opc-cambios2" onClick={() => handleAlertButton("cancel")}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
        

    );
}

export default ReportesComponente;