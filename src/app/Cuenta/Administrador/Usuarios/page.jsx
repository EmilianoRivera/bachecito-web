"use client"
import React, { useEffect, useState } from 'react';
import { db } from "../../../../../firebase";
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';

import "./usuers.css";

function Page() {
    const [users, setUsers] = useState([]);
    const [selectedIncidentDates, setSelectedIncidentDates] = useState({});
    const [descripcionIncidencia, setDescripcionIncidencia] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const baseURL= process.env.NEXT_PUBLIC_RUTA_US
                const response = await fetch(`${baseURL}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
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

            // Reset description and close modal after adding the incident
            setDescripcionIncidencia("");
            closeModal();
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

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching incident dates: ', error);
        }
    };

    const openModal = (user) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
        setSelectedIncidentDates({});
    };

    return (
        <div className='main-container-users'>
            <table>
                <thead>
                    <tr className='sticky-top'>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado de la cuenta</th>
                        <th>#Reportes</th>
                        <th>#Incidencias</th>
                        <th>Acciones</th>
                        <th className="eliminar-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr className='Users' key={user.uid}>
                            <td>{user.nombre} {user.apellidoPaterno}</td>
                            <td>{user.correo}</td>
                            <td>{user.estadoCuenta ? 'Activa' : 'Deshabilitada'}</td>
                            <td>{user.numRep ?? 0}</td>
                            <td>{user.incidencias ?? 0}</td>
                            <td className='agregar-incidencia' onClick={() => openModal(user)}>
                                    <img src="https://i.postimg.cc/59R2s3rn/agregar-documento.png" alt="" />
                                    <span>Agregar incidencia</span>
                            </td>
                            <td className='eliminar'>
                                <button className="Detalles" onClick={() => handleDetailsClick(user.uid)}>
                                    <img src="https://i.postimg.cc/SsXLv1Zf/informacion-del-circulo-de-archivos.png" alt="" />
                                    <span>Detalles de incidencias</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="boton-cerrar" onClick={closeModal}><img src="https://i.postimg.cc/C5pcdxv9/cancelar.png" /></button>
                        {currentUser ? (
                            <div className='incidencia-abierta'>
                                <h2>¡Cuentanos lo que sucedió!</h2>
                               <div className='inc-flex'>
                               <input 
                                className='des-incidencia'
                                    type="text" 
                                    value={descripcionIncidencia} 
                                    onChange={(e) => setDescripcionIncidencia(e.target.value)} 
                                    placeholder="Descripción" 
                                />
                                <button className='Btnagregar-incidencia' onClick={() => incidencia(currentUser.uid, descripcionIncidencia)}>Agregar incidencia</button>
                               </div>
                            </div>
                        ) : (
                            <>
                                {selectedIncidentDates.primera && (
                                    <div className='incidencia-abierta'>
                                        <div className='numero-incidencia'>
                                            <h3>PRIMERA INCIDENCIA</h3>
                                            <p><i>Fecha:</i> {selectedIncidentDates.primera.fecha}</p>
                                        </div>
                                        <div className='Datos-incidencia'>
                                            <p><i>Descripción:</i> {selectedIncidentDates.primera.descripcion}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedIncidentDates.segunda && (
                                    <div className='incidencia-abierta'>
                                        <div className='numero-incidencia'>
                                            <h3>SEGUNDA INCIDENCIA</h3>
                                            <p><i>Fecha:</i> {selectedIncidentDates.segunda.fecha}</p>
                                        </div>
                                        <div className='Datos-incidencia'>
                                            <p><i>Descripción:</i> {selectedIncidentDates.segunda.descripcion}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedIncidentDates.tercer && (
                                    <div className='incidencia-abierta'>
                                        <div className='numero-incidencia'>
                                            <h3>TERCERA INCIDENCIA</h3>
                                            <p><i>Fecha:</i> {selectedIncidentDates.tercer.fecha}</p>
                                        </div>
                                        <div className='Datos-incidencia'>
                                            <p><i>Descripción:</i> {selectedIncidentDates.tercer.descripcion}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
