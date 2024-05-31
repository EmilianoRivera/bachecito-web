"use client";
import { useEffect, useState } from "react";
import { db, collection, getDocs, updateDoc, deleteDoc, doc , query, where} from "../../firebase"; 
import '../app/Cuenta/Administrador/Reportes/Reportes.css';
import React from 'react';
import Image from "next/image";

export default function ReportesAdmin() {
    const [rep, setRep] = useState([]);

    function showDeleteHeader() {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.add('show-header');
    }
    
    function hideDeleteHeader() {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.remove('show-header');
    }



    useEffect(() => {
        async function fetchData() {
            try {
                const baseURL= process.env.NEXT_PUBLIC_REL
                const response = await fetch(`${baseURL}`);
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
                    // Actualizar el documento para establecer eliminado: false 
                    await updateDoc(doc.ref, { eliminado: false });
                    
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
    const handleClick2 = async (folio) => {
        try {
            const refCollection = collection(db, 'reportes');
            const q = query(refCollection, where("folio", "==", folio));
            const querySnapshot = await getDocs(q);
    
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log(`Se eliminó el reporte con folio ${folio}`);
    
                // Eliminar la fila de la tabla HTML
                const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
                rows.forEach((row) => {
                    if (row.querySelector('.folio').textContent === folio) {
                        row.remove();
                    }
                });
            });
        } catch (error) {
            console.error("Error al eliminar el reporte", error);
        }
    };
    

    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
    const [isDeleteAlertVisible2, setIsDeleteAlertVisible2] = useState(false);
    const [deleteAlertData, setDeleteAlertData] = useState({ folio: null });
    const [deleteAlertData2, setDeleteAlertData2] = useState({ folio: null });

    // Función para mostrar la alerta de eliminación
    const showDeleteAlert = (folio) => {
        setDeleteAlertData({ folio: folio });
        setIsDeleteAlertVisible(true);
    };
    const showDeleteAlert2 = (folio) => {
        setDeleteAlertData2({ folio: folio });
        setIsDeleteAlertVisible2(true);
    };
    // Función para ocultar la alerta de eliminación
    const closeDeleteAlert = () => {
        setIsDeleteAlertVisible(false);
    };
    const closeDeleteAlert2 = () => {
        setIsDeleteAlertVisible2(false);
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
                        <th>RESTAURAR</th>
                        <th>ELIMINAR</th>
                    </tr>
                </thead>
                <tbody>
                    {rep.map((report, index) => (
                        <tr className='Reportes' key={index} onMouseEnter={() => showDeleteHeader()} onMouseLeave={() => hideDeleteHeader()}>
                            <td className='folio'>{report.folio}</td>
                            <td className='fecha'>{report.fechaReporte}</td>
                            <td className='fotografia' style={{ width: '120px', backgroundImage: `url(${report.imagenURL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></td>
                            <td className='estado'>{report.estado}</td>
                            <td className='ubicacion'>{report.ubicacion}</td>
                            <td className='no-reportes'>{report.contador}</td>
                            <td><button className="btn-eliminarRP" onClick={() => showDeleteAlert2(report.folio)}>
                                    <img src="https://i.postimg.cc/9Mb6D7kb/tiempo-pasado.png" alt="" />

                                </button></td>
                            <td>
                              <button className="btn-eliminarRP" onClick={() => showDeleteAlert(report.folio)}>
                                    <img src="https://i.postimg.cc/ht0FfbgQ/circulo-cruzado-1.png" alt="" />

                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isDeleteAlertVisible && (
                <div className="alerta-custom2">
                    <div className="alerta-contenido2">
                        <h2 className="titulooo">Confirmar Eliminación</h2>
                        <p className="textooo">¿Estás seguro de que quieres eliminar el reporte con folio {deleteAlertData.folio} de manera permanente?</p>
                        <div className="opciones">
                            <button className="boton-eliminar" onClick={() => {handleClick2(deleteAlertData.folio); closeDeleteAlert();}}>Eliminar</button>
                            <button className="boton-cancelar" onClick={closeDeleteAlert}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
               {isDeleteAlertVisible2 && (
                <div className="alerta-custom2">
                    <div className="alerta-contenido2">
                        <h2 className="titulooo">Confirmar Restauración</h2>
                        <p className="textooo">¿Estás seguro de que quieres restaurar el reporte con folio {deleteAlertData.folio}?</p>
                        <div className="opciones">
                            <button className="boton-eliminar" onClick={() => {handleClick(deleteAlertData2.folio); closeDeleteAlert2();}}>Restaurar</button>
                            <button className="boton-cancelar" onClick={closeDeleteAlert2}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}


