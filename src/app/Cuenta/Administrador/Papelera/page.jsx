
"use client";
import { useEffect, useState } from "react";
import React from "react";
import "./Reportes.css";
import ReportesAdmin  from "@/components/ReportesE";
import { desc } from "@/scripts/Cifrado/Cifrar";
export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const baseURL = process.env.NEXT_PUBLIC_RUTA_REL
      const res = await fetch(`${baseURL}`);
      const data = await res.json(); // Espera a que se resuelva la promesa
      const dataDesc = data.map(rep => desc(rep))


      setReportes(dataDesc);
    }

    fetchData();
  }, []);
  return (
    <div className="main-containerReportes" style={{ marginTop: "100px" }}>
            <div >
            <ReportesAdmin />
            </div>
    </div>
  );
}
