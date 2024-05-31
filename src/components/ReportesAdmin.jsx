"use client";
import { useEffect, useState } from "react";
import { db, collection, getDocs, updateDoc, doc, query, where } from "../../firebase";
import '../app/Cuenta/Administrador/Reportes/Reportes.css';
import Link from 'next/link';
import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReportesAdmin() {
    const [rep, setRep] = useState([]);
    const [isEstadoAlertVisible, setIsEstadoAlertVisible] = useState(false);
    const [alertaEstadoData, setAlertaEstadoData] = useState({ folio: null, estadoActual: null });
    const [alcaldiaSeleccionada, setAlcaldiaSeleccionada] = useState("Todas");
    const [searchLocation, setSearchLocation] = useState("");
    function showDeleteHeader() {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.add('show-header');
    }

    function hideDeleteHeader() {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.remove('show-header');
    }

    const [estadoOriginal, setEstadoOriginal] = useState(null);
    const showEstadoAlert = (folio, estado) => {
        // Configura los datos de la alerta de cambio de estado
        setAlertaEstadoData({ folio: folio, estadoActual: estado });
        setIsEstadoAlertVisible(true);

        // Guarda el estado original del reporte antes de abrir la alerta
        const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
        const reporteOriginal = [...rows].find(row => row.querySelector('.folio').textContent === folio);
        if (reporteOriginal) {
            const estadoOriginal = reporteOriginal.querySelector('.estado').textContent;
            setEstadoOriginal(estadoOriginal);
        }
    };

    const closeEstadoAlert = () => {
        // Oculta la alerta de cambio de estado
        setIsEstadoAlertVisible(false);
        window.location.reload();
    };

    const cancelEstadoAlert = () => {
        // Oculta la alerta de cambio de estado
        setIsEstadoAlertVisible(false);

        // Revertir los cambios realizados desde que se abrió la alerta
        const { folio, estadoActual } = alertaEstadoData;
        const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
        rows.forEach((row) => {
            if (row.querySelector('.folio').textContent === folio) {
                // Revertir solo si el estado actual es diferente al estado original
                if (row.querySelector('.estado').textContent !== estadoOriginal) {
                    row.querySelector('.estado').textContent = estadoOriginal;
                }
            }
        });
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
                    // Después de actualizar el estado, llamar a fetchFiltroEstado para obtener datos actualizados
                    await fetchFiltroEstado();

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

                 //   console.log(`Se marcó como eliminado el reporte con folio ${folio}`);

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

    const alcaldiasCDMX = [
        "Todas",
        "🐴 Álvaro Obregón ",
        "🐜 Azcapotzalco ",
        "🐷 Benito Juárez",
        "🐺 Coyoacán",
        "🌳 Cuajimalpa de Morelos",
        "🦅 Cuauhtémoc",
        "🌿 Gustavo A. Madero ",
        "🏠 Iztacalco",
        "🐭 Iztapalapa",
        "🏔 La Magdalena Contreras",
        "🦗 Miguel Hidalgo",
        "🌾 Milpa Alta",
        "🌋 Tláhuac",
        "🦶 Tlalpan",
        "🌻 Venustiano Carranza",
        "🐠 Xochimilco",
    ];
    const [reportes, setReportes] = useState([]);
    const obtenerAlcaldiaCDMX = (ubicacion) => {
        // Lista de nombres de alcaldías de la CDMX
        const alcaldiasCDMX = ["Azcapotzalco", "Coyoacán", "Cuajimalpa", "Gustavo A. Madero", "Iztacalco", "Iztapalapa", "Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta", "Tláhuac", "Tlalpan", "Venustiano Carranza", "Xochimilco"];

        const ubicacionLowercase = ubicacion.toLowerCase();

        const alcaldiaEncontrada = alcaldiasCDMX.find(alcaldia => ubicacionLowercase.includes(alcaldia.toLowerCase()));
        return alcaldiaEncontrada ? alcaldiaEncontrada : "No disponible";
    };
    useEffect(() => {
        async function fetchData() {
            const baseURL = process.env.NEXT_PUBLIC_RUTA_R
            const res = await fetch(`${baseURL}`);
            const data = await res.json(); // Espera a que se resuelva la promesa
            setReportes(data);
        }

        fetchData();
    }, []);

    /*ESTO ES DEL RANGO PERSONALIZADO */
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    /*ESTO ES DEL FILTRO DE FECHA EN GENERAL */

    const [filtroFecha, setFiltroFecha] = useState("Todos los tiempos");


    const [estado, setEstado] = useState("Todos");
    const [alcaldias, setAlcaldia] = useState("Todas");

    // Estados para manejar la visibilidad de los select
    const [isFechaSelectVisible, setIsFechaSelectVisible] = useState(false);
    const [isAlcaldiaSelectVisible, setIsAlcaldiaSelectVisible] = useState(false);
    const [isEstadoSelectVisible, setIsEstadoSelectVisible] = useState(false);

    const handleAlcaldiaChange = (e) => {
        const alcaldiaSeleccionada = e.target.value;
        setAlcaldiaSeleccionada(alcaldiaSeleccionada);
    };


    const handleFechaChange = (e) => {
        const selectedValue = e.target.value;
        console.log("Fecha seleccionada:", selectedValue);
        setFiltroFecha(selectedValue);
        console.log("Fecha")
    };

    const nombreAlcaldia = alcaldias.replace(/^[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+|[\s🐴🐜🐷🐺🌳🦅🌿🏠🐭🏔🦗🌾🌋🦶🌻🐠]+$/g, "");
    async function fetchFiltroEstado() {
        try {
            const parametros = {
                estado: estado,
                alcaldia: alcaldias,
                filtroFecha: filtroFecha,
                startDate: startDate,
                endDate: endDate
            };

            // Realizar la solicitud POST con el objeto de parámetros en el cuerpo
            const baseURL= process.env.NEXT_PUBLIC_RUTA_RF
            const datosNuevos = await fetch(`${baseURL}/${estado}/${nombreAlcaldia}/${filtroFecha}/${startDate}/${endDate}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indicar que el cuerpo es JSON
                },
                body: JSON.stringify(parametros) // Convertir el objeto a JSON
            });
            if (!datosNuevos.ok) {
                throw new Error("Fallo a la petición de /api/filtros/estado/${estado}");
            }
            const estadosReportes = await datosNuevos.json();
          //  console.log(estadosReportes);

        } catch (error) {
            console.error("Error a la hora de hacer la petición: ", error);
        }
    }

    fetchFiltroEstado();

    /*FILTRO PARA EL ESTADOOOOOO */
    const [reportesFiltrados, setReportesFiltrados] = useState(rep);
    useEffect(() => {
        if (estado === "Todos") {
            setReportesFiltrados(rep);
        } else {
            filtrarReportesPorEstado(estado);
        }
    }, [estado, rep]); // Agregamos 'estado' como una dependencia para que se ejecute cuando cambie

    const filtrarReportesPorEstado = (estadoSeleccionado) => {
        const reportesFiltrados = rep.filter(reporte => reporte.estado === estadoSeleccionado);
        setReportesFiltrados(reportesFiltrados);
    };

    const handleEstadoChange = (e) => {
        const estadoSeleccionado = e.target.value;
        setEstado(estadoSeleccionado)
    };


    const filtrarReportesPorUbi = (ubi) => {
        const ubicacionLowerCase = ubi.toLowerCase();
        const reportesFiltrados = rep.filter(reporte => reporte.ubicacion.toLowerCase().includes(ubicacionLowerCase));
        setReportesFiltrados(reportesFiltrados);
    };
    useEffect(() => {
        filtrarReportesPorUbi(searchLocation);
    }, [searchLocation, rep]);
    /**setEstado(e.target.value);
        console.log("Estado") */

    const obtenerAlcaldiaPorFolio = (folio) => {
        // Obtener los primeros tres dígitos del folio
        const primerosTresDigitos = folio.substring(0, 3);

        // Mapear los primeros tres dígitos a la alcaldía correspondiente
        switch (primerosTresDigitos) {
            case '001':
                return '🐴 Álvaro Obregón';
            case '002':
                return '🐜 Azcapotzalco ';
            case '003':
                return '🐷 Benito Juárez';
            case '004':
                return '🐺 Coyoacán';
            case '005':
                return '🌳 Cuajimalpa de Morelos';
            case '006':
                return '🦅 Cuauhtémoc';
            case '007':
                return '🌿 Gustavo A. Madero ';
            case '008':
                return '🏠 Iztacalco';
            case '009':
                return '🐭 Iztapalapa';
            case '010':
                return '🏔 La Magdalena Contreras';
            case '011':
                return '🦗 Miguel Hidalgo';
            case '012':
                return '🌾 Milpa Alta';
            case '013':
                return '🌋 Tláhuac';
            case '014':
                return '🦶 Tlalpan';
            case '015':
                return '🌻 Venustiano Carranza';
            case '016':
                return '🐠 Xochimilco';
            default:
                return 'No se encontró la alcaldía';

        }

    };

    useEffect(() => {
        filtrarReportesPorAlcaldia(alcaldiaSeleccionada);
    }, [alcaldiaSeleccionada, rep]);

    const filtrarReportesPorAlcaldia = (alcaldiaSeleccionada) => {
        if (alcaldiaSeleccionada === "Todas") {
            setReportesFiltrados(rep);
        } else {
            const reportesFiltrados = rep.filter(reporte => obtenerAlcaldiaPorFolio(reporte.folio) === alcaldiaSeleccionada);
            setReportesFiltrados(reportesFiltrados);
        }
    };


    return (
        <div className="containerReportesAdmin">
            <div className="flex-papelera">
                <div className="filtros-dashboard">
                    <div className="filtro-dashboard" id="fechas">
                        <label onClick={() => setIsFechaSelectVisible(!isFechaSelectVisible)}>
                            <img src="https://i.postimg.cc/hPbM6PxS/calendario-reloj.png" alt={``} />

                            Rango Fechas
                        </label>
                        {isFechaSelectVisible && (
                            <select onChange={handleFechaChange}>
                                <option value="Todos los tiempos">Todos los tiempos</option>
                                <option value="Hoy">Hoy</option>
                                <option value="Esta semana">Esta semana</option>
                                <option value="Último mes">Último mes</option>
                                <option value="Últimos 6 meses">Últimos 6 meses</option>
                                <option value="Este año">Este año</option>
                                <option value="Rango personalizado">Rango personalizado</option>
                            </select>
                        )}

                        {filtroFecha === "Rango personalizado" && (
                            <div className="custom-date">
                                <DatePicker
                                    className="datepicker"
                                    selected={startDate}
                                    onChange={setStartDate}
                                />
                                <DatePicker
                                    className="datepicker"
                                    selected={endDate}
                                    onChange={setEndDate}
                                />
                            </div>
                        )}
                    </div>
                    <div className="filtro-dashboard" id="alcaldia">
                        <label
                            onClick={() => setIsAlcaldiaSelectVisible(!isAlcaldiaSelectVisible)}
                        >
                            <img src="https://i.postimg.cc/wjw2xf0Z/marcador_(1).png" alt={``} />
                            Alcaldía
                        </label>
                        {isAlcaldiaSelectVisible && (
                            <select onChange={handleAlcaldiaChange}>
                                {alcaldiasCDMX.map((alcaldia, index) => (
                                    <option key={index} value={alcaldia}>
                                        {alcaldia}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="filtro-dashboard" id="estado">
                        <label
                            onClick={() => setIsEstadoSelectVisible(!isEstadoSelectVisible)}
                        >
                            <img src="https://i.postimg.cc/bwyLhcH1/bandera-alt.png" alt={``} />

                            Estado
                        </label>
                        {isEstadoSelectVisible && (
                            <select onChange={handleEstadoChange}>
                                <option value="Todos">Todos</option>
                                <option value="Sin atender">Sin atender</option>
                                <option value="En atención">En atención</option>
                                <option value="Atendido">Atendido</option>
                            </select>
                        )}
                    </div>
                    <div>


                    </div>
                </div>

                <input
                    className="Buscador"
                    type="text"
                    placeholder="Buscar ubicación..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                />
                <img className="Buscador-img" src="https://i.postimg.cc/k5QNBFHC/busqueda-1.png" alt="" />


                <div className="papelera">
                    <Link href="/Cuenta/Administrador/Papelera" className="papelera-option"><img src="https://i.postimg.cc/02gZVXL3/basura.png" alt="soporte" />PAPELERA</Link>
                </div>
            </div>
            
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
                    {reportesFiltrados.map((report, index) => (
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
                        <button className="boton-cerrar" onClick={cancelEstadoAlert}><img src="https://i.postimg.cc/C5pcdxv9/cancelar.png" /></button>
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
                            <button className="boton-eliminar" onClick={() => { handleClick(deleteAlertData.folio); closeDeleteAlert(); }}>Eliminar</button>
                            <button className="boton-cancelar" onClick={closeDeleteAlert}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}


