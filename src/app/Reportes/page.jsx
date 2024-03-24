
"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import ReportesComponente  from "@/components/Reportes";
import React from 'react';
import './Reportes.css';
{/*OTRA COSA, AQUI LA LOGICA DE DESPLEGAR LOS REPORTES, ESTA EN OTRO ARCHIVO, LO HICE COMPONENTE PARA REUZARLO EN VARIAS PARTES, EL COMPONENTE SE LLAMA ReportesComponente */}
export default function Reportes() {
    
    const router = useRouter();
    useEffect(() => {
        const mouse = newV2();
        const center = newV2();
        const distanceFromCenter = newV2();
        const distanceLerped = newV2();
        let simulateMouseMovement = true;

        const perspective = 500;
        const translateZ = -22;
        const rotate = 1.5;
        const skew = 3;

        const containerReportes = document.getElementById("containerReportes");
        const copies = document.getElementsByClassName("copy");

        function updateCenter() {
            const rect = containerReportes.getBoundingClientRect();
            center.x = rect.left + rect.width / 2;
            center.y = rect.top + rect.height / 2;
        }

        function trackMousePosition(event) {
            simulateMouseMovement = false;
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            distanceFromCenter.x = center.x - mouse.x;
            distanceFromCenter.y = center.y - mouse.y;
        }

        function fakeMousePosition(t) {
            distanceFromCenter.x = Math.sin(t / 500) * window.innerWidth * 0.5;
            distanceFromCenter.y = Math.cos(t / 500) * window.innerWidth * 0.2;
        }

        function updateTextPosition(t) {
            if (simulateMouseMovement) fakeMousePosition(t);

            lerpV2(distanceLerped, distanceFromCenter);

            for (var i = 1; i < copies.length + 1; i++) {
                const copy = copies[i - 1];
                copy.style.transform = makeTransformString(
                    i * distanceLerped.y * 0.05,
                    i * translateZ,
                    i * rotate * (distanceLerped.x * 0.003),
                    i * skew * (distanceLerped.x * 0.003)
                );
            }

            requestAnimationFrame(updateTextPosition);
        }

        function makeTransformString(y, z, rotate, skew) {
            return `perspective(${perspective}px) translate3d(0px, ${y}px, ${z}px) rotate(${rotate}deg) skew(${skew}deg)`;
        }

        function lerpV2(position, targetPosition) {
            position.x += (targetPosition.x - position.x) * 0.2;
            position.y += (targetPosition.y - position.y) * 0.2;
        }

        function newV2(x = 0, y = 0) {
            return {
                x: x,
                y: y
            };
        }

        updateCenter();
        document.addEventListener("mousemove", trackMousePosition);
        window.addEventListener("resize", updateCenter);
        requestAnimationFrame(updateTextPosition);

        return () => {
            document.removeEventListener("mousemove", trackMousePosition);
            window.removeEventListener("resize", updateCenter);
        };
    }, [router]);
    return (
        <div className="main-containerReportes">
            <div className="box1" id="box1">
                <div className="containerReportes" id="containerReportes">
                    <header>
                        <h1>Baches Reportados</h1>
                        <span aria-hidden="true" className="copy copy-1">Baches Reportados</span>
                        <span aria-hidden="true" className="copy copy-2">Baches Reportados</span>
                        <span aria-hidden="true" className="copy copy-3">Baches Reportados</span>
                        <span aria-hidden="true" className="copy copy-4">Baches Reportados</span>
                    </header>
                </div>
            </div>
            <div className="box1" id="box1">
                <h2>Bienvenido al área de reportes 🐜</h2>
                <p>
                    Aquí podrás visualizar los reportes hechos por los usuarios de Bachecito 26;
                    también puedes guardar los baches reportados por estos mismos con el icono de la
                    estrellita ⭐ para después verlos en la lista de seguimiento del apartado “Baches
                    Guardados”.
                </p>
            </div>
            <div>

            <ReportesComponente />
            </div>
            
        </div>
    );
}