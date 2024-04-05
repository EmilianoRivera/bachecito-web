import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import "./globals.css";
import { ContextAuthProvider } from "../../context/AuthContext";
export const metadata = {
  title: "Bachecito 26",
  description: "Página de Bachecito 26, para el reporte de tus baches",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
      <ContextAuthProvider>
        <Navbar />
        
        {children}
        </ContextAuthProvider>
      
     <Cursor />
      </body>
    </html>
  );
}
