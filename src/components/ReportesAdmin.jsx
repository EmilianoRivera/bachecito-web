"use client";
import { useEffect, useState } from "react";
import { db, collection, getDocs, updateDoc, writeBatch, query, where} from "../../firebase";
import '../app/Cuenta/Administrador/Reportes/Reportes.css';
import Link from 'next/link';
import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enc, desc } from "@/scripts/Cifrado/Cifrar";
import {
    isToday,
    isThisWeek,
    isThisMonth,
    isThisYear,
    isWithinInterval,
    subMonths,
    parse,
    format
  } from "date-fns";

export default function ReportesAdmin() {
    const [rep, setRep] = useState([]);
    const [isEstadoAlertVisible, setIsEstadoAlertVisible] = useState(false);
    const [alertaEstadoData, setAlertaEstadoData] = useState({ folio: null, estadoActual: null });
    const [searchLocation, setSearchLocation] = useState("");
    const [estadoOriginal, setEstadoOriginal] = useState(null);
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
    const [deleteAlertData, setDeleteAlertData] = useState({ folio: null });

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filtroFecha, setFiltroFecha] = useState("Todos los tiempos");
    const [estado, setEstado] = useState("Todos");
    const [alcaldiaSeleccionada, setAlcaldiaSeleccionada] = useState("Todas");

    const [isFechaSelectVisible, setIsFechaSelectVisible] = useState(false);
    const [isAlcaldiaSelectVisible, setIsAlcaldiaSelectVisible] = useState(false);
    const [isEstadoSelectVisible, setIsEstadoSelectVisible] = useState(false);

    const [reportesFiltrados, setReportesFiltrados] = useState([]);

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

    useEffect(() => {
        async function fetchData() {
            try {
                const baseURL = process.env.NEXT_PUBLIC_RUTA_R
                const response = await fetch(`${baseURL}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const dataEnc = await response.json();
                const data = dataEnc.map(rep => desc(rep));
                setRep(data);
                setReportesFiltrados(data);
            } catch (error) {
                console.log("Error fetching data: ", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const filtrarReportes = () => {
            let filtrados = rep;

            // Filtrar por estado
            if (estado !== "Todos") {
                filtrados = filtrados.filter(reporte => reporte.estado === estado);
            }

            // Filtrar por alcaldía
            if (alcaldiaSeleccionada !== "Todas") {
                filtrados = filtrados.filter(reporte => obtenerAlcaldiaPorFolio(reporte.folio) === alcaldiaSeleccionada);
            }

            // Filtrar por ubicación
            if (searchLocation) {
                const ubicacionLowerCase = searchLocation.toLowerCase();
                const folioLowerCase = searchLocation.toLowerCase();
                filtrados = filtrados.filter(reporte => reporte.ubicacion.toLowerCase().includes(ubicacionLowerCase)
            || reporte.folio.toLowerCase().includes(folioLowerCase));
            }

            // Filtrar por fechas
            filtrados = filtrados.filter(reporte => checkFechaMatch(reporte.fechaReporte));

            setReportesFiltrados(filtrados);
        };

        filtrarReportes();
    }, [estado, alcaldiaSeleccionada, searchLocation, filtroFecha, startDate, endDate, rep]);

    const handleAlcaldiaChange = (e) => {
        setAlcaldiaSeleccionada(e.target.value);
    };

    const handleFechaChange = (e) => {
        setFiltroFecha(e.target.value);
    };

    const handleEstadoChange = (e) => {
        setEstado(e.target.value);
    };

    const checkFechaMatch = (fecha) => {
        const parsedFecha = parse(fecha, 'd/M/yyyy', new Date());

        switch (filtroFecha) {
          case "Todos los tiempos":
            return true;
          case "Hoy":
            return isToday(parsedFecha);
          case "Esta semana":
            return isThisWeek(parsedFecha);
          case "Último mes":
            const lastMonth = subMonths(new Date(), 1);
            return (
              parsedFecha.getMonth() === lastMonth.getMonth() &&
              parsedFecha.getFullYear() === lastMonth.getFullYear()
            );
          case "Últimos 6 meses":
            return isWithinInterval(parsedFecha, {
              start: subMonths(new Date(), 6),
              end: new Date(),
            });
          case "Este año":
            return isThisYear(parsedFecha);
          case "Rango personalizado":
            return isWithinInterval(parsedFecha, {
              start: startDate,
              end: endDate,
            });
          default:
            return false;
        }
      };

      const obtenerAlcaldiaPorFolio = (folio) => {
        if (!folio) {
            return 'No se encontró la alcaldía';
        }
    
        const primerosTresDigitos = folio.substring(0, 3);
    
        switch (primerosTresDigitos) {
            case '001': return '🐴 Álvaro Obregón';
            case '002': return '🐜 Azcapotzalco ';
            case '003': return '🐷 Benito Juárez';
            case '004': return '🐺 Coyoacán';
            case '005': return '🌳 Cuajimalpa de Morelos';
            case '006': return '🦅 Cuauhtémoc';
            case '007': return '🌿 Gustavo A. Madero ';
            case '008': return '🏠 Iztacalco';
            case '009': return '🐭 Iztapalapa';
            case '010': return '🏔 La Magdalena Contreras';
            case '011': return '🦗 Miguel Hidalgo';
            case '012': return '🌾 Milpa Alta';
            case '013': return '🌋 Tláhuac';
            case '014': return '🦶 Tlalpan';
            case '015': return '🌻 Venustiano Carranza';
            case '016': return '🐠 Xochimilco';
            default: return 'No se encontró la alcaldía';
        }
    };
    
    const showDeleteHeader = () => {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.add('show-header');
    };

    const hideDeleteHeader = () => {
        const table = document.querySelector('.containerReportesAdmin table');
        table.classList.remove('show-header');
    };

    const showEstadoAlert = (folio, estado) => {
        setAlertaEstadoData({ folio: folio, estadoActual: estado });
        setIsEstadoAlertVisible(true);
        const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
        const reporteOriginal = [...rows].find(row => row.querySelector('.folio').textContent === folio);
        if (reporteOriginal) {
            const estadoOriginal = reporteOriginal.querySelector('.estado').textContent;
            setEstadoOriginal(estadoOriginal);
        }
    };
    const showDeleteAlert = (folio) => {
        setDeleteAlertData({ folio: folio });
        setIsDeleteAlertVisible(true);
    };
    const closeEstadoAlert = () => {
        setIsEstadoAlertVisible(false);
        window.location.reload();
    };
    const closeDeleteAlert = () => {
        setIsDeleteAlertVisible(false);
    };

    const cancelEstadoAlert = () => {
        setIsEstadoAlertVisible(false);
        const { folio } = alertaEstadoData;
        const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
        rows.forEach((row) => {
            if (row.querySelector('.folio').textContent === folio) {
                if (row.querySelector('.estado').textContent !== estadoOriginal) {
                    row.querySelector('.estado').textContent = estadoOriginal;
                }
            }
        });
    };
    const contadorFunc = async (direccion) => {
        try {
          const reportesQuery = query(collection(db, 'reportes'), where("ubicacion", "==", direccion));
          const reportesSnap = await getDocs(reportesQuery);
      
          const batch = writeBatch(db);
          reportesSnap.forEach((doc) => {
            const reporte = doc.data();
            const nuevoContador = reporte.contador - 1;
            batch.update(doc.ref, { contador: nuevoContador });
          });
          await batch.commit();
          return reportesSnap.docs.length;
        } catch (error) {
          console.error('Error al actualizar contador', error);
        }
      };
      
    const handleClick = async (folio) => {
        try {
            const refCollection = collection(db, 'reportes');
            const querySnapshot = await getDocs(refCollection);

            querySnapshot.forEach(async (doc) => {
                const reporte = doc.data();
                if (reporte.folio === folio) {
                    // Actualizar el documento para establecer eliminado: true
                    await updateDoc(doc.ref, { eliminado: true });
                    const ubicacion = reporte.ubicacion;
                    await contadorFunc(ubicacion);
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

    const updateEstado = async (folio, nuevoEstado) => {
        try {
            const refCollection = collection(db, 'reportes');
            const querySnapshot = await getDocs(refCollection);

            querySnapshot.forEach(async (doc) => {
                const reporte = doc.data();
                if (reporte.folio === folio) {
                    await updateDoc(doc.ref, { estado: nuevoEstado });
                 //   await fetchFiltroEstado();
                    console.log(`Se actualizo el reporte con folio: ${folio}`);
                }
            })
            const rows = document.querySelectorAll('.containerReportesAdmin .Reportes');
            rows.forEach((row) => {
                if (row.querySelector('.folio').textContent === folio) {
                    row.querySelector('.estado').textContent = nuevoEstado;
                }
            });
        } catch (error) {
            console.error('Error al actualizar el estado del reporte:', error);
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
                    placeholder="Buscar por ubicación o folio..."
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