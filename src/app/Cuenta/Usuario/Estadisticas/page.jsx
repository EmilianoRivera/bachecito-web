import Map from "@/components/Map";
<<<<<<< HEAD
=======
import CRep from "@/components/CRepU";
>>>>>>> 28eabae6cc344fab4489c8f152ce162625e7022c
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});
export default function Estadisticas() {
  return (

    <div className="container">
      <div className="izquierda-mapa">


        <div className="filtros">
          <div className="fecha"></div>
          <div className="alcaldia"></div>
          <div className="estado"></div>

        </div>
     <CRep></CRep>

        <div className="estadisticas">

        </div>
      </div>

      <div className="mapa">
        <DynamicMap />
      </div>
    </div>

  );
}
