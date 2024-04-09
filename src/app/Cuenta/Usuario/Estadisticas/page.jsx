import Map from "@/components/Map";
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

        <div className="totalReportes">
          <div className="encabezado">
            <h1>REPORTES TOTALES:</h1>
            <div className="contador">    </div>
          </div>
          <div className="estados">
            <div className="in-red">
              <div className="red"><span class="tooltip">Sin atender</span></div>
              <div className="cont-reportes">   </div>
            </div>
            <div className="in-yellow">
              <div className="yellow"><span class="tooltip">En atención</span></div>
              <div className="cont-reportes">   </div>
            </div>
            <div className="in-green">
              <div className="green"><span class="tooltip">Atendido</span></div>
              <div className="cont-reportes">   </div>
            </div>
          </div>
        </div>

        <div className="estadisticas">

        </div>
      </div>

      <div className="mapa">
        <DynamicMap />
      </div>
    </div>

  );
}
