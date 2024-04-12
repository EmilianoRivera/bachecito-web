"use client"
import CRep from "@/components/CRepU";
import dynamic from "next/dynamic";
import Circular from "@/components/Circular2";
const DynamicMap = dynamic(() => import("@/components/MapAdmin"), {
  ssr: false,
});
export default function  MapAdmin() {
  return (

    <div className="container-mapa-admin">
      <DynamicMap />
      <Circular></Circular>
    </div>

  );
}