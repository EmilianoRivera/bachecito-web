import { useEffect, useContext } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter, usePathname } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

export const useAuthUser = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { setisLogged, setIsAdmin } = useContext(AuthContext);
  const showAlert = (message) => {
    const alertContainer = document.createElement("div");
    alertContainer.classList.add("custom-alertCU");

    // Agrega un enlace para mostrar la alerta al hacer clic
    const linkMarkup = `<a href="#" class="alert-link">Contáctanos</a>`;

    alertContainer.innerHTML = `<p>${message} ${linkMarkup}</p>`;
    document.body.appendChild(alertContainer);

    // Maneja el clic en el enlace
    const alertLink = alertContainer.querySelector(".alert-link");
    alertLink.addEventListener("click", handleClick);

    // Elimina la alerta después de cierto tiempo (opcional)
    setTimeout(() => {
      alertContainer.remove();
    }, 8000); // Eliminar la alerta después de 8 segundos
  };
  const handleClick = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace

    // Muestra una alerta al usuario
    const confirmation = confirm(
      "Estás a punto de ser redirigido a tu cuenta de correo electrónico. ¿Deseas continuar?"
    );

    // Si el usuario acepta, abre el cliente de correo
    if (confirmation) {
      const subject = encodeURIComponent(
        "Atención al usuario por BACHECITO 26 - WEB"
      );
      const body = encodeURIComponent(
        "¡Hola GEMMA!👋 Me pongo en contacto con ustedes debido a..."
      );
      window.open(
        "mailto:somos.gemma.01@gmail.com?subject=" + subject + "&body=" + body
      );
    } else {
      // Si el usuario no acepta, no se hace nada
      return;
    }
  };
  useEffect(() => {
    if (pathname === "/Reportes" || pathname === "/" || pathname === "/Sobre_Nosotros") {
      push(pathname);
    } else {
      const unsubscribeAuth = onIdTokenChanged(auth, async (user) => {
        let userLogged = user !== null;

        if (!userLogged) {
          if (pathname === "/Cuenta/Administrador") {
            push(pathname);
          } else {
            push("/Cuenta");
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
            let admin = false;

            if (userData.rol === "admin") {
              admin = true;
              setIsAdmin(admin);
            }

            // Verificar si el correo del usuario está verificado
            const emailVerificado = user.emailVerified;
            console.log("EMAIL:", emailVerificado);
            console.log(user);
            // Actualizar el documento del usuario con la bandera verificado solo si aún no está verificado
            if (emailVerificado === true && userData.verificado !== true) {
              const userDocRef = doc(db, "usuarios", docSnapshot.id);
              await updateDoc(userDocRef, { verificado: true });
            }
            if (userData.inhabilitada) {
              showAlert("Tu cuenta ha sido inhabilitada por hacer un uso indebido del sistema, para cualquier duda o aclaración: ")
              await signOut(auth);
              push("/Cuenta");
              setisLogged(false);
              return;
            }

            if (pathname === "/Cuenta/Administrador" && admin) {
              push("/Cuenta/Administrador/Dashboard");
            } else if (pathname === "/Cuenta/Administrador") {
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

      return () => {
        unsubscribeAuth();
      };
    }
  }, [setisLogged, setIsAdmin, pathname, push]);
};