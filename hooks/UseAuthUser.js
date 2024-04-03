import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { getDocs, collection, query, where } from "firebase/firestore";

export const useAuthUser = () => {
  const { push, pathname } = useRouter();
  const { setisLogged, setIsAdmin } = useContext(AuthContext); 

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      let userLogged = user === null ? false : true;
      if (!userLogged) {
        push("/Cuenta");
        setisLogged(false);
        setIsAdmin(false);
        console.log("Viene por aquí");
      } else {
        setisLogged(true);
        console.log("ID del usuario (UID): ", user.uid);
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("uid", "==", user.uid)); 
        const querySnapshot = await getDocs(q); 

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const userData = docSnapshot.data();
          console.log("Datos del usuario:", userData);

          const isAdmin = userData.rol === "admin";
          setIsAdmin(isAdmin);

          if (pathname === "/Cuenta" && isAdmin) {
            push("/Cuenta/Administrador/Dashboard"); 
          } else if (pathname === "/Cuenta") {
            push("/");
          }
        } else {
          console.log("El documento del usuario no existe en Firestore");
          setIsAdmin(false);
          if (pathname === "/Cuenta") {
            push("/"); 
          }
        }
      }
    });
  }, []);
};
