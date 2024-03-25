"use client"
import { useContext, useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase"; // Asegúrate de importar los objetos 'auth' y 'firestore' de tu configuración de Firebase
import AuthContext from "../../../context/AuthContext";
import { useAuthUser } from "../../../hooks/UseAuthUser";
import { collection, getDocs, query, where} from "firebase/firestore";

export default function Inicio() {
  useAuthUser();
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLogged) {
        try {
          // Realizar la consulta para obtener los datos del usuario
          const userQuery = query(collection(db, 'usuarios'), where('uid', '==', auth.currentUser.uid));
          const userDocs = await getDocs(userQuery);

          // Si hay documentos en el resultado de la consulta
          if (!userDocs.empty) {
            // Obtener el primer documento (debería haber solo uno)
            const userDoc = userDocs.docs[0];
            // Obtener los datos del documento
            const userData = userDoc.data();
            // Establecer los datos del usuario en el estado
            setUserData(userData);
          } else {
            console.log("No se encontró el documento del usuario");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [isLogged]); // Ejecutar el efecto cuando el estado de autenticación cambie

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Cierre de sesión exitoso');
        router.push("/login"); // Redirige al usuario a la página de inicio de sesión
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <div>
      {isLogged && userData && (
        <>
          <h1>Hola, {userData.nombre} {userData.apellidoPaterno} {userData.apellidoMaterno}</h1>
          <button onClick={handleSignOut}>Cerrar sesión</button>
        </>
      )}
      {isLogged && !userData && <p>Cargando datos del usuario...</p>}
      {!isLogged && (
        <p>Hola, no has iniciado sesión</p>
      )}
    </div>
  );
}
