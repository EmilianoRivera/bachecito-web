
"use client"
import ReportesAdmin  from "@/components/ReportesAdmin";
import React from 'react';
import './Reportes.css';
import RutaProtegida from "@/components/RutaProtegida";

{/*OTRA COSA, AQUI LA LOGICA DE DESPLEGAR LOS REPORTES, ESTA EN OTRO ARCHIVO, LO HICE COMPONENTE PARA REUZARLO EN VARIAS PARTES, EL COMPONENTE SE LLAMA ReportesComponente */}
export default function Reportes() {
    
    
    return (
       
        <div className="main-containerReportes">
            <div className='filtros2'>
                <div className="fecha"></div>
                <div className="alcaldia"></div>
                <div className="estado"></div>
            </div>
            <div>
            <ReportesAdmin />
            </div>
            
        </div>
       
    );
}