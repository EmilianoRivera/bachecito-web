import React from 'react'
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("@/components/MapAdmin"), {
  ssr: false,
});

function Mapa() {
  return (
      <div className='container-mapa-admin'>
        <div className='filtros2'>
          <div className="fecha"></div>
          <div className="alcaldia"></div>
          <div className="estado"></div>
        </div>
        <div className='mapa'>
        <DynamicMap className='mapita'/>
        </div>
      </div>
      
      
    )
}

export default Mapa