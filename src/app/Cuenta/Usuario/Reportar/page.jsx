"use client";
import React, { useState, useEffect } from "react";
import { auth, app } from "../../../../../firebase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./reportes.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Importa el componente del mapa de manera dinámica
const DynamicMap = dynamic(() => import("@/components/MapR"), {
  ssr: false,
});

function Reportar() {
  const router = useRouter();

  const [userData, setUserData] = useState({});
  const [desc, setDesc] = useState("Sin descripción");
  const [ubicacion, setUbicacion] = useState("Sin ubicación");

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [router]);

  const handleDescripcion = (e) => {
    const descs = e.target.value;
    setDesc(descs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = userData.uid;
    const nombre = userData.nombre;
    const apellidoPaterno = userData.apellidoPaterno;
    const imagenURL = await handleFileUpload(uid);
    const descripcion = desc;
    const ubi = ubicacion;

    const res = await fetch(
      `/api/MandarR/${uid}/${nombre}/${apellidoPaterno}/${encodeURIComponent(
        imagenURL
      )}/${descripcion}/${ubi}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          nombre,
          apellidoPaterno,
          imagenURL: encodeURIComponent(imagenURL),
          descripcion,
          ubi,
        }),
      }
    );

    if (!res.ok) {
      console.error(
        "Hubo un error en la petición:",
        res.status,
        res.statusText
      );
      return;
    }

    try {
      const data = await res.json();
      console.log("Respuesta de la API:", data);
    } catch (error) {
      console.error("Error al analizar la respuesta JSON:", error);
    }
    // Aquí puedes agregar la lógica para enviar los datos al servidor
  };

  const handleFileUpload = async (uid) => {
    const archivo = document.querySelector('input[type="file"]');
    const archivito = archivo.files[0];

    if (!archivito) {
      console.error("No se ha seleccionado ningún archivo");
      return;
    }

    const storage = getStorage(app);
    const randomId = Math.random().toString(36).substring(7);
    const imageName = `Ticket_${randomId}`;
    const storageRef = ref(storage, `ImagenesBaches/${uid}/${imageName}`);
    await uploadBytes(storageRef, archivito);
    return getDownloadURL(storageRef);
  };

  return (
    <div>
      <h1>Reportar Bache</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Reporte Hecho Por:</label>
          <p>
            {userData.nombre} {userData.apellidoPaterno}
          </p>
        </div>
        <div>
          <label htmlFor="ubicacion">Ubicación:</label>
          <p>{ubicacion}</p> {/* Muestra la ubicación seleccionada */}
        </div>
        <div>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder={desc}
            onChange={handleDescripcion}
            required
          />
        </div>
        <div>
          <label htmlFor="archivo">Subir archivo:</label>
          <input type="file" id="archivo" name="archivo" />
        </div>
        <button type="submit">Enviar</button>
      </form>
      <div>
        <DynamicMap setSelectedLocation={setUbicacion} />
      </div>
    </div>
  );
}

export default Reportar;
