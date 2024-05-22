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
        <div>
            <h1>Reportar Bache</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Reporte Hecho Por:</label>
                    <p>{userData.nombre} {userData.apellidoPaterno}</p>
                </div>
                <div>
                    <label htmlFor="ubicacion">Ubicación:</label>
                    <p>{selectedLocation}</p> {/* Muestra la ubicación seleccionada */}
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="archivo">Subir archivo:</label>
                    <input
                        type="file"
                        id="archivo"
                        name="archivo"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Enviar</button>
            </form>
            {/* Pasa la función setSelectedLocation al componente del mapa */}
            <div> <DynamicMap setSelectedLocation={setSelectedLocation} /></div>
        </div>
    );
}

export default ReportBachePage;