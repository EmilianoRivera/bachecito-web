"use client";
import React, { useState } from 'react';
import RutaProtegida from "@/components/RutaProtegida";
import "./Soporte.css";

function Soporte() {
  const [mostrarDetalle1, setMostrarDetalle1] = useState(false);
  const [mostrarDetalle2, setMostrarDetalle2] = useState(false);
  const [mostrarDetalle3, setMostrarDetalle3] = useState(false);
  const [mostrarDetalle4, setMostrarDetalle4] = useState(false);

  const toggleDetalle1 = () => {
    setMostrarDetalle1(!mostrarDetalle1);
  };

  const toggleDetalle2 = () => {
    setMostrarDetalle2(!mostrarDetalle2);
  };

  const toggleDetalle3 = () => {
    setMostrarDetalle3(!mostrarDetalle3);
  };

  const toggleDetalle4 = () => {
    setMostrarDetalle4(!mostrarDetalle4);
  };

  // Función para cambiar la imagen
  const obtenerImagen1 = () => {
    return mostrarDetalle1 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
  };

  const obtenerImagen2 = () => {
    return mostrarDetalle2 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
  };

  const obtenerImagen3 = () => {
    return mostrarDetalle3 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
  };

  const obtenerImagen4 = () => {
    return mostrarDetalle4 ? 'https://i.postimg.cc/wB2S0JqV/triangulo-1.png' : 'https://i.postimg.cc/Z5XxTn6Y/triangulo.png';
  };

  return (
    <RutaProtegida>
      <div className="bodySoporte">
        <div className="containerSoporte">
          <div className='containerPF'>
            <h1 id='titulo_pf'>PREGUNTAS FRECUENTES 👀❓❓❓</h1>

            <div className='container_preguntaFrecuente'>
              <div className='pf'>
                <p>1.- ¿Cómo instalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen1()} alt="" onClick={toggleDetalle1}/>
              </div>
              {mostrarDetalle1 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 1.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
                    <br/>
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className='container_preguntaFrecuente'>
              <div className='pf'>
                <p>2.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen2()} alt="" onClick={toggleDetalle2}/>
              </div>
              {mostrarDetalle2 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 2.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
                    <br/>
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className='container_preguntaFrecuente'>
              <div className='pf'>
                <p>2.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen3()} alt="" onClick={toggleDetalle3}/>
              </div>
              {mostrarDetalle3 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 2.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
                    <br/>
                  </p>
                </div>
              )}
            </div>

            <br/>

            <div className='container_preguntaFrecuente'>
              <div className='pf'>
                <p>2.- ¿Cómo desinstalo la app móvil de Bachecito 26?</p>
                <img src={obtenerImagen4()} alt="" onClick={toggleDetalle4}/>
              </div>
              {mostrarDetalle4 && (
                <div className="descripcion_pf">
                  <p>
                    <br />
                    Detalle de la respuesta a la pregunta frecuente 2.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum aspernatur inventore optio cumque eius. Quisquam facilis quo possimus omnis veniam, provident odit architecto dolore, minima, placeat maiores alias sed recusandae.
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti suscipit labore quo molestiae quis illo sunt nulla cupiditate magni voluptatem eos aliquam impedit mollitia officia, minus distinctio ullam voluptates earum?
                    <br/>
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </RutaProtegida>
  );
}

export default Soporte;
