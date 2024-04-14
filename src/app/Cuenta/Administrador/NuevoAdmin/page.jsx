"use client"
import React, { useState } from 'react';
import {auth, db} from "../../../../../firebase";
import {createUserWithEmailAndPassword, sendEmailVerification}from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import "./NuevoAdmin.css";

function NuevoAdmin() {
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
            
            const usuariosCollection = collection(db, "usuarios")
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

    //apellido paterno, materno, fech nac, correo

    return (

    <div className='body'>
            
        <div className='container'>

        <div className='nuevo_admin'>

            <h2>Hola, este es un formulario para el nuevo admin :D</h2>
            <div className='formulario'>
                <form onSubmit={registroAdmin}>
                    
                    <input
                        className='datos'
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsername}
                        required
                    />
                    <br/>

                    <div className="apellidos-container">
                        <input 
                        className='datos'
                        type="text"
                        id="appat"
                        name="appat"
                        value={appat}
                        onChange={handleAppat}
                        required
                    />
                
                    <input
                        className='datos'
                        type="text" 
                        id="apmat"
                        name="apmat"
                        value={apmat}
                        onChange={handleApmat}
                        required
                    />
                    </div>
                    
                    <br/>

                    <input 
                        className='datos'
                        type="date" 
                        id='fechaNacimiento'
                        name="fechaNacimiento"
                        value={fechaNacimiento}
                        onChange={handleFechaNacimiento}
                        required
                    />
                    <br/>

                    <input 
                        className='datos'
                        type="text" 
                        id='correo'
                        name="correo"
                        value={correo}
                        onChange={handleCorreo}
                        required
                    />
                    <br/>
                    <input 
                        className='datos'
                        type="text" 
                        id='password'
                        name="password"
                        value={password}
                        onChange={handlePass}
                        required
                    />
                    <br/>

                    <button type="submit">Enviar</button>
                </form>
            </div>


        </div>

        <div className='imagen'>
        </div>
        
        </div>

    </div>
  );
}

export default NuevoAdmin;