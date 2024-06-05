"use client"
import React, { useState } from 'react';
import "./NuevoAdmin.css";
import { enc, desc } from '@/scripts/Cifrado/Cifrar';
export default function NuevoAdmin() {
    const [username, setUsername] = useState('');
    const [appat, setAppat] = useState('');
    const [apmat, setApmat] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edadValida, setEdadValida] = useState(true); // Estado para la validación de edad
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [canSubmit, setCanSubmit] = useState(false);

    
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

    const handleAppat = (e) => {
        setAppat(e.target.value);
      //  console.log(appat)
    };
    const handlePass = (e) => {
        setPassword(e.target.value)
      //  console.log(password)
    }
    const handleApmat = (e) => {
        setApmat(e.target.value);
      //  console.log(apmat)
    };
    const handleFechaNacimiento = (e) => {
        setFechaNacimiento(e.target.value);
     //   console.log(fechaNacimiento)
    };
    const handleCorreo = (e) => {
        setCorreo(e.target.value);
       // console.log(correo)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Has hecho clic");
    };

    const handlePaste = (event) => {
        event.preventDefault(); // Prevenir la acción por defecto del pegado del texto
      };

    const registroAdmin = async(e) => {
        try {
            e.preventDefault();

            const user = enc(username)
            const paterno = enc(appat)
            const materno = enc(apmat)
            const fechaN = enc(fechaNacimiento)
            const email = enc(correo)
            const pass = enc(password)
            console.log(user, " ", paterno, " ", materno, " ",
                fechaN, " ", email, " ", pass
            )


            const parametros = {
                username: encodeURIComponent(user),
                appat: encodeURIComponent(paterno),
                apmat: encodeURIComponent(materno),
                fechaNacimiento: encodeURIComponent(fechaN),
                correo: encodeURIComponent(email),
                password: encodeURIComponent(pass),
            }
            const baseURL = process.env.NEXT_PUBLIC_RUTA_NA
            const res = await fetch(`${baseURL}/${encodeURIComponent(user)}/${encodeURIComponent(paterno)}/${encodeURIComponent(materno)}/${ encodeURIComponent(fechaN)}/${encodeURIComponent(email)}/${encodeURIComponent(pass)}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(parametros),
            })
            if(!res.ok) {
                throw new Error("Error al crear a nuevo admin")
            }
            const data = await res.json()
           

            alert("Se envió correo: " + username)
            window.location.reload()
     
        } catch (error) {
            console.error("error al crear la cuenta: ", error)
            alert(error.mesagge)
        }
    };

    return (

    <div className='body-registroAdmin'>
            
        <div className='container-registroAdmin'>

        <div className='nuevo_admin'>

            <p id="textito-admin">¿Necesitas ayuda con el trabajo?</p>
            <h2 id="titulo-admin">¡Vamos a agregar otro Administrador!</h2>
            <div className='formulario-registroAdmin'>
                <form onSubmit={registroAdmin}>
                    
                    <input
                        className='datosAdmin'
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                onPaste={handlePaste}
                minLength={3}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder='Nombre(s)'
                    />
                    <br/>

                    <div className="apellidos-container">
                        <input 
                        className='datosAdmin'
                        type="text"
                        id="appat"
                        name="appat"
                        value={appat}
                        onChange={handleAppat}
                        onBlur={handleAPBlur}
                  onKeyDown={handleAPKeyDown}
                  onPaste={handlePaste}
                  minLength={4}
                        required
                        placeholder='Apellido Paterno'
                    />
                
                    <input
                        className='datosAdmin'
                        type="text" 
                        id="apmat"
                        name="apmat"
                        value={apmat}
                        onChange={handleApmat}
                        onBlur={handleAPBlur}
                  onKeyDown={handleAPKeyDown}
                  onPaste={handlePaste}
                  minLength={4}
                        required
                        placeholder='Apellido Materno'
                    />
                    </div>

                    <input 
                        className='datosAdmin'
                        type="date" 
                        id='fechaNacimiento'
                        name="fechaNacimiento"
                        value={fechaNacimiento}
                        onChange={handleFechaNacimientoChange}
                        required
                        placeholder='Fecha de Nacimiento'
                    />
                    <br/>

                    <input 
                        className='datosAdmin'
                        type="email" 
                        id='correo'
                        name="correo"
                        value={correo}
                        onChange={handleCorreo}
                        onBlur={handleMailBlur}
                onKeyDown={handleMailKeyDown}
                minLength={10}
                onPaste={handlePaste}
                        required
                        placeholder='Correo electrónico'
                    />
                    <br/>
                    <input 
                        className='datosAdmin'
                        type={showPassword ? "text" : "password"} 
                        id='password'
                        name="password"
                        value={password}
                        onChange={handlePass}
                        onBlur={handlePassBlur}
                onKeyDown={handlePassKeyDown}
                minLength={8}
                        required
                        placeholder='Contraseña'
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                <img src={showPassword ? "https://i.postimg.cc/52rq6typ/ojos-cruzados-1.png" : "https://i.postimg.cc/pXqBMCtw/ojo-1.png"}/>
              </button>

                    <button type="submit" id="btn-registrarUsuario">Registrarse</button>
                </form>
            </div>


        </div>

        <div className='imagen-nuevoAdmin'>
        </div>
        
        </div>

    </div>
  );
}
