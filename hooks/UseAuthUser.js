import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { getDocs, collection, query, where } from "firebase/firestore";

export const useAuthUser = () => {
  const { push, pathname } = useRouter();
  const { setisLogged, setIsAdmin } = useContext(AuthContext); // Agregar setIsAdmin

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      let userLogged = user === null ? false : true;
      if (!userLogged) {
        push("/Cuenta");
        setisLogged(false);
        setIsAdmin(false); // Asegúrate de restablecer isAdmin cuando el usuario no esté autenticado
        console.log("Viene por aquí");
      } else {
        setisLogged(true);
        console.log("ID del usuario (UID): ", user.uid);
        // Crear una consulta para obtener el documento del usuario en Firestore
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("uid", "==", user.uid)); // Consulta para encontrar el documento con el UID del usuario
        const querySnapshot = await getDocs(q); // Cambio aquí: getDocs en lugar de getDoc

        if (!querySnapshot.empty) {
          // Obtener el primer documento (debería haber solo uno)
          const docSnapshot = querySnapshot.docs[0];
          const userData = docSnapshot.data();
          console.log("Datos del usuario:", userData);

          // Verificar si el usuario es administrador y establecer el estado correspondiente
          const isAdmin = userData.rol === "admin";
          setIsAdmin(isAdmin);

          // Redireccionar según el rol del usuario y la ruta actual
          if (pathname === "/Cuenta" && isAdmin) {
            push("/Cuenta/Administrador/Dashboard"); // Redireccionar al dashboard del administrador
          } else if (pathname === "/Cuenta") {
            push("/"); // Redireccionar al inicio si el usuario no es administrador
          }
        } else {
          console.log("El documento del usuario no existe en Firestore");
          setIsAdmin(false);
          if (pathname === "/Cuenta") {
            push("/"); // Redireccionar al inicio si el usuario no existe en la base de datos
          }
        }
      }
    });
  }, []);
};
