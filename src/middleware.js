import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const pathnamesWithLoginUser = [
  '/Cuenta/Usuario/Estadisticas',
  '/Cuenta/Usuario/Favoritos',
  '/Cuenta/Usuario/Perfil',
  '/Cuenta/Usuario/Reportar',
  '/Cuenta/Usuario/Reportes',
];

const pathnamesWithLoginAdmin = [
  '/Cuenta/Administrador/Dashboard',
  '/Cuenta/Administrador/Mapa',
  '/Cuenta/Administrador/NuevoAdmin',
  '/Cuenta/Administrador/Papelera',
  '/Cuenta/Administrador/Reportes',
  '/Cuenta/Administrador/Soporte',
  '/Cuenta/Administrador/Usuarios',
];

const pathnamesWithoutLogin = ['/Cuenta', '/', '/qr',  '/Reportes', '/Cuenta/Administrador'];

export function middleware(req) {
  const cookieStore = cookies();

  const cookieIsLog = cookieStore.get('b068931cc450442b63f5b3d276ea4297');
  const cookieIsAdmin = cookieStore.get('21232f297a57a5a743894a0e4a801fc3');

  const isLog = cookieIsLog?.value === 'true';
  const isAdmin = cookieIsAdmin?.value === 'true';

  const url = new URL(req.url);
  const path = url.pathname;

/*   console.log('Path:', path);
  console.log('isLog:', isLog);
  console.log('isAdmin:', isAdmin); */

  // Si la ruta no requiere login
  if (pathnamesWithoutLogin.includes(path)) {
    //console.log('Ruta pública, permitiendo acceso.');
    return NextResponse.next();
  }

  // Si la ruta requiere login de usuario
  if (pathnamesWithLoginUser.includes(path)) {
    if (isLog) {
     // console.log('Ruta de usuario con sesión iniciada, permitiendo acceso.');
      return NextResponse.next();
    } else {
   //   console.log('Ruta de usuario sin sesión, redirigiendo a /Cuenta.');
      return NextResponse.redirect(new URL('/Cuenta', req.url));
    }
  }

  // Si la ruta requiere login de administrador
  if (pathnamesWithLoginAdmin.includes(path)) {
    if (isAdmin) {
     // console.log('Ruta de administrador con sesión iniciada, permitiendo acceso.');
      return NextResponse.next();
    } else {
      //console.log('Ruta de administrador sin sesión, redirigiendo a /Cuenta.');
      return NextResponse.redirect(new URL('/Cuenta', req.url));
    }
  }

  // Redirección por defecto
  if (isLog) {
   // console.log('Usuario logueado pero ruta no permitida, redirigiendo a /Cuenta/Usuario/Perfil.');
    return NextResponse.redirect(new URL('/Cuenta/Usuario/Perfil', req.url));
  }

  if (isAdmin) {
 //   console.log('Administrador logueado pero ruta no permitida, redirigiendo a /Cuenta/Administrador/Dashboard.');
    return NextResponse.redirect(new URL('/Cuenta/Administrador/Dashboard', req.url));
  }

  //console.log('No logueado, redirigiendo a /Cuenta.');
  return NextResponse.redirect(new URL('/Cuenta', req.url));
}

export const config = {
  matcher: [
    '/Cuenta/:path*',
    '/',
    '/qr',
 
    '/Reportes',
    '/Cuenta/Administrador/:path*'
  ],
};
