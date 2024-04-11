"use client";
import React, { useState, useEffect, useContext } from 'react';
import './perfil.css';
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../../firebase"; 
import AuthContext from "../../../../../context/AuthContext";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";
import {  updateDoc,collection, query, where, getDocs } from 'firebase/firestore';

export default function Dashboard(){
  useAuthUser();
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [reportes, setReportes] = useState([]);
//Obtener datos del usuario
  useEffect(() => {

    const fetchUserData = async () => {
      if (isLogged) {
        try {
          const userQuery = query(collection(db, 'usuarios'), where('uid', '==', auth.currentUser.uid));
          const userDocs = await getDocs(userQuery);


          if (!userDocs.empty) {
            const userDoc = userDocs.docs[0];
            const userData = userDoc.data();
            setUserData(userData);
          } else {
            console.log("No se encontró el documento del usuario");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [isLogged]);

  //REPORTES
  useEffect(() => {
    const obtenerReportes = async () => {
      if (userData && userData.uid) {
        const reportesRef = collection(db, 'reportes');
        const q = query(reportesRef, where('uidUsuario', '==', userData.uid));
  
        try {
          const querySnapshot = await getDocs(q);
          const fetchedReportes = [];
          querySnapshot.forEach((doc) => {
            fetchedReportes.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          console.log('Reportes obtenidos de la base de datos:', fetchedReportes);
          setReportes(fetchedReportes);
        } catch (error) {
          console.error('Error al obtener reportes:', error);
        }
      }
    };
    obtenerReportes();
  }, [userData]);
  
  useEffect(() => {
    console.log('Estado actual de reportes:', reportes);
  }, [reportes]);
  


  const [windowWidth, setWindowWidth] = useState(0);
  const [showLeftSide, setShowLeftSide] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);


  useEffect(() => {
    // Handler para el cambio de tamaño de la ventana
    function handleResize() {
      const width = window.innerWidth;
      setWindowWidth(width);


      if (width <= 800) {
        setShowLeftSide(false);
        setShowToggleButton(true);
      } else {
        setShowLeftSide(true);
        setShowToggleButton(false);
      }
    }


    handleResize();


    window.addEventListener('resize', handleResize);


    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  const CerrarSesion = () => {
    signOut(auth)
      .then(() => {
        console.log('Cierre de sesión exitoso');
        router.push("/Cuenta"); 
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };
  
  const eliminarCuenta = async () => {
    try {
      const reportesRef = collection(db, 'usuarios');
      const q = query(reportesRef, where('uid', '==', userData.uid));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
  
        await updateDoc(doc.ref, { estadoCuenta: false });
        console.log('cuenta desactivada');
        alert('Cuenta desactivada, esperamos verte de nuevo(:')
        CerrarSesion();
  
      });
    } catch (error) {
      console.error('Error al desactivar la cuenta:', error);
    }
  };

  return (
      
    <div className="container-perfil">
        {isLogged && userData && (
      <div id="leftSide" style={{ display: showLeftSide ? 'block' : 'none' }}>
        <div class="profile-card">
          <div class="profile-image">
          {userData.imagen ? (
    <img src={userData.imagen} alt="Imagen de perfil" />
  ) : (
    <img src="https://i.pinimg.com/564x/34/f9/c2/34f9c2822cecb80691863fdf76b29dc0.jpg" alt="Imagen de perfil predeterminada" />
  )} </div>
          <div class="profile-details">
            <div class="nombre">{userData.nombre} </div>
            <div class="name-fields">
              <div class="field appat">{userData.apellidoPaterno}</div>
              <div class="field apmat">{userData.apellidoMaterno}</div>
            </div>
            <div class="fecha-nac">{userData.fechaNacimiento} </div>
            <div class="email">{userData.correo}</div>
            <div class="buttons">
              <button class="cerrar-sesion-btn" onClick={CerrarSesion}>Cerrar Sesión</button>
              <button class="desactivar-cuenta-btn"  onClick={eliminarCuenta}>Desactivar Cuenta</button>
            </div>
          </div>
        </div>
      </div>)}
      <div className='line-vertical'></div>
      <div className="right-side">
        <div className='encabezado-historial'>
          <h2>Tu historial de reportes:</h2>
        </div>
        {reportes.map((reporte, index) => (
                <div className="box2" id="box2" key={index}>
                    <div className="column-left">
                        <div className="fotografía">
                            <img src={reporte.imagenURL} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
                        </div>
                        <div className="column-left-inferior">
                            <div className="fecha">
                            {reporte.fechaReporte}

                            </div>


                            <div className="contador">
                                <div className="icon">
                                    <img
                                        src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                                        className="logo"
                                    />
                                </div>
                                <div className="number">


                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="column-right">
                        <div className="column-right-superior">
                            <div className="estado">
                            {reporte.estado}

                            </div>


                            <div className="guardar">
                                    <img
                                        src="https://i.postimg.cc/52PmmT4T/estrella.png"
                                        className="icon-star"
                                    />
                            </div>
                        </div>


                        <div className="ubicacion">
                            <h3>Ubicación:</h3>
                            <div className="box-ubi">

                            {reporte.ubicacion}
                            </div>
                        </div>


                        <div className="descripcion">
                            <h3>Descripción</h3>
                            <div className="box-des">
                            {reporte.descripcion}

                            </div>
                        </div>
                    </div>
                </div>
                    ))}
            
                {showToggleButton && (
        <button id="toggleButton" onClick={toggleLeftSide}>
          {showLeftSide ? (
            <img src="https://i.postimg.cc/kMxkBZBm/angulo-izquierdo.png" alt="Cerrar" />
          ) : (
            <img src="https://i.postimg.cc/NMkBsTBm/angulo-derecho.png" alt="Abrir" />
          )}
        </button>
      )}
      </div>
      {isLogged && !userData && <p>Cargando datos del usuario...</p>}
    </div>
    
  );
}