"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../../../firebase";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { updateDoc,collection, query, where, getDocs, addDoc} from "firebase/firestore";
import './admin.css'
function Administrador() {
 const { push, pathname } = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  console.log(email, " ", password)
  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
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
        if (user && !user.estadoCuenta) {
          const confirm = window.confirm("Tu cuenta ha sido desactivada. ¿Deseas restablecerla?");
          if (confirm) {
            const reportesRef = collection(db, 'usuarios');
            const q = query(reportesRef, where('uid', '==', user.uid));
            const querySnapshot = await getDocs(q);
  
            querySnapshot.forEach(async (doc) => {
              await updateDoc(doc.ref, {
                estadoCuenta: true
              });
            });
  
            alert("Cuenta restablecida correctamente");
            push("/Cuenta/Administrador/Dashboard");
            console.log("Usuario inició sesión con éxito:", user);
          } else {
            // Si el usuario hace clic en "No", no se inicia sesión
            signOut(auth);
            alert("Inicio de sesión cancelado");

          }
        } else {
            const reportesRef = collection(db, 'usuarios');
            const q = query(reportesRef, where('uid', '==', user.uid));
            const querySnapshot = await getDocs(q);
    
            querySnapshot.forEach(async (doc) => {
              const userData = doc.data();
              if (userData.rol === 'admin') {
                alert("Inicio de sesión exitoso");
                push("/Cuenta/Administrador/Dashboard");
                console.log("Usuario inició sesión con éxito:", user);
              } else {
                // Si el usuario no es un administrador, cerrar sesión
                signOut(auth);
                alert("No tienes permiso para iniciar sesión como administrador");
              }
            });
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  };
  
  return (
    <div>
        <form className='centered' onSubmit={handleSignIn}>
            <div id="inputs">
                <div id="correo">
                    <label>Correo: </label>
                    <input type="text"  value={email}  onChange={(e) => setEmail(e.target.value)} placeholder='correo'/>
                </div>
                <div id="contraseña">
                    <label>Contraseña: </label>
                    <input type="text"  value={password}  onChange={(e) => setPassword(e.target.value)}  placeholder='contraseña'/>

                </div>
                <button id="iniciarSesion-btn">Iniciar Sesión</button>
            </div>
        </form>
    </div>
  )
}

export default Administrador