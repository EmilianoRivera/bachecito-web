import { useEffect, useContext, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { getDocs, collection, query, where } from "firebase/firestore";

export const useAuthUser = () => {
  const { pathname } = useRouter();
  const { setisLogged, setIsAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Estado para indicar si la autenticación está en proceso

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { // Si no hay usuario autenticado
        setisLogged(false);
        setIsAdmin(false);
        setLoading(false); // Detener la carga, ya que la autenticación ha finalizado
        return;
      }

      setisLogged(true); // Usuario autenticado

      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const userData = docSnapshot.data();

        const isAdmin = userData.rol === "admin";
        setIsAdmin(isAdmin);

        if (pathname === "/Cuenta" && isAdmin) {
          window.location.replace("/Cuenta/Administrador/Dashboard"); // Redireccionar usando window.location.replace para evitar el historial de navegación
        } else if (pathname === "/Cuenta") {
          window.location.replace("/"); // Redireccionar usando window.location.replace para evitar el historial de navegación
        }
      } else {
        console.log("El documento del usuario no existe en Firestore");
        setIsAdmin(false);
        setLoading(false); // Detener la carga, ya que la autenticación ha finalizado
      }
    });

    return () => unsubscribe(); // Detener el observador de cambios en la autenticación al desmontar el componente
  }, []);

  return { loading }; // Devolver el estado de carga para que el componente pueda manejar la carga
};
