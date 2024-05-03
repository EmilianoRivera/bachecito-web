
"use client";
import { useEffect, useState } from "react";
import React from "react";
import "./Reportes.css";
import ReportesAdmin  from "@/components/ReportesAdmin";

export default function Reportes() {
  
  return (
    <div className="main-containerReportes" style={{ marginTop: "100px" }}>
            <div >
            <ReportesAdmin />
            </div>
    </div>
  );
}
