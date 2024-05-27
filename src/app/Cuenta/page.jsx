"use client";
import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import Preloader2 from "@/components/preloader1";

import Router from 'next/router';
import Preloader from "@/components/preloader2";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import "./registro.css";
import AuthContext from "../../../context/AuthContext";


function Registro() {
  const [loading2, setLoading2] = useState(true);
  useEffect(() => {
    const handleComplete = () => setLoading2(false);

    Router.events.on('routeChangeStart', () => setLoading2(true));
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    // For the initial load
    handleComplete();

    return () => {
      Router.events.off('routeChangeStart', () => setLoading2(true));
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
    };
  }, []);
  
  
  //elementos del router
  const { push } = useRouter();
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  //elementos de validaciones
  const [active, setActive] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleAdminLinkClick = (event) => {
    event.preventDefault();
    router.push("/Cuenta/Administrador");
  };

  const handleButtonClick = () => {
    setActive(!active);
  };

  const handlePrivacyPolicyClick = () => {
    setShowPrivacyPolicy(true);
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevenir la acción por defecto del pegado del texto
  };

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15); //Prevenir que se autocomplete por el navegado
  };

  //VALIDACIÓN NOMBRE--------------------------------------------------------------------------------------------------------------------
  const handleNameKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[a-zA-Z]/.test(key) || value.length >= 50) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };
  const handleNameBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 3;

    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {

      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  //VALIDACIÓN APELLIDOS--------------------------------------------------------------------------------------------------------------------
  const handleAPKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[a-zA-Z]/.test(key) || value.length >= 20) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };

  const handleAPBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 4;
    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {

      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [appat, setAppat] = useState("");
  const [apmat, setApmat] = useState("");
  const [error, setError] = useState("");
  //VALIDACIÓN Fecha de nacimiento--------------------------------------------------------------------------------------------------------------------
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // Estado para la fecha de nacimiento
  const [edadValida, setEdadValida] = useState(true); // Estado para la validación de edad

  const handleFechaNacimientoChange = (event) => {
    const fecha = event.target.value;
    setFechaNacimiento(fecha);

    // Validar la fecha de nacimiento
    const fechaNacimientoDate = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoDate.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < fechaNacimientoDate.getDate())
    ) {
      edad = edad - 1; // Decrementar la edad si no ha pasado el mes de cumpleaños
    }

    if (edad < 18 || edad > 70) {
      setEdadValida(false);
    } else {
      setEdadValida(true);
    }
  };

  // Agrega una función de manejo para el cambio de estado del checkbox
  const handleCheckBoxChange = () => {
    setCheckBoxChecked(!checkBoxChecked);
  };

  const handleSubmit = (event) => {
    //  event.preventDefault(); // Evitar el envío automático del formulario

    if (!edadValida) {

      return; // No se envía el formulario si la edad no es válida
    }
    if (!checkBoxChecked) {
      alert(
        "Debes aceptar la política de privacidad y los términos y condiciones."
      );
      return; // No se envía el formulario si el checkbox no está marcado
    }

    // Aquí puedes enviar el formulario
  };

  //VALIDACIÓN Correo--------------------------------------------------------------------------------------------------------------------
  const handleMailKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[A-Za-z0-9_@.-]/.test(key) || value.length >= 100) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };

  const handleMailBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 10;

    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {

      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  //VALIDACIÓN Contraseña--------------------------------------------------------------------------------------------------------------------
  const handlePassKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[A-Za-z0-9-_]/.test(key) || value.length >= 20) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };

  const handlePassBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 8;

    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {

      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  //VALIDACIÓN Checkbox--------------------------------------------------------------------------------------------------------------------
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const handleSignUp = async (event) => {
    try {
      event.preventDefault();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Correo de verificación
      sendEmailVerification(user);
      alert("ola se envio correo");
      const uid = user.uid;
      const usuariosCollection = collection(db, "usuarios");
      const nuevoUsuario = {
        uid: uid,
        nombre: nombre,
        apellidoPaterno: appat,
        apellidoMaterno: apmat,
        fechaNacimiento: fechaNacimiento,
        correo: email,
        estadoCuenta: true,
      };

      addDoc(usuariosCollection, nuevoUsuario);
      push("/Cuenta/Usuario/Perfil");
    } catch (error) {
      console.error("Error al crear la cuenta: ", error);
      alert(error.message);
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      setLoading(true); // Muestra el preloader
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user && !user.emailVerified) {
        alert("Por favor, verifica tu correo electrónico para iniciar sesión.");
        signOut(auth);
      } else {
        const reportesRef = collection(db, "usuarios");
        const q = query(reportesRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        let estadoCuenta;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          estadoCuenta = data.estadoCuenta;
        });
        if (estadoCuenta === false) {
          const confirm = window.confirm(
            "Tu cuenta ha sido desactivada. ¿Deseas restablecerla?"
          );
          if (confirm) {
            querySnapshot.forEach(async (doc) => {
              await updateDoc(doc.ref, {
                estadoCuenta: true,
              });
            });
            alert("Cuenta restablecida correctamente");
            push("/Cuenta/Usuario/Perfil");

          } else {
            signOut(auth);
            alert("Inicio de sesión cancelado");
          }
        } else {
          alert("Inicio de sesión exitoso");
          push("/Cuenta/Usuario/Perfil");

        }
      }
    } catch (error) {
      setError(error.message);
      alert("Correo o contraseña incorrectos");
    } finally {
      setLoading(false); // Oculta el preloader una vez completada la operación
    }
  };
  if (isLogged) {
    return (
      <div className="body2">
        <div className="alerta-logueado">
            <h1>🥳🎉</h1>
            <h2>¡Tranquilo, ya estás logueado!</h2>
        <button onClick={() => push("/Cuenta/Usuario/Perfil")}>Ir a tu perfil</button>

        </div>
      </div>
    );
  }

  return (
    <>
    {loading2 && <Preloader />}
    <div className="body">
      {loading && <Preloader2 />}
      <div className={`container-registroUs ${active ? "active" : ""}`} id="container-registroUs">
        <div className="form-container sign-up">
          <form id="form-registro" onSubmit={handleSignUp}>
            <h1 className="title" id="regis-title">
              ¡QUE FELICIDAD QUE TE NOS UNAS!
            </h1>
            <input
              type="text"
              className="datos"
              placeholder="Nombre(s)"
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              minLength={3}
              onPaste={handlePaste}
              autoComplete={generateRandomString()}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <div className="apellidos-container">
              <input
                type="text"
                className="datos"
                id="appat"
                onBlur={handleAPBlur}
                onKeyDown={handleAPKeyDown}
                minLength={4}
                placeholder="Apellido Paterno"
                onPaste={handlePaste}
                autoComplete={generateRandomString()}
                value={appat}
                onChange={(e) => setAppat(e.target.value)}
                required
              />
              <input
                type="text"
                className="datos"
                id="apmat"
                onBlur={handleAPBlur}
                onKeyDown={handleAPKeyDown}
                minLength={4}
                placeholder="Apellido Materno"
                onPaste={handlePaste}
                autoComplete={generateRandomString()}
                value={apmat}
                onChange={(e) => setApmat(e.target.value)}
                required
              />
            </div>
            <input
              type="date"
              className="datos"
              placeholder="Fecha de Nacimiento"
              onChange={handleFechaNacimientoChange}
              value={fechaNacimiento}
              required
            />
            <input
              type="email"
              className="datos"
              placeholder="Correo Electrónico"
              onBlur={handleMailBlur}
              onKeyDown={handleMailKeyDown}
              minLength={10}
              onPaste={handlePaste}
              autoComplete={generateRandomString()}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="datos"
              placeholder="Contraseña"
              onBlur={handlePassBlur}
              onKeyDown={handlePassKeyDown}
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="checkbox-pri"
                name="aceptar"
                onChange={handleCheckBoxChange}
              />
              <p id="a-pri">
                He leído y acepto los{" "}
                <a href="#" id="a-pol" onClick={handlePrivacyPolicyClick}>
                  Términos y Condiciones
                </a>
                😉
              </p>
            </div>
            <button id="registrarse-btn">Registrarse</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form id="form-inicar-sesion" onSubmit={handleSignIn}>
            <h1 className="title" id="ini-title">
              ¡QUE BUENO ES TENERTE DE VUELTA!
            </h1>
            <input
              type="email"
              className="datos"
              placeholder="Correo Electrónico"
              onBlur={handleMailBlur}
              onKeyDown={handleMailKeyDown}
              minLength={10}
              onPaste={handlePaste}
              autoComplete={generateRandomString()}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="datos"
              placeholder="Contraseña"
              onBlur={handlePassBlur}
              onKeyDown={handlePassKeyDown}
              minLength={8}
              onPaste={handlePaste}
              autoComplete={generateRandomString()}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a id="olvi-contra" href="#">
              ¿Olvidaste tu contraseña? 😰
            </a>
            <a id="admin-ini" href="#" onClick={handleAdminLinkClick}>
              Administrador 😎
            </a>
            <button id="iniciarSesion-btn">Iniciar Sesión</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="title-2">¿Ya tienes una cuenta? 🧐</h1>
              <p className="p-advertencia">¡Entra a tu cuenta ahora mismo!</p>
              <button
                id="login"
                onClick={handleButtonClick}
                className="cuentita"
              >
                Iniciar Sesión
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="title-2">¿No tienes una cuenta? 😨</h1>
              <p className="p-advertencia">¡No esperes más y regístrate!</p>

              <button
                className="cuentita"
                id="register"
                onClick={handleButtonClick}
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>

        {/* Pantalla de política de privacidad */}
        {showPrivacyPolicy && (
          <div className="privacy-policy">
            <img src="https://i.postimg.cc/dQNGNhx8/logo-bachecito26.png"></img>
            <h1>BACHECITO 26</h1>
            <h1>AVISO DE PRIVACIDAD</h1>
            <button onClick={() => setShowPrivacyPolicy(false)}>Volver</button>
          </div>
        )}
      </div>
    </div>
    </>
    
  );
}

export default Registro;
/* pipii no se hacer comits/ */

