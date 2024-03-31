"use client";
import React, { useState, useEffect } from 'react';
import './perfil.css';


function Perfil() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showLeftSide, setShowLeftSide] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);


  useEffect(() => {
    // Handler para el cambio de tamaño de la ventana
    function handleResize() {
      const width = window.innerWidth;
      setWindowWidth(width);


      if (width <= 800) {
        setShowLeftSide(false);
        setShowToggleButton(true);
      } else {
        setShowLeftSide(true);
        setShowToggleButton(false);
      }
    }


    // Configuración inicial
    handleResize();


    // Agregar el listener del evento resize
    window.addEventListener('resize', handleResize);


    // Limpieza del listener del evento resize
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };


  return (
    <div className="container-perfil">
      <div id="leftSide" style={{ display: showLeftSide ? 'block' : 'none' }}>
        <div class="profile-card">
          <div class="profile-image">
            <img src="https://i.pinimg.com/564x/34/f9/c2/34f9c2822cecb80691863fdf76b29dc0.jpg" alt="Imagen de perfil"/>
          </div>
          <div class="profile-details">
            <div class="nombre">Nombre (s) </div>
            <div class="name-fields">
              <div class="field appat">Apellido</div>
              <div class="field apmat">Apellido</div>
            </div>
            <div class="fecha-nac">fecha-nac: </div>
            <div class="email">correo@gmail.com</div>
            <div class="buttons">
              <button class="cerrar-sesion-btn">Cerrar Sesión</button>
              <button class="desactivar-cuenta-btn">Desactivar Cuenta</button>
            </div>
          </div>
        </div>
      </div>
      <div className='line-vertical'></div>
      <div className="right-side">
        <div className='encabezado-historial'>
          <h2>Tu historial de reportes:</h2>
        </div>
                <div className="box2" id="box2">
                    <div className="column-left">
                        <div className="fotografía">
                            <img src="" alt="" />
                        </div>
                        <div className="column-left-inferior">
                            <div className="fecha">


                            </div>


                            <div className="contador">
                                <div className="icon">
                                    <img
                                        src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                                        className="logo"
                                    />
                                </div>
                                <div className="number">


                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="column-right">
                        <div className="column-right-superior">
                            <div className="estado">


                            </div>


                            <div className="guardar">
                                    <img
                                        src="https://i.postimg.cc/52PmmT4T/estrella.png"
                                        className="icon-star"
                                    />
                            </div>
                        </div>


                        <div className="ubicacion">
                            <h3>Ubicación</h3>
                            <div className="box-ubi">


                            </div>
                        </div>


                        <div className="descripcion">
                            <h3>Descripción</h3>
                            <div className="box-des">


                            </div>
                        </div>
                    </div>
                </div>
                <div className="box2" id="box2">
                    <div className="column-left">
                        <div className="fotografía">
                            <img src="" alt="" />
                        </div>
                        <div className="column-left-inferior">
                            <div className="fecha">


                            </div>


                            <div className="contador">
                                <div className="icon">
                                    <img
                                        src="https://i.postimg.cc/s2ZYz740/exclamacion-de-diamante.png"
                                        className="logo"
                                    />
                                </div>
                                <div className="number">


                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="column-right">
                        <div className="column-right-superior">
                            <div className="estado">


                            </div>


                            <div className="guardar">
                                    <img
                                        src="https://i.postimg.cc/52PmmT4T/estrella.png"
                                        className="icon-star"
                                    />
                            </div>
                        </div>


                        <div className="ubicacion">
                            <h3>Ubicación</h3>
                            <div className="box-ubi">


                            </div>
                        </div>


                        <div className="descripcion">
                            <h3>Descripción</h3>
                            <div className="box-des">


                            </div>
                        </div>
                    </div>
                </div>  
                {showToggleButton && (
        <button id="toggleButton" onClick={toggleLeftSide}>
          {showLeftSide ? (
            <img src="https://i.postimg.cc/kMxkBZBm/angulo-izquierdo.png" alt="Cerrar" />
          ) : (
            <img src="https://i.postimg.cc/NMkBsTBm/angulo-derecho.png" alt="Abrir" />
          )}
        </button>
      )}
      </div>
     
    </div>
  );
}


export default Perfil;