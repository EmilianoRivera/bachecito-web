
"use client";
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import "../Favoritos/favoritos.css";

function Favoritos() {

  const [showTitles, setShowTitles] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 5; // Ajusta según la altura de tu navbar
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > navbarHeight) {
        setShowTitles(false);
      } else {
        setShowTitles(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='bodyFavoritos'>

      {showTitles && (
        <div className={`titles ${showTitles ? 'show' : 'hide'}`}>
          <h1 id='title-main'>Seguimiento de tus baches guardados 🐜</h1>
          <h2 id='textito'>Aquí podrás visualizar el seguimiento de los baches que has guardado de otros usuarios.</h2>
        </div>
      )}
      
     
        <div className={`container-tipos ${showTitles ? '' : 'margin-top'}`}>

        <div className="column">
          <h3 className='tipo' id='sin-at'>Sin Atender</h3>
        </div>

        <div className="column">
          <h3 className='tipo' id='en-at'>En atención</h3>
        </div>

        <div className="column">
          <h3 className='tipo' id='at'>Atendidos</h3>
        </div>

        </div>


      <div className="scrollable-section">
        <div className="container-reportes">
          <div className="column">
            <div className="reportes-boxes">
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
                        0
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column-right">
                  <div className="column-right-superior">
                    <div className="estado" id='estado-sin-at'>
                    </div>

                    <div className="guardar">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
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
            </div>
          </div>

          <div className="column">
            <div className="reportes-boxes">
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
                        0
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column-right">
                  <div className="column-right-superior">
                    <div className="estado" id='estado-en-at'>
                    </div>

                    <div className="guardar">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
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
            </div>
          </div>

          <div className="column">
            <div className="reportes-boxes">
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
                        0
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column-right">
                  <div className="column-right-superior">
                    <div className="estado" id='estado-at'>
                    </div>

                    <div className="guardar">
                      <img
                        src="https://i.postimg.cc/W335wqws/estrella-2.png"
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
            </div>
          </div>
        </div>
    </div>
      

    </div>
  );
}

export default Favoritos;


