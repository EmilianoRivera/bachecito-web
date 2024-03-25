import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";

export const useAuthUser = () => {
  const { push, pathname } = useRouter();
  const { setisLogged } = useContext(AuthContext); // Asegúrate de usar el mismo nombre aquí

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      let userLogged = user === null ? false : true;

      if (!userLogged) {
        push("/Cuenta");
        setisLogged(false);
      } else {
        setisLogged(true);
        if (pathname === "/login" || pathname === "/register") {
          push("/");
        }
      }
    });
  }, []);
};
