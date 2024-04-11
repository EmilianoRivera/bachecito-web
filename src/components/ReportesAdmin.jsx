
"use client"
import { useEffect, useState } from "react";
import '../app/Cuenta/Administrador/Reportes/Reportes.css';
import React from 'react';

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

    return (
        <div className="containerReportesAdmin">
            <table>
                <thead>
                    <tr className='sticky-top'>
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
                            <td className='fecha'>{report.fechaReporte}</td>
                            <td className='fotografia' style={{ width: '120px', backgroundImage: `url(${report.imagenURL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></td>
                            <td className='estado'>{report.estado}</td>
                            <td className='ubicacion'>{report.ubicacion}</td>
                            <td className='no-reportes'>-</td>
                            <td className='eliminar'>
                                <button className="btn-eliminarRP">
                                    <img src="https://i.postimg.cc/02gZVXL3/basura.png" alt="" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


