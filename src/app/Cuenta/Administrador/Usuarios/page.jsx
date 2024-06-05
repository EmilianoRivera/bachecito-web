"use client"
import React, { useEffect, useState } from 'react';
import { db } from "../../../../../firebase";
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { desc } from '@/scripts/Cifrado/Cifrar';
import "./usuers.css";

function Page() {
    const [users, setUsers] = useState([]);
    const [selectedIncidentDates, setSelectedIncidentDates] = useState({});
    const [descripcionIncidencia, setDescripcionIncidencia] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [estado, setEstado] = useState("Alta");
    const [estadoCuentaFilter, setEstadoCuentaFilter] = useState("Todos");
    const [inhabilitadaFilter, setInhabilitadaFilter] = useState("Todos");
    const [numIncidenciasFilter, setNumIncidenciasFilter] = useState("Todos");
    const [verificadoFilter, setVerificadoFilter] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetchFilteredUsers();
    }, [estadoCuentaFilter, inhabilitadaFilter, numIncidenciasFilter, verificadoFilter]);

    useEffect(() => {
        filterUsersBySearchQuery();
    }, [searchQuery, users]);


    async function fetchFilteredUsers() {
        try {
            const baseURL = process.env.NEXT_PUBLIC_RUTA_US;
            const response = await fetch(`${baseURL}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            const dataDesc = data.map(rep => desc(rep));

            let filteredUsers = dataDesc.filter(user => user.rol === 'usuario');

            if (estadoCuentaFilter !== "Todos") {
                filteredUsers = filteredUsers.filter(user => user.inhabilitada === (estadoCuentaFilter === "true"));
            }
            if (inhabilitadaFilter !== "Todos") {
                filteredUsers = filteredUsers.filter(user => user.estadoCuenta === (inhabilitadaFilter === "true"));
            }
            if (verificadoFilter !== "Todos") {
                filteredUsers = filteredUsers.filter(user => user.verificado === (verificadoFilter === "true"));
            }
            if (numIncidenciasFilter !== "Todos") {
                filteredUsers = filteredUsers.filter(user => user.incidencias === parseInt(numIncidenciasFilter));
            }

            setUsers(filteredUsers);
            setFilteredUsers(filteredUsers);
        } catch (error) {
            console.log('Error fetching data: ', error);
        }
    }
    
    
   
    const filterUsersBySearchQuery = () => {
        const queryLowered = searchQuery.toLowerCase();
        const filtered = users.filter(user => {
            const fullName = `${user.nombre} ${user.apellidoPaterno}`.toLowerCase();
            return (
                fullName.includes(queryLowered) ||
                user.correo.toLowerCase().includes(queryLowered)
            );
        });
        setFilteredUsers(filtered);
    };


    const handleEstadoCuentaFilterChange = (e) => {
        setEstadoCuentaFilter(e.target.value);
    };
    
    const handleInhabilitadaFilterChange = (e) => {
        setInhabilitadaFilter(e.target.value);
    };
    const handleVerificadoFilterChange = (e) => {
        setVerificadoFilter(e.target.value);
    };
    
    
    const handleNumIncidenciasFilterChange = (e) => {
        setNumIncidenciasFilter(e.target.value);
    };
        
    const handleEstadoChange = (e) => {
        const estadoSeleccionado = e.target.value;
        setEstado(estadoSeleccionado)
    };
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const sendEmail = async (email, subject, text, incidenciaNum, nombreUsuario) => {
        try {
            const response = await fetch(`/api/sendEmail/${email}/${subject}/${text}/${incidenciaNum}/${nombreUsuario}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: subject,
                    text: text,
                    incidenciaNum: incidenciaNum,
                    nombreUsuario: nombreUsuario,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to send email');
            }
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email: ', error);
        }
    };
    const incidencia = async (uid, descripcion, prioridad) => {
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
                    updates.prioridadPrimerI= prioridad;
                } else if (newIncidenciasCount === 2) {
                    updates.SegundaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionSegundaIncidencia = descripcion;
                    updates.prioridadSegundaI= prioridad;
                } else if (newIncidenciasCount === 3) {
                    updates.TercerIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionTercerIncidencia = descripcion;
                    updates.prioridadTercerI= prioridad;
                    updates.inhabilitada = true;
                } else if (newIncidenciasCount === 4) {
                    updates.CuartaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionCuartaIncidencia = descripcion;
                    updates.prioridadCuartaI= prioridad;
                } else if (newIncidenciasCount === 5) {
                    updates.QuintaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionQuintaIncidencia = descripcion;
                    updates.prioridadQuintaI= prioridad;
                } else if (newIncidenciasCount === 6) {
                    updates.SextaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionSextaIncidencia = descripcion;
                    updates.prioridadSextaI= prioridad;
                    updates.inhabilitada = true;
                }

                const fullName = `${userData.nombre} ${userData.apellidoPaterno}`.toLowerCase();
                await updateDoc(userRef, updates);
                await sendEmail(
                    userData.correo,
                    'Nueva Incidencia Registrada',
                    `
                    Se ha registrado la incidencia número ${newIncidenciasCount} en tu cuenta de Bachecito 26:
                                    
                    Descripción: ${descripcion}
                    Gravedad: ${prioridad}
                    `,
                     newIncidenciasCount,
                     fullName
                );
            });

            // Reset description and close modal after adding the incident
            setDescripcionIncidencia("");
            closeModal();
        } catch (error) {
            console.error('Error updating incidencias: ', error);
        }
    };

    const habilitarCuenta = async (uid) => {
        try {
            const userQuery = query(
                collection(db, 'usuarios'),
                where('uid', '==', uid)
            );
            const userDocs = await getDocs(userQuery);

            userDocs.forEach(async (document) => {
                const userRef = doc(db, 'usuarios', document.id);
                await updateDoc(userRef, { inhabilitada: false});
            });

            // Fetch users again to refresh the data
            fetchFilteredUsers();
        } catch (error) {
            console.error('Error disabling account: ', error);
        }
    };
    const inhabilitarCuenta = async (uid) => {
        try {
            const userQuery = query(
                collection(db, 'usuarios'),
                where('uid', '==', uid)
            );
            const userDocs = await getDocs(userQuery);

            userDocs.forEach(async (document) => {
                const userRef = doc(db, 'usuarios', document.id);
                await updateDoc(userRef, { inhabilitada: true});
            });

            // Fetch users again to refresh the data
            fetchFilteredUsers();
        } catch (error) {
            console.error('Error disabling account: ', error);
        }
    };
 
    const handleDetailsClick = async (uid, detailsType) => {
        try {
            const userQuery = query(
                collection(db, 'usuarios'),
                where('uid', '==', uid)
            );
            const userDocs = await getDocs(userQuery);
    
            userDocs.forEach((document) => {
                const userData = document.data();
                let selectedIncidents = {};
    
                if (detailsType === 1) {
                    selectedIncidents = {
                        primera: {
                            fecha: userData.Primerincidencia ? new Date(userData.Primerincidencia.seconds * 1000).toLocaleString() : 'No hay incidencias',
                            descripcion: userData.descripcionPrimerIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadPrimerI || 'No se asignó nivel de gravedad'
                        },
                        segunda: {
                            fecha: userData.SegundaIncidencia ? new Date(userData.SegundaIncidencia.seconds * 1000).toLocaleString() : 'No hay segunda incidencia',
                            descripcion: userData.descripcionSegundaIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadSegundaI || 'No se asignó nivel de gravedad'
                        },
                        tercer: {
                            fecha: userData.TercerIncidencia ? new Date(userData.TercerIncidencia.seconds * 1000).toLocaleString() : 'No hay tercera incidencia',
                            descripcion: userData.descripcionTercerIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadTercerI || 'No se asignó nivel de gravedad'
                        }
                    };
                } else if (detailsType === 2) {
                    selectedIncidents = {
                        primera: {
                            fecha: userData.Primerincidencia ? new Date(userData.Primerincidencia.seconds * 1000).toLocaleString() : 'No hay incidencias',
                            descripcion: userData.descripcionPrimerIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadPrimerI || 'No se asignó nivel de gravedad'
                        },
                        segunda: {
                            fecha: userData.SegundaIncidencia ? new Date(userData.SegundaIncidencia.seconds * 1000).toLocaleString() : 'No hay segunda incidencia',
                            descripcion: userData.descripcionSegundaIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadSegundaI || 'No se asignó nivel de gravedad'
                        },
                        tercer: {
                            fecha: userData.TercerIncidencia ? new Date(userData.TercerIncidencia.seconds * 1000).toLocaleString() : 'No hay tercera incidencia',
                            descripcion: userData.descripcionTercerIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadTercerI || 'No se asignó nivel de gravedad'
                        },
                        cuarta: {
                            fecha: userData.CuartaIncidencia ? new Date(userData.CuartaIncidencia.seconds * 1000).toLocaleString() : 'No hay cuarta incidencia',
                            descripcion: userData.descripcionCuartaIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadCuartaI || 'No se asignó nivel de gravedad'
                        },
                        quinta: {
                            fecha: userData.QuintaIncidencia ? new Date(userData.QuintaIncidencia.seconds * 1000).toLocaleString() : 'No hay quinta incidencia',
                            descripcion: userData.descripcionQuintaIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadQuintaI || 'No se asignó nivel de gravedad'
                        },
                        sexta: {
                            fecha: userData.SextaIncidencia ? new Date(userData.SextaIncidencia.seconds * 1000).toLocaleString() : 'No hay sexta incidencia',
                            descripcion: userData.descripcionSextaIncidencia || 'No hay descripción',
                            prioridad: userData.prioridadSextaI || 'No se asignó nivel de gravedad'
                        }
                    };
                }
    
                setSelectedIncidentDates(selectedIncidents);
            });
    
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching incident dates: ', error);
        }
    };
    
    function formatTimestamp(timestamp) {
        if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
          const dateObject = new Date(timestamp.seconds * 1000);
          return dateObject.toLocaleDateString();
        } else {
          return "No se puede convertir el timestamp";
        }
      }

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
            <div>
            <select onChange={handleEstadoCuentaFilterChange}>
            <option value="Todos">Todos los Accesos</option>
                <option value="false">Habilitado</option>
                <option value="true">Inhabilitado</option>
            </select>
            <select onChange={handleInhabilitadaFilterChange}>
            <option value="Todos">Todos los Estados</option>
                <option value="true">Activa</option>
                <option value="false">Desactivada</option>
                </select>
            <select onChange={handleVerificadoFilterChange}>
            <option value="Todos">Todos los estados de Verificación</option>
                <option value="true">Verificado</option>
                <option value="false">No verificado</option>
                </select>
            <select onChange={handleNumIncidenciasFilterChange}>
            <option value="Todos">Numero de Incidencias</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </select>
                <input
                    className="Buscador"
                    type="text"
                    placeholder="Buscar Email o nombre..."
                    value={searchQuery}
                    onChange={handleSearchQueryChange}></input>
            </div>
                
            <table>
                <thead>
                    <tr className='sticky-top'>
                    <th>Fecha de Creación</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado de Verificación</th>
                        <th>Estado de la cuenta</th>
                        <th>Acceso al sistema</th>
                        <th>#Reportes</th>
                        <th>#Incidencias</th>
                        <th>Acciones</th>
                        <th className="eliminar-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr className='Users' key={user.uid}>
                             <td>{formatTimestamp(user.fechaCreacion)}</td>
                            <td>{user.nombre} {user.apellidoPaterno}</td>
                            <td>{user.correo}</td>
                            <td>{user.verificado ? 'Verificada' : 'No verificado'}</td>
                            <td>{user.estadoCuenta ? 'Activa' : 'Desactivada'}</td>
                            <td>{user.inhabilitada ? 'Inhabilitado' : 'Habilitado'}</td>
                            <td>{user.numRep}</td>
                            <td>{user.incidencias}</td>
                           {user.incidencias < 6 && user.inhabilitada === false && (
    <td className='agregar-incidencia' onClick={() => openModal(user)}>
        <img src="https://i.postimg.cc/59R2s3rn/agregar-documento.png" alt="Agregar documento" />
        <span>Agregar incidencia</span>
    </td>
) }
{user.incidencias === 6 && (
    <td>No se pueden agregar más incidencias</td>
)}

