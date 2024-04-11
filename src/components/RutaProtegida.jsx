"use client"
import { useEffect, useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AuthContext from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLogged } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Estado para controlar si el componente se ha montado

  useEffect(() => {
    setIsMounted(true); // Marcar el componente como montado cuando se monta

    // Redirigir solo si el usuario no está autenticado y el componente se monta por primera vez
    console.log(isLogged, " ", isMounted)
    if (!isLogged && isMounted) {
      router.push('/Cuenta');
    } else if (isLogged && isMounted){
      setLoading(false);
    }
  }, [isLogged, isMounted, router]);

  const loadingStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0', // Color de fondo bonito
    fontSize: '30px', // Tamaño de fuente 30px
  };

  return loading ? <div style={loadingStyles}>VALIDANDO DATOS</div> : <>{children}</>;
};

export default ProtectedRoute;
