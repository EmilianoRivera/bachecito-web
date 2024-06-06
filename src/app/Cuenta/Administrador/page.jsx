"use client";
import React, { useState, useEffect } from "react";
import anime from 'animejs';
import { auth, db } from "../../../../firebase";
import { useRouter } from "next/navigation";
import Preloader from "@/components/preloader1";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import './admin.css'

function Administrador() {
  const showAlert = (message) => {
    const alertContainer = document.createElement("div");
    alertContainer.classList.add("custom-alertCU");

    alertContainer.innerHTML = `<p>${message}</p>`;
    document.body.appendChild(alertContainer);

    // Elimina la alerta después de cierto tiempo (opcional)
    setTimeout(() => {
      alertContainer.remove();
    }, 6000); // Eliminar la alerta después de 5 segundos
  };

  useEffect(() => {
    let currentAnimation = null;

    const emailInput = document.querySelector('#correo');
    const passwordInput = document.querySelector('#contraseña');
    const submitButton = document.querySelector('#iniciarSesion-btn-admin');
    const pathElement = document.querySelector('path');

    const createAnimation = (offsetValue, dashArrayValue) => {
      if (currentAnimation) currentAnimation.pause();
      currentAnimation = anime({
        targets: 'path',
        strokeDashoffset: {
          value: offsetValue,
          duration: 700,
          easing: 'easeOutQuart',
        },
        strokeDasharray: {
          value: dashArrayValue,
          duration: 700,
          easing: 'easeOutQuart',
        },
      });
    };

    emailInput.addEventListener('focus', () => {
      createAnimation(0, '240 1386');
    });

    passwordInput.addEventListener('focus', () => {
      createAnimation(-336, '240 1386');
    });

    submitButton.addEventListener('click', () => {
      createAnimation(-730, '530 1386');
    });

    return () => {
      if (currentAnimation) currentAnimation.pause();
    };
  }, []);

  const { push } = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [canSubmit, setCanSubmit] = useState(false);

  //VALIDACIÓN Correo
  const handleMailKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    if (key === "Backspace" || (key === "Delete" && event.target.selectionStart !== event.target.selectionEnd)) {
      return;
    }
    if (!/[A-Za-z0-9_@.-]/.test(key) || value.length >= 100) {
      event.preventDefault();
    }
  };

  const handleMailBlur = (event) => {
    const value = event.target.value;
    const minLength = 10;
    if (value.length < minLength) {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
  };

  //VALIDACIÓN Contraseña
  const handlePassKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    if (key === "Backspace" || (key === "Delete" && event.target.selectionStart !== event.target.selectionEnd)) {
      return;
    }
    if (!/[A-Za-z0-9-_]/.test(key) || value.length >= 20) {
      event.preventDefault();
    }
  };

  const handlePassBlur = (event) => {
    const value = event.target.value;
    const minLength = 8;
    if (value.length < minLength) {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const reportesRef = collection(db, "usuarios");
      const q = query(reportesRef, where("correo", "==", email));
      const querySnapshot = await getDocs(q);
      let userDoc;
      let userRol;
      let isAdmin = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userRol = data.rol;
        userDoc = doc;
      });
      if (userRol === "admin") {
        isAdmin = true;
      }
      if (isAdmin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        showAlert("Inicio de sesión exitoso, bienvenido Admin 👷‍♂️");
        push("/Cuenta/Administrador/Dashboard");
      } else {
        signOut(auth);
        showAlert("No tienes permisos para iniciar como Administrador 🚨");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-adminLogin">
      {loading && <Preloader />}
      <div className="container-adminLogin">
        <div className="left">
          <div className="login">¡Hola!<p className='emoji'>👋</p></div>
          <div className="eula">Bienvenido administrador, asegurate de hacer buen uso de tu cuenta ¡gracias por tu labor!</div>
        </div>
        <div className="right">
          <svg viewBox="0 0 320 300">
            <defs>
              <linearGradient id="linearGradient" x1="13" y1="193.49992" x2="307" y2="193.49992" gradientUnits="userSpaceOnUse">
                <stop style={{ stopColor: '#fce302' }} offset="0" id="stop876" />
                <stop style={{ stopColor: '#ff0000' }} offset="1" id="stop878" />
              </linearGradient>
            </defs>
            <path d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143" />
          </svg>

          <form className='centered' onSubmit={handleSignIn}>
            <label className="label-admin">Correo</label>
            <input 
              className="input-admin" 
              type="email"  
              name="email"
              onBlur={handleMailBlur}
              onKeyDown={handleMailKeyDown}
              minLength={10}
              value={email}  
              required
              onChange={(e) => setEmail(e.target.value)} 
              id="correo" 
            />
            <label className="label-admin" id="margin">Contraseña</label>
            <div className="password-container">
              <input 
                className="input-admin" 
                type={showPassword ? "text" : "password"} 
                value={password}  
                onBlur={handlePassBlur}
                onKeyDown={handlePassKeyDown}
                minLength={8}
                name="password"
                id="contraseña" 
                onChange={(e) => setPassword(e.target.value)}  
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? "https://i.postimg.cc/52rq6typ/ojos-cruzados-1.png" : "https://i.postimg.cc/pXqBMCtw/ojo-1.png"}/>
              </button>
            </div>
            <button type="submit" id="iniciarSesion-btn-admin">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Administrador;
