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
            const baseURL = process.env.NEXT_PUBLIC_RUTA_SE
            const response = await fetch(`${baseURL}/${email}/${subject}/${text}/${incidenciaNum}/${nombreUsuario}`, {
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
                    updates.prioridadPrimerI = prioridad;
                } else if (newIncidenciasCount === 2) {
                    updates.SegundaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionSegundaIncidencia = descripcion;
                    updates.prioridadSegundaI = prioridad;
                } else if (newIncidenciasCount === 3) {
                    updates.TercerIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionTercerIncidencia = descripcion;
                    updates.prioridadTercerI = prioridad;
                    updates.inhabilitada = true;
                } else if (newIncidenciasCount === 4) {
                    updates.CuartaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionCuartaIncidencia = descripcion;
                    updates.prioridadCuartaI = prioridad;
                } else if (newIncidenciasCount === 5) {
                    updates.QuintaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionQuintaIncidencia = descripcion;
                    updates.prioridadQuintaI = prioridad;
                } else if (newIncidenciasCount === 6) {
                    updates.SextaIncidencia = Timestamp.fromDate(new Date());
                    updates.descripcionSextaIncidencia = descripcion;
                    updates.prioridadSextaI = prioridad;
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
                window.location.reload()
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
                await updateDoc(userRef, { inhabilitada: false });
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
                await updateDoc(userRef, { inhabilitada: true });
            });

            // Fetch users again to refresh the data
            fetchFilteredUsers();
        } catch (error) {
            console.error('Error disabling account: ', error);
        }
    };

    const renderIncidencias = (incidencias) => {
        const incidenciasArray = [];
        for (let i = 1; i <= incidencias; i++) {
            const incidenciaKey = `incidencia${i}`;
            const fechaKey = `fechaIncidencia${i}`;
            const descripcionKey = `descripcionIncidencia${i}`;
            const prioridadKey = `prioridadIncidencia${i}`;
            
            incidenciasArray.push(
                <div className='incidencia-abierta2' key={i}>
                    <div className='numero-incidencia'>
                        <h3>{`${i}ª INCIDENCIA`}</h3>
                        <p><i>Fecha:</i> {selectedIncidentDates[fechaKey]}</p>
                    </div>
                    <div className='Datos-incidencia2'>
                        <p><i>Gravedad:</i> {selectedIncidentDates[prioridadKey]}</p>
                        <div className='Datos-incidencia'>
                            <p ><i>Descripción:</i> {selectedIncidentDates[descripcionKey]}</p>
                        </div>
                    </div>
                </div>
            );
        }
        return incidenciasArray;
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
                let selectedIncidents = [];
    
                if (userData.Primerincidencia) {
                    selectedIncidents.push({
                        numero: "Primera Incidencia",
                        fecha: new Date(userData.Primerincidencia.seconds * 1000).toLocaleString(),
                        descripcion: userData.descripcionPrimerIncidencia || 'No hay descripción',
                        prioridad: userData.prioridadPrimerI || 'No se asignó nivel de gravedad'
                    });
                }
    
                if (userData.SegundaIncidencia) {
                    selectedIncidents.push({
                        numero: "Segunda Incidencia",
                        fecha: new Date(userData.SegundaIncidencia.seconds * 1000).toLocaleString(),
                        descripcion: userData.descripcionSegundaIncidencia || 'No hay descripción',
                        prioridad: userData.prioridadSegundaI || 'No se asignó nivel de gravedad'
                    });
                }
    
                if (userData.TercerIncidencia) {
                    selectedIncidents.push({
                        numero: "Tercera Incidencia",
                        fecha: new Date(userData.TercerIncidencia.seconds * 1000).toLocaleString(),
                        descripcion: userData.descripcionTercerIncidencia || 'No hay descripción',
                        prioridad: userData.prioridadTercerI || 'No se asignó nivel de gravedad'
                    });
                }
    
                if (userData.CuartaIncidencia) {
                    selectedIncidents.push({
                        numero: "Cuarta Incidencia",
                        fecha: new Date(userData.CuartaIncidencia.seconds * 1000).toLocaleString(),
                        descripcion: userData.descripcionCuartaIncidencia || 'No hay descripción',
                        prioridad: userData.prioridadCuartaI || 'No se asignó nivel de gravedad'
                    });
                }
    
                if (userData.QuintaIncidencia) {
                    selectedIncidents.push({
                        numero: "Quinta Incidencia",
                        fecha: new Date(userData.QuintaIncidencia.seconds * 1000).toLocaleString(),
                        descripcion: userData.descripcionQuintaIncidencia || 'No hay descripción',
                        prioridad: userData.prioridadQuintaI || 'No se asignó nivel de gravedad'
                    });
                }
    
                if (userData.SextaIncidencia) {
                    selectedIncidents.push({
                        numero: "Sexta Incidencia",
                        fecha: new Date(userData.SextaIncidencia.seconds * 1000).toLocaleString(),
                        descripcion: userData.descripcionSextaIncidencia || 'No hay descripción',
                        prioridad: userData.prioridadSextaI || 'No se asignó nivel de gravedad'
                    });
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

    const [isAccesoSelectVisible, setIsAccesoSelectVisible] = useState(false);
    const [isStateSelectVisible, setIsStateSelectVisible] = useState(false);
    const [isVerificacionSelectVisible, setIsVerificacionSelectVisible] = useState(false);
    const [isIncidenciasSelectVisible, setIsIncidenciasSelectVisible] = useState(false);

    return (
        <div className='main-container-users'>
            <div className="flex-bar">
                <div className='FilUsuariosAdmin'>
                    <div className="filtro-users">
                        <label onClick={() => setIsAccesoSelectVisible(!isAccesoSelectVisible)}>
                            <img src="https://i.postimg.cc/8CCD94QN/clave-de-usuario.png" alt={``} />
                            Accesos
                        </label>
                        {isAccesoSelectVisible && (
                            <select onChange={handleEstadoCuentaFilterChange}>
                                <option value="Todos">Todos</option>
                                <option value="false">Habilitado</option>
                                <option value="true">Inhabilitado</option>
                            </select>
                        )}
                    </div>

                    <div className="filtro-users">
                    <label onClick={() => setIsStateSelectVisible(!isStateSelectVisible)}>
                            <img src="https://i.postimg.cc/1zYPQFs6/luz-emergencia-encendida.png" alt={``} />
                            Estado de la cuenta
                        </label>
                        {isStateSelectVisible && (
                            <select onChange={handleInhabilitadaFilterChange}>
                            <option value="Todos">Todos</option>
                            <option value="true">Activa</option>
                            <option value="false">Desactivada</option>
                        </select>
                        )}
                    </div>

                    <div className="filtro-users">
                    <label onClick={() => setIsVerificacionSelectVisible(!isVerificacionSelectVisible)}>
                            <img src="https://i.postimg.cc/gJBCCbyK/comprobacion-de-usuario.png" alt={``} />
                            Estado de Verificación
                        </label>
                        {isVerificacionSelectVisible && (
                            <select onChange={handleVerificadoFilterChange}>
                            <option value="Todos">Todos</option>
                            <option value="true">Verificado</option>
                            <option value="false">No verificado</option>
                        </select>
                        )}
                    </div>

                    <div className="filtro-users">
                    <label onClick={() => setIsIncidenciasSelectVisible(!isIncidenciasSelectVisible)}>
                            <img src="https://i.postimg.cc/59R2s3rn/agregar-documento.png" alt={``} />
                            # Incidencias
                        </label>
                        {isIncidenciasSelectVisible && (
                            <select onChange={handleNumIncidenciasFilterChange}>
                            <option value="Todos">Todas</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        )}
                    </div>
                    

                </div>
                <input
                    className="Buscador-usadmin"
                    type="text"
                    placeholder="Buscar Email o nombre..."
                    value={searchQuery}
                    onChange={handleSearchQueryChange}></input>
                <img className="Buscador-img-ad2" src="https://i.postimg.cc/k5QNBFHC/busqueda-1.png" alt="" />

            </div>

            <div className='table-cont'>
            <table className='users'>
                <thead>
                    <tr className='sticky-top'>
                        <th>Fecha Creación</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado de Verificación</th>
                        <th>Estado de la cuenta</th>
                        <th>Acceso al sistema</th>
                        <th>#Reportes</th>
                        <th>#Incidencias</th>
                        <th>Acciones</th>
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
                            <td id="incidenciass">{user.incidencias}
                            { user.incidencias > 0 && (
                                <button className="Detalles" onClick={() => handleDetailsClick(user.uid, user.incidencias <= 3 ? 1 : 2)}>
                                    <span>{user.incidencias === 0 ? 'Detalles de incidencia' : 'Detalles de incidencias'}</span>
                                </button>
                            )
                            }
                            </td>
                            {user.incidencias < 6 && user.inhabilitada === false && (
                                <td className='agregar-incidencia' onClick={() => openModal(user)}>
                                    <img src="https://i.postimg.cc/59R2s3rn/agregar-documento.png" alt="Agregar documento" />
                                    <span>Agregar incidencia</span>
                                </td>
                            )}
                            {user.incidencias === 6 && (
                                <td id="full">No se pueden agregar más incidencias</td>
                            )}

                            {user.incidencias >= 3 && user.inhabilitada === false && (
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
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            {isModalOpen && (
                <div className="modal-inc">
                    <div className="modal-inc-content">
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
                            selectedIncidentDates.map((incidencia, index) => (
                                <div className='incidencia-abierta2' key={index}>
                                    <div className='numero-incidencia'>
                                        <h3>{incidencia.numero}</h3>
                                        <p><i>Fecha:</i> {incidencia.fecha}</p>
                                    </div>
                                    <div className='Datos-incidencia2'>
                                        <p><i>Gravedad:</i> {incidencia.prioridad}</p>
                                        <div className='Datos-incidencia'>
                                            <p><i>Descripción:</i> {incidencia.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
