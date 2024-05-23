"use client"
import React, { useEffect, useState } from 'react';
import { db } from "../../../../../firebase";
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';

import "./usuers.css";

function Page() {
    const [users, setUsers] = useState([]);
    const [selectedIncidentDates, setSelectedIncidentDates] = useState({});
    const [descripcionIncidencia, setDescripcionIncidencia] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/Usuarios');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                // Filtrar los usuarios que tienen el rol 'usuario'
                const filteredUsers = data.filter(user => user.rol === 'usuario');
                setUsers(filteredUsers);
            } catch (error) {
                console.log('Error fetching data: ', error);
            }
        }

        fetchData();
    }, []);

    const incidencia = async (uid, descripcion) => {
        try {
            const userQuery = query(
                collection(db, 'usuarios'),
                where('uid', '==', uid)
            );
            const userDocs = await getDocs(userQuery);
    
            userDocs.forEach(async (document) => {
                const userRef = doc(db, 'usuarios', document.id);
                const userData = document.data();
                const newIncidenciasCount = (userData.incidencias || 0) + 1;
    
                const updates = {
                    incidencias: newIncidenciasCount,
                };
    
                if (newIncidenciasCount === 1) {
                    updates.Primerincidencia = Timestamp.fromDate(new Date());
                    updates.descripcionPrimerIncidencia = descripcion;
                } else if (newIncidenciasCount === 2) {
                    updates.SegundaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionSegundaIncidencia = descripcion;
                } else if (newIncidenciasCount === 3) {
                    updates.TercerIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionTercerIncidencia = descripcion;
                }
    
                await updateDoc(userRef, updates);
            });
        } catch (error) {
            console.error('Error updating incidencias: ', error);
        }
    };
    
const handleDetailsClick = async (uid) => {
    try {
        const userQuery = query(
            collection(db, 'usuarios'),
            where('uid', '==', uid)
        );
        const userDocs = await getDocs(userQuery);

        userDocs.forEach((document) => {
            const userData = document.data();
            setSelectedIncidentDates({
                primera: {
                    fecha: userData.Primerincidencia ? new Date(userData.Primerincidencia.seconds * 1000).toLocaleString() : 'No hay incidencias',
                    descripcion: userData.descripcionPrimerIncidencia || 'No hay descripción'
                },
                segunda: {
                    fecha: userData.SegundaIncidencia ? new Date(userData.SegundaIncidencia.seconds * 1000).toLocaleString() : 'No hay segunda incidencia',
                    descripcion: userData.descripcionSegundaIncidencia || 'No hay descripción'
                },
                tercer: {
                    fecha: userData.TercerIncidencia ? new Date(userData.TercerIncidencia.seconds * 1000).toLocaleString() : 'No hay tercera incidencia',
                    descripcion: userData.descripcionTercerIncidencia || 'No hay descripción'
                }
            });
        });
    } catch (error) {
        console.error('Error fetching incident dates: ', error);
    }
};


    return (
        <div className='main-container'>
            <h1>Usuarios</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado de la cuenta</th>
                        <th>No. de Reportes</th>
                        <th>No. de Incidencias</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.uid}>
                            <td>{user.nombre} {user.apellidoPaterno}</td>
                            <td>{user.correo}</td>
                            <td>{user.estadoCuenta ? 'Activa' : 'Deshabilitada'}</td>
                            <td>{user.numRep ?? 0}</td>
                            <td>{user.incidencias ?? 0}</td>
                            <td>
                                <button onClick={() => handleDetailsClick(user.uid)}>Detalles</button>
                            </td>
                            <td>
                                <input type="text" value={descripcionIncidencia} onChange={(e) => setDescripcionIncidencia(e.target.value)} placeholder="Descripción" />
                                <button onClick={() => incidencia(user.uid, descripcionIncidencia)}>Agregar incidencia</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedIncidentDates.primera && (
            <div className="incident-details">
            <h2>Incidencias</h2>
            {selectedIncidentDates.primera && (
    <div>
        <h2>Primera Incidencia</h2>
        <p>Fecha: {selectedIncidentDates.primera.fecha}</p>
        <p>Descripción: {selectedIncidentDates.primera.descripcion}</p>
    </div>
)}
{selectedIncidentDates.segunda && (
    <div>
        <h2>Segunda Incidencia</h2>
        <p>Fecha: {selectedIncidentDates.segunda.fecha}</p>
        <p>Descripción: {selectedIncidentDates.segunda.descripcion}</p>
    </div>
)}
{selectedIncidentDates.tercer && (
    <div>
        <h2>Tercera Incidencia</h2>
        <p>Fecha: {selectedIncidentDates.tercer.fecha}</p>
        <p>Descripción: {selectedIncidentDates.tercer.descripcion}</p>
    </div>
)}

        </div>
        
            )}
        </div>
    );
}

export default Page;
