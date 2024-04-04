import Map from "@/components/Map";

import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});
export default function Estadisticas() {
  return (
      <div className="container">
        <div className="filtros">
          <div className="fecha"></div>
          <div className="alcaldia"></div>
          <div className="estado"></div>
          <div className="totalReportes"></div>
        </div>
        <div className="estadisticas"></div>
        <div className="mapa" style={{ marginTop: "80px" }}>
          <DynamicMap />
        </div>
      </div>
  );
}
