
import Map from "@/components/Map";
import CRep from "@/components/CRepU";
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
