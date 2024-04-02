import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import {getDoc, doc} from "firebase/firestore"


export const useAuthUser = () => {
  const { push, pathname } = useRouter();
  const { setisLogged, setIsAdmin } = useContext(AuthContext); // Agregar setIsAdmin

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      let userLogged = user === null ? false : true;
      if (!userLogged) {
        push("/Cuenta");
        setisLogged(false);
        setIsAdmin(false); // Asegúrate de restablecer isAdmin cuando el usuario no esté autenticado
        console.log("viene por aca")
      } else {
        setisLogged(true);
        const docRef = doc(db, "usuarios", user.uid);
        console.log("este es mi docref: ", docRef)
        console.log("este es el usuario: ", user , " este es su uid: ", user.uid)
        getDoc(docRef).then((doc) => {
          console.log("NUEVOOOOOOOOOO", doc)
          if (doc.exists()) {
            const userData = doc.data();
            
            const isAdmin = userData.rol === "admin";
            setIsAdmin(isAdmin);
            if (pathname === "/Cuenta" && isAdmin) {
              push("/Cuenta/Administrador/Dashboard"); // Redireccionar al dashboard del administrador
            } else if (pathname === "/Cuenta") {
              push("/"); // Redireccionar al inicio si el usuario no es administrador
            }
          } else {
            console.log("llega a que es false")
            setIsAdmin(false);
            if (pathname === "/Cuenta") {
              push("/"); // Redireccionar al inicio si el usuario no existe en la base de datos
            }
          }
        }).catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
        });
      }
    });
  }, []);
};
