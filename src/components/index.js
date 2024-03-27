//estp es para que no se renderize el componente del mapa del lado der servidor, sino del lado del cliente, para que leaflet tenga acceso al DOM 
import dynamic from "next/dynamic";

const Map = dynamic(()=> import('./Map'), {
    ssr:false
})

export default Map