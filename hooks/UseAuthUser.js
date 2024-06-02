import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter , usePathname} from "next/navigation";
import AuthContext from "../context/AuthContext";
import { getDocs, collection, query, where } from "firebase/firestore";
import { path } from "animejs";

export const useAuthUser = () => {
  //hooks del router y del context
  const { push } = useRouter();
  const pathname = usePathname();
  const { setisLogged, setIsAdmin } = useContext(AuthContext); 
  

  useEffect(() => {

    if(pathname === "/Reportes" || pathname === "/" || pathname === "/Sobre_Nosotros" ){
      push(pathname)
    }  else { 
      onAuthStateChanged(auth, async (user) => {
        let userLogged = user === null ? false : true;
  
        if (!userLogged) {
          if (pathname === "/Cuenta/Administrador") {
            push(pathname)
          } else {

            push("/Cuenta")
          }
          setisLogged(false);
          
          setIsAdmin(false);
        } else {
          setisLogged(true);
          const usuariosRef = collection(db, "usuarios");
          const q = query(usuariosRef, where("uid", "==", user.uid)); 
          const querySnapshot = await getDocs(q); 
  
          if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0];
            const userData = docSnapshot.data();
            let admin;
            if(userData.rol === "admin"){
              admin = userData.rol
              setIsAdmin(admin);
            } 
            
  
            if (pathname === "/Cuenta/Administrador" && admin) {
              push("/Cuenta/Administrador/Dashboard"); 
            } 
            else if (pathname === "/Cuenta/Administrador") {
              push("/");
            }
          } else {
            console.log("El documento del usuario no existe");
            setIsAdmin(false);
            if (pathname === "/Cuenta") {
              push("/"); 
            }
          }
        }
      });
  
    }
  }, [setisLogged, setIsAdmin]);
};
