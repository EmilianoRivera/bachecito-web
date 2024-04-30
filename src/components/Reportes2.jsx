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

    return (

        <div className="reportes-boxes">
            {rep.map((report, index) => (
                <div className="box2" id="box2" key={index}>
                    <div className="prueba">
                        <div className="columnm-left">
                            <div className="fotografía">
                                <img src={report.imagenURL} alt={""} style={{ width: '100%', maxHeight: '100%' }} />
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
            ))}

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

    );
}

export default ReportesComponente;
