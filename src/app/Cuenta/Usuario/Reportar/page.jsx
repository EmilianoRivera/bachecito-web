"use client";
import React, { useState, useEffect } from "react";
import { auth, app } from "../../../../../firebase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./reportes.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Preloader from "@/components/preloader2";
import Router from "next/router";
import { prodErrorMap } from "firebase/auth";

// Importa el componente del mapa de manera dinámica
const DynamicMap = dynamic(() => import("@/components/MapR"), {
  ssr: false,
});

function Reportar() {
  const router = useRouter();

  const [userData, setUserData] = useState({});
  const [desc, setDesc] = useState("Sin descripción");
  const [ubicacion, setUbicacion] = useState("Sin ubicación");

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeComplete);

    // Limpieza de los eventos al desmontar el componente
    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, []);
 
  const [imagenFondo, setImagenFondo] = useState("");

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
        const baseURL = process.env.NEXT_PUBLIC_RUTA_U
        const userResponse = await fetch(`${baseURL}/${uid}`);
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
   // console.log(uid, " ", nombre, " ", apellidoPaterno, " " , " ", descripcion, " ", ubi)
   const baseURL= process.env.NEXT_PUBLIC_RUTA_MR
    const res = await fetch(
      `${baseURL}/${uid}/${nombre}/${apellidoPaterno}/${encodeURIComponent(
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
      alert("Se ha enviado su reporte con exito")
      router.push("/Cuenta/Usuario/Perfil")
      //console.log("Respuesta de la API:", data);
    } catch (error) {
      console.error("Error al analizar la respuesta:", error);
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
    const storageRef = ref(storage, `ImagenesBaches/${imageName}`);
    await uploadBytes(storageRef, archivito);
    return getDownloadURL(storageRef);
  };

  return (
    <>
      {loading && <Preloader />}
      <div className="container-reportar">
        <div className="izquierda-reportar">
          <form onSubmit={handleSubmit}>
            <div className="nombress">
              <label htmlFor="nombre">REPORTE HECHO POR</label>
              <p className="nombres-blanco">
                {userData.nombre} {userData.apellidoPaterno}{" "}
                {userData.apellidoMaterno}
              </p>
            </div>
            <div className="ubicacionn">
              <label htmlFor="ubicacion">UBICACIÓN</label>
              <p className="ubicacion-blanco">{ubicacion}</p>
            </div>

            <div className="flexForm">
              <div className="descripcionnn">
                <label htmlFor="descripcion">DESCRIPCIÓN</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder={desc}
                  onChange={handleDescripcion}
                  required
                />
              </div>
              <div className="fotografiaaa">
                <label htmlFor="archivo">FOTOGRAFÍA</label>
                <input
                  style={{ backgroundImage: `url(${imagenFondo})` }}
                  type="file"
                  id="archivo"
                  name="archivo"
                  onChange={handleChange2}
                />
              </div>
              <button className="submiiit" type="submit">
                ¡REPORTAR!
              </button>
            </div>
          </form>
        </div>

        <div className="derecha-reportar">
          <div className="intro-reportar">
            <p>
              ¡Mueve el marcador para obtener automáticamente la ubicación del
              bachecito a reportar!
            </p>
          </div>
          {/* Pasa la función setSelectedLocation al componente del mapa */}
          <div>
            {" "}
            <DynamicMap setSelectedLocation={setUbicacion} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Reportar;