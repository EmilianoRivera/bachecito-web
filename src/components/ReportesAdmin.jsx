"use client";
import { useEffect, useState } from "react";
import { db, collection, getDocs, updateDoc, doc , query, where} from "../../firebase"; 
import '../app/Cuenta/Administrador/Reportes/Reportes.css';
import React from 'react';
import Image from "next/image";

export default function ReportesAdmin() {
    const [rep, setRep] = useState([]);
    const [isEstadoAlertVisible, setIsEstadoAlertVisible] = useState(false);
    const [alertaEstadoData, setAlertaEstadoData] = useState({ folio: null, estadoActual: null });

    function showDeleteHeader() {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.add('show-header');
    }
    
    function hideDeleteHeader() {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.remove('show-header');
    }

    const showEstadoAlert = (folio, estado) => {
        // Configura los datos de la alerta de cambio de estado
        setAlertaEstadoData({ folio: folio, estadoActual: estado });
        setIsEstadoAlertVisible(true);
    };

    const closeEstadoAlert = () => {
        // Oculta la alerta de cambio de estado
        setIsEstadoAlertVisible(false);
    };

    const updateEstado = async (folio, nuevoEstado) => {
        try {
            // Lógica para actualizar el estado del reporte en la base de datos
            const refCollection = collection(db, 'reportes');
            const querySnapshot = await getDocs(refCollection);
    
            querySnapshot.forEach(async (doc) => {
                const reporte = doc.data();
                if (reporte.folio === folio) {
                    // Actualizar el documento para establecer eliminado: true
                    await updateDoc(doc.ref, { estado: nuevoEstado });
                    
                    console.log(`Se marcó como eliminado el reporte con folio ${folio}`);
                }
            })
            // Actualizar el estado del reporte en la tabla HTML
            const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
            rows.forEach((row) => {
                if (row.querySelector('.folio').textContent === folio) {
                    row.querySelector('.estado').textContent = nuevoEstado;
                }
            });
        } catch (error) {
            console.error("Error al cambiar el estado del reporte", error);
        }
    };
    

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

    const handleClick = async (folio) => {
        try {
            const refCollection = collection(db, 'reportes');
            const querySnapshot = await getDocs(refCollection);
    
            querySnapshot.forEach(async (doc) => {
                const reporte = doc.data();
                if (reporte.folio === folio) {
                    // Actualizar el documento para establecer eliminado: true
                    await updateDoc(doc.ref, { eliminado: true });
                    
                    console.log(`Se marcó como eliminado el reporte con folio ${folio}`);
    
                    // Eliminar la fila de la tabla HTML
                    const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
                    rows.forEach((row) => {
                        if (row.querySelector('.folio').textContent === folio) {
                            row.remove();
                        }
                    });
                }
            });
        } catch (error) {
            console.error("Error al obtener los reportes", error);
        }
    };
    

    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
    const [deleteAlertData, setDeleteAlertData] = useState({ folio: null });

    // Función para mostrar la alerta de eliminación
    const showDeleteAlert = (folio) => {
        setDeleteAlertData({ folio: folio });
        setIsDeleteAlertVisible(true);
    };

    // Función para ocultar la alerta de eliminación
    const closeDeleteAlert = () => {
        setIsDeleteAlertVisible(false);
    };

    return (
        <div className="containerReportesAdmin">
            <table>
                <thead>
                    <tr className='sticky-top'>
                        <th>FOLIO</th>
                        <th>FECHA</th>
                        <th>FOTOGRAFÍA</th>
                        <th>ESTADO</th>
                        <th>DIRECCIÓN</th>
                        <th>#REPORTADO</th>
                        <th className="eliminar-header">ELIMINAR</th>
                    </tr>
                </thead>
                <tbody>
                    {rep.map((report, index) => (
                        <tr className='Reportes' key={index} onMouseEnter={() => showDeleteHeader()} onMouseLeave={() => hideDeleteHeader()}>
                            <td className='folio'>{report.folio}</td>
                            <td className='fecha'>{report.fechaReporte}</td>
                            <td className='fotografia' style={{ width: '120px', backgroundImage: `url(${report.imagenURL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></td>
                            <td className='estado' onClick={() => showEstadoAlert(report.folio, report.estado)}>{report.estado}</td>
                            <td className='ubicacion'>{report.ubicacion}</td>
                            <td className='no-reportes'>{report.contador}</td>
                            <td className='eliminar'>
                              <button className="btn-eliminarRP" onClick={() => showDeleteAlert(report.folio)}>
                                    <img src="https://i.postimg.cc/MKhNs3ZQ/circulo-negativo.png" alt="" />

                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEstadoAlertVisible && (
                <div className="alerta-custom">
                    <div className="alerta-contenido">
                        <button className="boton-cerrar" onClick={closeEstadoAlert}><img src="https://i.postimg.cc/C5pcdxv9/cancelar.png"/></button>
                        <h2 className="titulooo">Cambiar estado del reporte</h2>
                        <p className="textooo">Elige el nuevo estado para el reporte con folio {alertaEstadoData.folio}</p>
                        <button onClick={() => updateEstado(alertaEstadoData.folio, 'Sin atender')} className="opc-cambios1">Sin atender</button>
                        <button onClick={() => updateEstado(alertaEstadoData.folio, 'En atención')} className="opc-cambios2">En atención</button>
                        <button onClick={() => updateEstado(alertaEstadoData.folio, 'Atendido')} className="opc-cambios3">Atendido</button>
                        <button className="boton-aceptar" onClick={closeEstadoAlert}>Aceptar</button>
                    </div>
                </div>
            )}

            {isDeleteAlertVisible && (
                <div className="alerta-custom2">
                    <div className="alerta-contenido2">
                        <h2 className="titulooo">Confirmar Eliminación</h2>
                        <p className="textooo">¿Estás seguro de que quieres eliminar el reporte con folio {deleteAlertData.folio}?</p>
                        <div className="opciones">
                            <button className="boton-eliminar" onClick={() => {handleClick(deleteAlertData.folio); closeDeleteAlert();}}>Eliminar</button>
                            <button className="boton-cancelar" onClick={closeDeleteAlert}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}


