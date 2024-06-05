"use client";
import React, { useState, useEffect } from "react";
import {
  auth,
  app,
  db,
  collection,
  where,
  query,
  getDocs,
  updateDoc,
} from "../../../../../firebase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./reportes.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Preloader from "@/components/preloader2";
import Router from "next/router";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";
import { sendEmailVerification } from "firebase/auth"; // Importa la función de envío de correo de verificación

// Importa el componente del mapa de manera dinámica
const DynamicMap = dynamic(() => import("@/components/MapR"), {
  ssr: false,
});

const showAlert = (message) => {
  const alertContainer = document.createElement("div");
  alertContainer.classList.add("custom-alertCU");

  alertContainer.innerHTML = `<p>${message}`;
  document.body.appendChild(alertContainer);

  // Elimina la alerta después de cierto tiempo (opcional)
  setTimeout(() => {
    alertContainer.remove();
  }, 6000); // Eliminar la alerta después de 5 segundos
};

function Reportar() {
  const router = useRouter();

  const [userData, setUserData] = useState({});
  const [des, setDesc] = useState("Sin descripción");
  const [ubicacion, setUbicacion] = useState("Sin ubicación");
  const [showVerificationModal, setShowVerificationModal] = useState(false); // Estado para controlar el modal
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // Estado para el mensaje de error

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
        const Uid = enc(uid);

        const baseURL = process.env.NEXT_PUBLIC_RUTA_U;
        const userResponse = await fetch(
          `${baseURL}/${encodeURIComponent(Uid)}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        const dataDesc = desc(userData);
        setUserData(dataDesc);
        if (!dataDesc.verificado) {
          setShowVerificationModal(true); // Mostrar el modal si no está verificado
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [router]);

  const handleDescripcion = (e) => {
    let descs = e.target.value;
    if (descs.length > 80) {
      showAlert("La descripción no puede exceder los 80 caracteres 😨");
      descs = descs.slice(0, 80);
    }
    setDesc(descs);
  };

const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const uid = enc(userData.uid);
    const nombre = userData.nombre;
    const apellidoPaterno = userData.apellidoPaterno;
    const imagenURL = await handleFileUpload();
    const descripcion = des;
    const ubi = ubicacion;
    if (!imagenFondo) {
      showAlert("Por favor, adjunta una imagen antes de enviar el reporte 📸");
      return;
    }
    if (imagenURL === 0) {
      showAlert("Error con la imagen, por favor, escoge una adecuada");
      return;
    }
    const baseURL = process.env.NEXT_PUBLIC_RUTA_MR;
    try {
      const res = await fetch(
        `${baseURL}/${encodeURIComponent(
          uid
        )}/${nombre}/${apellidoPaterno}/${encodeURIComponent(
          imagenURL
        )}/${descripcion}/${ubi}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: encodeURIComponent(uid),
            nombre,
            apellidoPaterno,
            imagenURL: encodeURIComponent(imagenURL),
            descripcion,
            ubi,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Hubo un error en la petición: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      showAlert("Se ha enviado su reporte con éxito 🎉");
      contadorNumRep();

      // Vacia los campos del formulario
      setDesc("Sin descripción");
      setUbicacion("Sin ubicación");
      setImagenFondo("");

      router.push("/Cuenta/Usuario/Perfil");
      //console.log("Respuesta de la API:", data);
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      showAlert(`Ocurrió un error: ${error.message} 😥`);
    } finally {
      setSubmitting(false);
    }
  };

  const contadorNumRep = async () => {
    const userDocRef = collection(db, "usuarios");
    const userQuery = query(userDocRef, where("uid", "==", userData.uid));
    const userSnap = await getDocs(userQuery);

    if (!userSnap.empty) {
      const userDoc = userSnap.docs[0];
      await updateDoc(userDoc.ref, {
        numRep: (userDoc.data().numRep || 0) + 1,
      });
    }
  };

  const handleFileUpload = async () => {
    const archivo = document.querySelector('input[type="file"]');
    const archivito = archivo.files[0];

    if (!archivito) {
      console.error("No se ha seleccionado ningún archivo");
      return;
    }

    const archivoMime = archivito.type;
    if (
      archivoMime.includes("image/jpeg") ||
      archivoMime.includes("image/png")
    ) {
      const storage = getStorage(app);
      const randomId = Math.random().toString(36).substring(7);
      const imageName = `Ticket_${randomId}`;
      const storageRef = ref(storage, `ImagenesBaches/${imageName}`);
      await uploadBytes(storageRef, archivito);
      return getDownloadURL(storageRef);
    } else {
      showAlert("Por favor, escoge una imagen");
      return 0;
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      showAlert("Correo de verificación enviado. Por favor revisa tu bandeja de entrada.");
    } catch (error) {
      console.error("Error al enviar el correo de verificación:", error);
    }
  };

  return (
    <>
      {loading && <Preloader />}
      <div className="container-reportar">
        <div className="izquierda-reportar">
          <form onSubmit={handleSubmit}>
            <div className="blocks">
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
            </div>

            <div className="flexForm">
              <div className="descripcionnn">
                <label htmlFor="descripcion">DESCRIPCIÓN</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder={des}
                  onChange={handleDescripcion}
                  value={des}
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
              <button className="submiiit" type="submit" disabled={submitting}>
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
      {showVerificationModal && (
        <>
          <div className="modal-overlay"></div>
          <div className="modal">
            <div className="modal-content">
              <p>Para acceder a este espacio necesitas verificar tu correo.</p>
              <button onClick={handleSendVerificationEmail}>Click aquí para enviar un correo de verificación</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Reportar;
