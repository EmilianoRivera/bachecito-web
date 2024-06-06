"use client";
import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import Preloader2 from "@/components/preloader1";
import Router from "next/router";
import Preloader from "@/components/preloader2";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  getAuth,
} from "firebase/auth";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
} from "firebase/firestore";
import "./registro.css";
import AuthContext from "../../../context/AuthContext";
import { dataTable, events, numberDisplay } from "dc";
import { enc } from "@/scripts/Cifrado/Cifrar";
function Registro() {
  const [loading2, setLoading2] = useState(true);
  useEffect(() => {
    const handleComplete = () => setLoading2(false);

    Router.events.on("routeChangeStart", () => setLoading2(true));
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    handleComplete();

    return () => {
      Router.events.off("routeChangeStart", () => setLoading2(true));
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  }, []);
  async function getCokies() {
    const response = await fetch('/api/cookie')
    const data = await response.json()
    console.log(data)
  }
  

  //elementos del router
  const { push } = useRouter();
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  //elementos de validaciones
  const [active, setActive] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    if (!/[a-zA-Z\s]/.test(key) || value.length >= 50) {
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
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);

  const showAlert = (message) => {
    const alertContainer = document.createElement("div");
    alertContainer.classList.add("custom-alertCU");

    // Agrega un enlace para mostrar la alerta al hacer clic
    const linkMarkup = `<a href="#" class="alert-link">Contáctanos</a>`;

    alertContainer.innerHTML = `<p>${message} ${linkMarkup}</p>`;
    document.body.appendChild(alertContainer);

    // Maneja el clic en el enlace
    const alertLink = alertContainer.querySelector(".alert-link");
    alertLink.addEventListener("click", handleClick);

    // Elimina la alerta después de cierto tiempo (opcional)
    setTimeout(() => {
      alertContainer.remove();
    }, 6000); // Eliminar la alerta después de 5 segundos
  };

  const handleClick = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace

    // Muestra una alerta al usuario
    const confirmation = confirm(
      "Estás a punto de ser redirigido a tu cuenta de correo electrónico. ¿Deseas continuar?"
    );

    // Si el usuario acepta, abre el cliente de correo
    if (confirmation) {
      const subject = encodeURIComponent(
        "Atención al usuario por BACHECITO 26 - WEB"
      );
      const body = encodeURIComponent(
        "¡Hola GEMMA!👋 Me pongo en contacto con ustedes debido a..."
      );
      window.open(
        "mailto:somos.gemma.01@gmail.com?subject=" + subject + "&body=" + body
      );
    } else {
      // Si el usuario no acepta, no se hace nada
      return;
    }
  };

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

  const handleCheckBoxChange = () => {
    setCheckBoxChecked(!checkBoxChecked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let missingFields = [];

    if (!nombre) missingFields.push("Nombre");
    if (!appat) missingFields.push("Apellido Paterno");
    if (!apmat) missingFields.push("Apellido Materno");
    if (!fechaNacimiento) missingFields.push("Fecha de Nacimiento");
    if (!email) missingFields.push("Correo Electrónico");
    if (!password) missingFields.push("Contraseña");
    if (!checkBoxChecked) missingFields.push("Aceptar Términos y Condiciones");

    if (missingFields.length > 0) {
      showAlert(
        "Faltan los siguientes campos por llenar: " + missingFields.join(", ")
      );
      return;
    }

    if (!edadValida) {
      showAlert("La edad debe estar entre 18 y 70 años.");
      return;
    }

    if (!checkBoxChecked) {
      showAlert(
        "Debes aceptar la política de privacidad y los términos y condiciones."
      );
      return;
    }

    handleSignUp(event);
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
  const handleSignUp = async (event) => {
    try {
      event.preventDefault();
      if (!checkBoxChecked) {
        showAlert(
          "Debes aceptar la política de privacidad y los términos y condiciones."
        );
        return;
      }

      const nom = enc(nombre);
      const apellidoP = enc(appat);
      const apellidoM = enc(apmat);
      const fechaN = enc(fechaNacimiento);
      const corr = enc(email);
      const pass = enc(password);

      const parametros = {
        nombre: encodeURIComponent(nom),
        appat: encodeURIComponent(apellidoP),
        apmat: encodeURIComponent(apellidoM),
        fechaNacimiento: encodeURIComponent(fechaN),
        email: encodeURIComponent(corr),
        password: encodeURIComponent(pass),
      };
      const baseURL = process.env.NEXT_PUBLIC_RUTA_REGISTROU;
      const res = await fetch(
        `${baseURL}/${encodeURIComponent(nom)}/${encodeURIComponent(
          apellidoP
        )}/${encodeURIComponent(apellidoM)}/${encodeURIComponent(
          fechaN
        )}/${encodeURIComponent(corr)}/${encodeURIComponent(pass)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parametros),
        }
      );
      if (!res.ok) {
        throw new Error("No se pudieron recuperar los datos del usuario 😢");
      }
      const data = await res.json();

     // console.log(data)
      showAlert("Bienvenido a Bachecito 26, se envio un correo de verificación ✉");
      setActive(!active);
    } catch (error) {
      console.error("Error al crear la cuenta: ", error, "🚧");
      showAlert(error.message);
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Consulta para verificar el estado de la cuenta
      const reportesRef = collection(db, "usuarios");
      const q = query(reportesRef, where("correo", "==", email));
      const querySnapshot = await getDocs(q);

      let estadoCuenta;
      let userDoc;
      let userRol;
      let userHabilited;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        estadoCuenta = data.estadoCuenta;
        userRol = data.rol;
        userHabilited = data.inhabilitada;
        userDoc = doc;
      });

      if (
        estadoCuenta === false &&
        userRol === "usuario" &&
        userHabilited === false
      ) {
        const confirm = window.confirm(
          "Tu cuenta ha sido desactivada. ¿Deseas restablecerla?"
        );
        if (confirm) {
          await updateDoc(userDoc.ref, { estadoCuenta: true });
          showAlert("Cuenta restablecida correctamente");

          // Si la cuenta está activa, proceder con el inicio de sesión
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          
          const user = userCredential.user;
          await getCokies();
          showAlert("Inicio de sesión exitoso");
          push("/Cuenta/Usuario/Perfil");
        } else {
          showAlert("Inicio de sesión cancelado");
          return; // Salir de la función para no proceder con el inicio de sesión
        }
      } else if (
        estadoCuenta === true &&
        userRol === "usuario" &&
        userHabilited === false
      ) {
        // Si la cuenta ya está activa, proceder con el inicio de sesión
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await getCokies();
        showAlert("Inicio de sesión exitoso");
        push("/Cuenta/Usuario/Perfil");
      } else {
        showAlert(
          "Lo sentimos no puedes acceder al sistema. Motivos posibles: Rol inválido, Acceso Inhabilitado o cuenta inexistente, ¿Necesitas ayuda?"
        );
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError(error.message);
      showAlert("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const Recuperar = (e) => {
    e.preventDefault();
    const auth = getAuth();
    sendPasswordResetEmail(auth, recoveryEmail)
      .then(() => {
        showAlert(`Correo de recuperación enviado a: ${recoveryEmail}`);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error("Error al enviar el correo de recuperación: ", error);
      });
  };
  if (isLogged) {
    return (
      <div className="body2">
        <div className="alerta-logueado">
          <h1>🥳🎉</h1>
          <h2>¡Tranquilo, ya estás logueado!</h2>
          <button onClick={() => push("/Cuenta/Usuario/Perfil")}>
            Ir a tu perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading2 && <Preloader />}
      <div className="body">
        {loading && <Preloader2 />}
        <div
          className={`container-registroUs ${active ? "active" : ""}`}
          id="container-registroUs"
        >
          <div className="form-container sign-up">
            <form id="form-registro" onSubmit={handleSubmit}>
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
                name="nombre"
                id="nombre"
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
                  name="appat"
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
                  name="apmat"
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
                name="fechaNacimiento"
                id="fechaNacimiento"
                placeholder="Fecha de Nacimiento"
                onChange={handleFechaNacimientoChange}
                value={fechaNacimiento}
                required
              />
              <input
                type="email"
                className="datos"
                name="email"
                id="email"
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
                type={showPassword ? "text" : "password"} 
                className="datos"
                name="password"
                id="password"
                placeholder="Contraseña"
                onBlur={handlePassBlur}
                onKeyDown={handlePassKeyDown}
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password2"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? "https://i.postimg.cc/52rq6typ/ojos-cruzados-1.png" : "https://i.postimg.cc/pXqBMCtw/ojo-1.png"}/>
              </button>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="aceptar"
                  id="checkBox"
                  checked={checkBoxChecked}
                  onChange={handleCheckBoxChange}
                  required
                />
                <p id="a-pri">
                  He leído y acepto los{" "}
                  <a
                    id="a-pol"
                    onClick={handlePrivacyPolicyClick}
                    htmlFor="checkBox"
                  >
                    Términos y Condiciones
                  </a>
                  😉
                </p>
              </div>
              <button type="submit" className="btn" id="registrarse-btn">
                Registrarse
              </button>
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
                name="email"
                id="email"
                required
              />
              <input
                type={showPassword ? "text" : "password"} 
                className="datos"
                placeholder="Contraseña"
                onBlur={handlePassBlur}
                onKeyDown={handlePassKeyDown}
                minLength={8}
                name="password"
                id="password"
                onPaste={handlePaste}
                autoComplete={generateRandomString()}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password3"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? "https://i.postimg.cc/52rq6typ/ojos-cruzados-1.png" : "https://i.postimg.cc/pXqBMCtw/ojo-1.png"}/>
              </button>
              <a id="olvi-contra" onClick={() => setModalVisible(true)}>
                ¿Olvidaste tu contraseña? 😰
              </a>
              <a id="admin-ini" onClick={handleAdminLinkClick}>
                Administrador 😎
              </a>
              <button type="submit" className="btn" id="iniciarSesion-btn">
                Iniciar Sesión
              </button>
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
        </div>
        {modalVisible && (
          <div className="modal2">
            <div className="modal-content2">
              <span className="close2" onClick={() => setModalVisible(false)}>
                &times;
              </span>
              <h2>Recuperar Contraseña</h2>
              <form onSubmit={Recuperar}>
                <input
                  type="email"
                  className="datos"
                  name="email"
                  id="email"
                  onBlur={handleMailBlur}
                  onKeyDown={handleMailKeyDown}
                  minLength={10}
                  onPaste={handlePaste}
                  autoComplete={generateRandomString()}
                  placeholder="Introduce tu correo electrónico"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
                <button className="enviar" type="submit">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        )}
        {showPrivacyPolicy && (
          <div className="privacy-policy">
            <div className="terminos">
              <img src="https://i.postimg.cc/dQNGNhx8/logo-bachecito26.png"></img>
              <div className="blablabla">
                <h1>BACHECITO 26</h1>
                <h2>
                  <i>AVISO DE PRIVACIDAD</i>
                </h2>
                <p>
                  Este aviso de privacidad describe cómo Bachecito 26 recopila,
                  utiliza y protege la información personal de sus usuarios, así
                  como las reglas y políticas que deben seguirse al utilizar
                  nuestra aplicación, de acuerdo con las leyes de protección de
                  datos vigentes en México.
                </p>
                <p>
                  Con la entrada en vigor de la Ley General de Protección de
                  Datos Personales en Posesión de Sujetos Obligados (en lo
                  sucesivo, &quot;Ley General&quot;) y los Lineamientos Generales de
                  Protección de Datos Personales para el Sector Público (en lo
                  sucesivo, &quot;Lineamientos Generales&quot;), existe la obligación de
                  atender las disposiciones que dichos ordenamientos establecen,
                  entre ellas el cumplimiento del principio de información, el
                  cual se materializa a través de la puesta a disposición del
                  Aviso de Privacidad.
                </p>
                <p>
                  Este Aviso de Privacidad se emite de conformidad con la Ley de
                  Protección de Datos Personales en Posesión de Sujetos
                  Obligados de la Ciudad de México (en adelante, &quot;la Ley&quot;) y
                  tiene como objetivo informarle sobre el tratamiento de sus
                  datos personales por parte de GEMMA, con domicilio en Mar
                  Mediterráneo 227, Popotla, 11400 Ciudad de México, CDMX.
                </p>

                <h3>Datos Personales Recopilados:</h3>
                <p>
                  En el proceso de registro y uso de la aplicación móvil o
                  sistema web, recopilamos los siguientes datos personales:
                </p>
                <ul>
                  <li>Nombre incluyendo apellidos paterno y materno.</li>
                  <li>Fecha de Nacimiento.</li>
                  <li>Dirección de correo electrónico.</li>
                  <li>
                    Ubicación geográfica (para informar sobre baches en su
                    área).
                  </li>
                  <li>
                    Información de reportes de baches (ubicación, descripción,
                    fotos, etc.).
                  </li>
                </ul>

                <h3>Finalidad del Tratamiento de Datos:</h3>
                <p>
                  Los datos personales que recopilamos serán utilizados para los
                  siguientes fines:
                </p>
                <ul>
                  <li>
                    Permitir el acceso y el uso de nuestra aplicación móvil y
                    sistema web.
                  </li>
                  <li>Facilitar la comunicación entre GEMMA y el usuario.</li>
                  <li>
                    Procesar y gestionar los reportes de baches realizados a
                    través de la aplicación móvil y/o el sistema web.
                  </li>
                  <li>
                    Dar seguimiento a los reportes de baches realizados por
                    usted y los demás usuarios de Bachecito 26 (móvil y web).
                  </li>
                </ul>

                <h3>Transferencia de Datos:</h3>
                <p>
                  Sus datos personales no serán transferidos, compartidos ni
                  vendidos a terceros sin su consentimiento expreso, a menos que
                  así lo requiera la ley o una autoridad competente. La
                  confidencialidad es nuestra prioridad y nos comprometemos a
                  proteger sus datos personales de acuerdo con las regulaciones
                  vigentes y a informarle en caso de cualquier excepción a esta
                  norma.
                </p>

                <h3>Integridad de los Datos:</h3>
                <p>
                  Conforme a la Ley de Protección de Datos Personales en México,
                  garantizamos la integridad de sus datos recabados para
                  proteger la confidencialidad y veracidad de la información
                  dentro de Bachecito 26. Para proteger estos datos, el usuario
                  podrá eliminarlos pero estos sólo serán desactivados del
                  sistema web o aplicación móvil según sea el caso. Después de
                  un periodo de 6 años, los datos podrán ser eliminados
                  permanentemente del sistema, coincidiendo con el cambio de
                  gobierno presidencial cada sexenio.
                </p>
                <p>
                  Si el usuario desea eliminar permanentemente sus datos del
                  sistema, deberá ejercer sus derechos ARCO poniéndose en
                  contacto con nosotros y seguir el siguiente procedimiento:
                </p>
                <p>
                  Enviar un correo electrónico a{" "}
                  <a href="mailto:somos.gemma01@gmail.com">
                    somos.gemma01@gmail.com
                  </a>{" "}
                  con el asunto BAJA DEFINITIVA DE BACHECITO 26.
                </p>
                <p>Incluir en el cuerpo del correo la siguiente información:</p>
                <ul>
                  <li>Nombre completo.</li>
                  <li>Tipo de usuario (administrador o final).</li>
                  <li>
                    Correo electrónico registrado en el sistema web o aplicación
                    móvil.
                  </li>
                  <li>
                    Descripción de su solicitud fundamentada en los derechos
                    ARCO.
                  </li>
                </ul>

                <h3>Medidas de Seguridad:</h3>
                <p>
                  Hemos implementado medidas de seguridad técnicas y
                  organizativas adecuadas para proteger sus datos personales
                  contra el acceso no autorizado, la divulgación, la alteración
                  y la destrucción.
                </p>

                <h3>Fundamento legal:</h3>
                <p>
                  Integral: Artículos 26, 27, 28 y 57 Ley General de Protección
                  de Datos Personales en Posesión de Sujetos Obligados,
                  Artículos 28, 30, 31, 32, 33, 35, 36, 37, 38, 40, 41 y 42 de
                  los Lineamientos Generales de Protección de Datos Personales
                  para el Sector Público.
                </p>
                <p>
                  Artículos 11, 14, 15, 16 y 19 de los Lineamientos que
                  establecen los parámetros, modalidades y procedimientos de
                  portabilidad de datos personales (en lo sucesivo Lineamientos
                  de Portabilidad).
                </p>

                <h3>Derechos ARCO:</h3>
                <p>De acuerdo con la Ley, usted tiene derecho a:</p>
                <ul>
                  <li>Acceder a sus datos personales.</li>
                  <li>
                    Rectificar sus datos en caso de ser inexactos o incompletos.
                  </li>
                  <li>
                    Cancelar sus datos cuando considere que no son necesarios
                    para los fines establecidos en este Aviso de Privacidad.
                  </li>
                  <li>
                    Oponerse al tratamiento de sus datos para fines específicos.
                  </li>
                </ul>
                <p>
                  Para ejercer cualquiera de los derechos ARCO, puede ponerse en
                  contacto con nosotros a través de{" "}
                  <a href="mailto:somos.gemma01@gmail.com">
                    somos.gemma01@gmail.com
                  </a>{" "}
                  proporcionando la siguiente información:
                </p>
                <ul>
                  <li>Nombre completo.</li>
                  <li>Correo electrónico de contacto.</li>
                  <li>Descripción de su solicitud.</li>
                </ul>

                <h3>Negativa del consentimiento:</h3>
                <p>
                  Con el propósito de llevar a cabo estas finalidades y posibles
                  transferencias, requerimos de su consentimiento. Si usted está
                  en desacuerdo con los términos y condiciones de privacidad
                  expresados en este aviso y opta por no otorgar su
                  consentimiento para que sus datos sean recopilados o
                  utilizados de la manera establecida anteriormente, se le
                  sugiere no utilizar los servicios proporcionados dentro de
                  Bachecito 26. Al no dar su consentimiento se comprende que
                  existe la posibilidad de que no pueda acceder a ciertas
                  funciones de la aplicación móvil y del sistema web.
                </p>
                <p>
                  En caso de que no desee que sus datos personales sean
                  procesados con dichos fines o transferidos después de haber
                  aceptado el aviso de privacidad, es decir, que cambie de
                  opinión sobre el manejo de sus datos, le brindamos la
                  oportunidad de expresar su negativa al momento en que se le
                  proporcione el formulario correspondiente.
                </p>

                <h3>Cambios en el Aviso de Privacidad:</h3>
                <p>
                  Nos reservamos el derecho de realizar cambios o
                  actualizaciones a este Aviso de Privacidad para cumplir con
                  cambios en la legislación o para reflejar las actualizaciones
                  en nuestras prácticas de manejo de datos. La versión más
                  reciente estará disponible dentro de nuestra aplicación.
                </p>
                <p>
                  Al registrarse y utilizar nuestra aplicación móvil y/o sistema
                  web, usted acepta los términos y condiciones establecidos en
                  este Aviso de Privacidad.
                </p>
                <p>
                  Si tiene alguna pregunta o inquietud sobre este Aviso de
                  Privacidad o el manejo de sus datos personales, no dude en
                  ponerse en contacto con nosotros.
                </p>
                <p>
                  No se le contactará por ningún otro medio que no sean los
                  contactos oficiales de la empresa desarrolladora de Bachecito
                  26 mostrados a continuación o en su defecto, expuestos en el
                  sitio oficial de Bachecito 26, por lo que en caso de necesitar
                  atención de parte de la empresa GEMMA es su debida
                  responsabilidad contactarnos por los medios oficiales
                  proporcionados. En caso de incumplir con esta petición y de
                  proporcionar sus datos a terceros, impostores o contactos no
                  oficiales (incluyendo las redes sociales de Bachecito 26)
                  GEMMA se deslinda de cualquier responsabilidad por el uso
                  inadecuado de sus datos.
                </p>
                <p>Fecha de última actualización: 21/05/2024</p>
                <br />
                <br />

                <h2>
                  <i>TÉRMINOS Y CONDICIONES:</i>
                </h2>
                <p>
                  Por favor, lea atentamente los siguientes términos y
                  condiciones antes de utilizar nuestra aplicación móvil y/o
                  sistema web. Al acceder y utilizar la aplicación o sistema,
                  usted acepta cumplir con estos términos y condiciones así como
                  dar autorización al manejo y almacenamiento de sus datos
                  personales solicitados para el funcionamiento de la
                  aplicación.
                </p>
                <p>
                  En caso de incumplir con alguno de los términos y condiciones
                  expuestos a continuación, GEMMA está obligado a aplicar la
                  sanción o castigo correspondiente a la falta dada de acuerdo a
                  su gravedad.
                </p>

                <h3>1. Uso Aceptable:</h3>
                <p>
                  Usted se compromete a utilizar la aplicación de manera
                  responsable y de acuerdo con todas las leyes y regulaciones
                  aplicables, por lo que no está permitido utilizar la
                  aplicación con fines ilegales o fraudulentos. En caso de
                  infringir este acuerdo usted renuncia a la privacidad de sus
                  datos personales, por lo que sus datos proporcionados podrán
                  ser compartidos con las autoridades pertinentes según
                  corresponda y su cuenta será baneada permanentemente del
                  sistema.
                </p>

                <h3>2. Registro de Usuario:</h3>
                <p>
                  Para utilizar ciertas funciones de la aplicación, debe crear
                  una cuenta y proporcionar información precisa y actualizada.
                  Es su responsabilidad mantener la confidencialidad de su
                  contraseña y cuenta.
                </p>

                <h3>3. Reportes de Baches:</h3>
                <p>
                  (Original) Usted acepta que los reportes de baches que
                  presente a través de la aplicación deben ser verídicos. La
                  aplicación se utiliza para fines de reporte y seguimiento de
                  baches en vías secundarias de la alcaldía Azcapotzalco.
                  (Modificado) La aplicación se utiliza para fines de reporte y
                  seguimiento de baches en vías de la Ciudad de México y es
                  ajeno a cualquier otro uso establecido dentro de este acuerdo.
                </p>
                <p>
                  Usted acepta que los datos proporcionados para efectuar los
                  reportes de baches que presente a través de la aplicación
                  móvil y/o del sistema web deben ser verídicos. Usted se
                  compromete a subir imágenes de baches únicamente y de añadir
                  una descripción que carezca de contenido explícito, con fines
                  políticos o religiosos y de información personal que pueda
                  comprometer su integridad. Usted tiene derecho a omitir el
                  campo de descripción. En caso de infringir esta normativa su
                  cuenta dentro del sistema será desactivada.
                </p>

                <h3>4. Propiedad Intelectual:</h3>
                <p>
                  Todos los derechos de propiedad intelectual relacionados con
                  la aplicación, incluyendo software, diseño y contenido, son
                  propiedad de GEMMA.
                </p>

                <h3>5. Privacidad y Protección de Datos:</h3>
                <p>
                  Sus datos personales se manejan de acuerdo con nuestro Aviso
                  de Privacidad, el cual puede revisar en la aplicación móvil y
                  sistema web. Usted acepta recibir notificaciones y
                  comunicaciones relacionadas con su cuenta y el uso de la
                  aplicación en caso de ser necesarios.
                </p>

                <h3>6. Limitación de Responsabilidad:</h3>
                <p>
                  La aplicación se proporciona &quot;tal cual&quot; y GEMMA no garantiza
                  su funcionamiento ininterrumpido o libre de errores. GEMMA no
                  será responsable por daños directos o indirectos derivados del
                  uso de la aplicación.
                </p>

                <h3>7. Cambios en los Términos y Condiciones:</h3>
                <p>
                  Nos reservamos el derecho de modificar estos términos y
                  condiciones en cualquier momento. Se le notificará sobre
                  cualquier cambio importante realizado.
                </p>

                <h3>8. Terminación de Cuenta:</h3>
                <p>
                  Podemos suspender o dar de baja su cuenta en caso de
                  incumplimiento de estos términos y condiciones así como por
                  cualquier otra razón a nuestra discreción.
                </p>

                <h3>9. Precaución con el uso de la aplicación:</h3>
                <p>
                  GEMMA se deslinda de cualquier tipo de accidente que el
                  usuario pueda sufrir durante el uso de Bachecito 26, es
                  completa responsabilidad del usuario tomar las precauciones
                  necesarias al utilizar el teléfono celular en las vías
                  transitadas por cualquier tipo de transporte.
                </p>

                <h3>10. Ley Aplicable:</h3>
                <p>
                  Estos términos y condiciones se rigen por las leyes de la
                  Ciudad de México y cualquier disputa se resolverá en los
                  tribunales de la Ciudad de México. Si tiene alguna pregunta o
                  inquietud con respecto a estos términos y condiciones,
                  comuníquese con nosotros a través de{" "}
                  <a href="mailto:somos.gemma01@gmail.com">
                    somos.gemma01@gmail.com
                  </a>
                  .
                </p>
                <p>Fecha de última actualización: 21/05/2024</p>
                <p>
                  GEMMA
                  <br />
                  Mar Mediterráneo 227, Popotla, 11400 Ciudad de México, CDMX.
                  <br />
                  <a href="mailto:somos.gemma01@gmail.com">
                    somos.gemma01@gmail.com
                  </a>
                  <br />
                  55 8412 8938
                </p>
                <br />
                <button onClick={() => setShowPrivacyPolicy(false)}>
                  Volver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Registro;