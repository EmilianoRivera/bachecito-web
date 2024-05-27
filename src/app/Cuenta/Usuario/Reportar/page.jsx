"use client";
import React, { useState, useEffect } from 'react';
import { auth } from "../../../../../firebase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from './reportes.css';

// Importa el componente del mapa de manera dinámica
const DynamicMap = dynamic(() => import("@/components/MapR"), {
    ssr: false,
});


function ReportBachePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: '',
        ubicacion: '', // Elimina esto si no quieres inicializar la ubicación en vacío
        descripcion: '',
        archivo: null,
    });

    const [userData, setUserData] = useState({});
    const [selectedLocation, setSelectedLocation] = useState(null);


    const [imagenFondo, setImagenFondo] = useState('');

    const handleChange2 = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagenFondo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    const uid = user.uid;
                    fetchData(uid);
                } else {
                    router.push("/login");
                }
            });
            return () => unsubscribe();
        }

        async function fetchData(uid) {
            try {
                const userResponse = await fetch(`/api/Usuario/${uid}`);
                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await userResponse.json();

                setUserData(userData);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    nombre: userData.nombre,
                    ubicacion: userData.ubicacion,
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('ubicacion', selectedLocation); // Usa la ubicación seleccionada del mapa
        data.append('descripcion', formData.descripcion);
        if (formData.archivo) {
            data.append('archivo', formData.archivo);
        }

        fetch('/api/report-bache', {
            method: 'POST',
            body: data,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="container-reportar">
            <div className='izquierda-reportar'>

                <form onSubmit={handleSubmit}>
                    <div className='nombress'>
                        <label htmlFor="nombre">REPORTE HECHO POR</label>
                        <p className='nombres-blanco'>{userData.nombre} {userData.apellidoPaterno} {userData.apellidoMaterno}</p>
                    </div>
                    <div className='ubicacionn'>
                        <label htmlFor="ubicacion">UBICACIÓN</label>
                        <p className='ubicacion-blanco'>{selectedLocation}</p> {/* Muestra la ubicación seleccionada */}
                    </div>

                    <div className='flexForm'>
                        <div className='descripcionnn'>
                            <label htmlFor="descripcion">DESCRIPCIÓN</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='fotografiaaa'>
                            <label htmlFor="archivo">FOTOGRAFÍA</label>
                            <input  style={{ backgroundImage: `url(${imagenFondo})` }}
                                type="file"
                                id="archivo"
                                name="archivo"
                                onChange={handleChange2}
                            />
                        </div>
                        <button className='submiiit' type="submit">¡REPORTAR!</button>
                    </div>
                </form>
            </div>

            <div className='derecha-reportar'>
                <div className='intro-reportar'>
                    <p>
                        ¡Mueve el marcador para obtener automáticamente la ubicación del bachecito a reportar!
                    </p>
                </div>
                {/* Pasa la función setSelectedLocation al componente del mapa */}
                <div> <DynamicMap/></div>
            </div>
        </div>
    );
}

export default ReportBachePage;