{ user.incidencias >= 3 && user.inhabilitada === false && (
    <td className='desactivar-cuenta' onClick={() => inhabilitarCuenta(user.uid)}>
        <img src="https://i.postimg.cc/4xrhj7Wb/eliminar-documento-2.png" alt="Agregar documento" />
        <span>Inhabilitar cuenta</span>
    </td>
)}

  {user.incidencias >= 3 && user.incidencias < 6 && user.inhabilitada === true && (
    <td className='desactivar-cuenta' onClick={() => habilitarCuenta(user.uid)}>
        <img src="https://i.postimg.cc/4xrhj7Wb/eliminar-documento-2.png" alt="Agregar documento" />
        <span>Habilitar cuenta</span>
    </td>
)}
       {user.incidencias > 0 && (
    <td className='eliminar'>
        <button className="Detalles" onClick={() => handleDetailsClick(user.uid, user.incidencias <= 3 ? 1 : 2)}>
            <span>{user.incidencias <= 3 ? 'Detalles de incidencias' : 'Detalles de incidencias 2'}</span>
        </button>
    </td>
)}
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
                               <select className='gravedad' onChange={handleEstadoChange}>
                                <option value="Alta">Alta</option>
                                <option value="Media">Media</option>
                                <option value="Baja">Baja</option>
                            </select>
                               <input 
                                className='des-incidencia'
                                    type="text" 
                                    value={descripcionIncidencia} 
                                    onChange={(e) => setDescripcionIncidencia(e.target.value)} 
                                    placeholder="Descripción" 
                                />
                                  
                                <button className='Btnagregar-incidencia' onClick={() => incidencia(currentUser.uid, descripcionIncidencia, estado)}>Agregar incidencia</button>
                               </div>
                            </div>
                        ) : (
                            <>
                                {selectedIncidentDates.primera && (
                                    <div className='incidencia-abierta2'>
                                        <div className='numero-incidencia'>
                                            <h3>PRIMERA INCIDENCIA</h3>
                                            <p><i>Fecha:</i> {selectedIncidentDates.primera.fecha}</p>
                                        </div>
                                        <div className='Datos-incidencia2'>
                                        <p><i>Gravedad:</i> {selectedIncidentDates.primera.prioridad}</p>
                                            <div className='Datos-incidencia'>
                                            <p ><i>Descripción:</i> {selectedIncidentDates.primera.descripcion}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedIncidentDates.segunda && (
                                    <div className='incidencia-abierta2'>
                                    <div className='numero-incidencia'>
                                        <h3>SEGUNDA INCIDENCIA</h3>
                                        <p><i>Fecha:</i> {selectedIncidentDates.segunda.fecha}</p>
                                    </div>
                                    <div className='Datos-incidencia2'>
                                    <p><i>Gravedad:</i> {selectedIncidentDates.segunda.prioridad}</p>
                                        <div className='Datos-incidencia'>
                                        <p ><i>Descripción:</i> {selectedIncidentDates.segunda.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                                )}
                                {selectedIncidentDates.tercer && (
                                    <div className='incidencia-abierta2'>
                                    <div className='numero-incidencia'>
                                        <h3>TERCERA INCIDENCIA</h3>
                                        <p><i>Fecha:</i> {selectedIncidentDates.tercer.fecha}</p>
                                    </div>
                                    <div className='Datos-incidencia2'>
                                    <p><i>Gravedad:</i> {selectedIncidentDates.tercer.prioridad}</p>
                                        <div className='Datos-incidencia'>
                                        <p ><i>Descripción:</i> {selectedIncidentDates.tercer.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                                )}
                                   {selectedIncidentDates.cuarta &&  (
                                    <div className='incidencia-abierta2'>
                                    <div className='numero-incidencia'>
                                        <h3>CUARTA INCIDENCIA</h3>
                                        <p><i>Fecha:</i> {selectedIncidentDates.cuarta.fecha}</p>
                                    </div>
                                    <div className='Datos-incidencia2'>
                                    <p><i>Gravedad:</i> {selectedIncidentDates.cuarta.prioridad}</p>
                                        <div className='Datos-incidencia'>
                                        <p ><i>Descripción:</i> {selectedIncidentDates.cuarta.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                                )}
                                    {selectedIncidentDates.quinta &&  (
                                    <div className='incidencia-abierta2'>
                                    <div className='numero-incidencia'>
                                        <h3>QUINTA INCIDENCIA</h3>
                                        <p><i>Fecha:</i> {selectedIncidentDates.quinta.fecha}</p>
                                    </div>
                                    <div className='Datos-incidencia2'>
                                    <p><i>Gravedad:</i> {selectedIncidentDates.quinta.prioridad}</p>
                                        <div className='Datos-incidencia'>
                                        <p ><i>Descripción:</i> {selectedIncidentDates.quinta.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                                )}
                                  {selectedIncidentDates.sexta &&  (
                                    <div className='incidencia-abierta2'>
                                    <div className='numero-incidencia'>
                                        <h3>SEXTA INCIDENCIA</h3>
                                        <p><i>Fecha:</i> {selectedIncidentDates.sexta.fecha}</p>
                                    </div>
                                    <div className='Datos-incidencia2'>
                                    <p><i>Gravedad:</i> {selectedIncidentDates.sexta.prioridad}</p>
                                        <div className='Datos-incidencia'>
                                        <p ><i>Descripción:</i> {selectedIncidentDates.sexta.descripcion}</p>
                                        </div>
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
