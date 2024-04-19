"use client";
import { useEffect, useState } from "react";
import { db, collection, getDocs, updateDoc, doc , query, where} from "../../firebase"; 
import '../app/Cuenta/Administrador/Reportes/Reportes.css';
import React from 'react';

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
    
    const handleEstadoClick = async (folio, estado) => {
        const newState = prompt(`Presione 1 para Sin atender, 2 para En atención, 3 para Atendido`);
        if (newState === '1') {
            await updateEstado(folio, 'Sin atender');
        } else if (newState === '2') {
            await updateEstado(folio, 'En atención');
        } else if (newState === '3') {
            await updateEstado(folio, 'Atendido');
        } else {
            alert('Opción inválida');
        }
    };

    //Aqui va algo


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
            await updateEstado(folio, nuevoEstado);

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

    const handleClick = async (folio) =>  {
        try {
            const refCollection = collection(db, 'reportes');
            const reportesSnapshot = await getDocs(refCollection);
            
            reportesSnapshot.forEach(async (reporteDoc) => {
                const reporte = reporteDoc.data();
                if (reporte.folio === folio) {
                 
                    console.log(`Se quito el reporte con folio ${folio}`);
                    
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
                            <td className='no-reportes'>-</td>
                            <td className='eliminar'>
                                <button className="btn-eliminarRP" onClick={() => {handleClick(report.folio)}}>
                                    <img src="https://i.postimg.cc/02gZVXL3/basura.png" alt="" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEstadoAlertVisible && (
                <div className="alerta-custom">
                    <div className="alerta-contenido">
                        <h2>Cambiar estado del reporte</h2>
                        <p>Elige el nuevo estado para el reporte con folio {alertaEstadoData.folio}</p>
                        <button onClick={() => updateEstado(alertaEstadoData.folio, 'Sin atender')}>Sin atender</button>
                        <button onClick={() => updateEstado(alertaEstadoData.folio, 'En atención')}>En atención</button>
                        <button onClick={() => updateEstado(alertaEstadoData.folio, 'Atendido')}>Atendido</button>
                        <button className="boton-cerrar" onClick={closeEstadoAlert}>Cerrar</button>
                    </div>
                </div>
            )}

        </div>
    );
}


