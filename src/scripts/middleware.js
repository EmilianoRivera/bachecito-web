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

const pathnamesWithouthLogin = ['/Cuenta', '/', '/Sobre_Nosotros', '/Reportes', '/Cuenta/Administrador'];

const pathnames = [
  ...pathnamesWithLoginUser,
  ...pathnamesWithLoginAdmin,
  ...pathnamesWithouthLogin,
];

export function middleware(req) {
  const cookieStore = cookies();

  const cookieIsLog = cookieStore.get('b068931cc450442b63f5b3d276ea4297');
  const cookieIsAdmin = cookieStore.get('21232f297a57a5a743894a0e4a801fc3');

  const isLog = cookieIsLog?.value === 'true';
  const isAdmin = cookieIsAdmin?.value === 'true';

  console.log(isAdmin)
  const url = new URL(req.url);
  const path = url.pathname;

  if (!pathnames.includes(path)) {
    return NextResponse.next();
  }

  if (!isLog && !isAdmin) {
    return pathnamesWithouthLogin.includes(path)
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/Cuenta', req.url));
  }

  if (isLog && pathnamesWithLoginUser.includes(path)) {
    return NextResponse.next();
  }

  if (isAdmin && pathnamesWithLoginAdmin.includes(path)) {
    return NextResponse.next();
  }

  if (isLog && !pathnamesWithLoginUser.includes(path)) {
    return NextResponse.redirect(new URL('/Cuenta/Usuario/Perfil', req.url));
  }

  if (isAdmin && !pathnamesWithLoginAdmin.includes(path)) {
    return NextResponse.redirect(new URL('/Cuenta/Administrador/Dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/Cuenta/:path*',
    '/',
    '/Sobre_Nosotros',
    '/Reportes',
    '/Cuenta/Administrador/:path*'
  ],
};
