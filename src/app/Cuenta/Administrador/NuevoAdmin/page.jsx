"use client"
import React, { useState } from 'react';
import {auth, db} from "../../../../../firebase";
import {createUserWithEmailAndPassword, sendEmailVerification}from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import "./NuevoAdmin.css";

export default function NuevoAdmin() {
    const [username, setUsername] = useState('');
    const [appat, setAppat] = useState('');
    const [apmat, setApmat] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('')
    const registroAdmin = async(e) => {
        try {
            e.preventDefault();
            const adminCredential = await createUserWithEmailAndPassword(auth, correo, password)
            const admin = adminCredential.user
            sendEmailVerification(admin)
            alert("Se envió correo")
            const uid = admin.uid
            
            const usuariosCollection = collection(db, "usuarios")   //collection(db, "tickets")
            const nuevoUsuario = {
                uid: uid, 
                nombre: username,
                apellidoPaterno: appat,
                apellidoMaterno: apmat,
                fechaNacimiento: fechaNacimiento,
                correo: correo,
                estadoCuenta: true,
                rol: "admin",
            }
            addDoc(usuariosCollection, nuevoUsuario)
            alert("Se guardó el usuario")
        } catch (error) {
            console.error("error al crear la cuenta: ", error)
            alert(error.mesagge)
        }
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
        console.log(username)
    };
    const handleAppat = (e) => {
        setAppat(e.target.value);
        console.log(appat)
    };
    const handlePass = (e) => {
        setPassword(e.target.value)
        console.log(password)
    }
    const handleApmat = (e) => {
        setApmat(e.target.value);
        console.log(apmat)
    };
    const handleFechaNacimiento = (e) => {
        setFechaNacimiento(e.target.value);
        console.log(fechaNacimiento)
    };
    const handleCorreo = (e) => {
        setCorreo(e.target.value);
        console.log(correo)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Has hecho clic");
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
                        onChange={handleUsername}
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
                        onChange={handleFechaNacimiento}
                        required
                        placeholder='Fecha de Nacimiento'
                    />
                    <br/>

                    <input 
                        className='datosAdmin'
                        type="text" 
                        id='correo'
                        name="correo"
                        value={correo}
                        onChange={handleCorreo}
                        required
                        placeholder='Correo electrónico'
                    />
                    <br/>
                    <input 
                        className='datosAdmin'
                        type="text" 
                        id='password'
                        name="password"
                        value={password}
                        onChange={handlePass}
                        required
                        placeholder='Contraseña'
                    />
                    <br/>

                    <button type="submit" id="btn-registrarUsuario">Registrarse</button>
                </form>
            </div>


        </div>

        <div className='imagen-nuevoAdmin'>
            <img src="https://i.postimg.cc/sXkS5jM1/Imagen-registro-Admin.png" alt="" />
        </div>
        
        </div>

    </div>
  );
}
