"use client"
import CRep from "@/components/CRepU";
import dynamic from "next/dynamic";
import Circular from "@/components/Circular2";
const DynamicMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
});
export default function  MapAdmin() {
  return (

    <div className="container">
      <div className="izquierda-mapa">
      <Circular></Circular>
      </div>


        <DynamicMap />
      
    </div>

  );
}