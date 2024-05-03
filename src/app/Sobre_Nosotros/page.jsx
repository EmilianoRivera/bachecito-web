"use client";
import React, { useEffect } from 'react';
import $ from 'jquery';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 
import "./Sobre_Nosotros.css";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

import { FreeMode, Pagination } from "swiper/modules";

import { RxArrowTopRight } from "react-icons/rx";
import { ServiceData } from "../constants/index.js";

function SobreNosotros() {

  const handleClick = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace

    // Muestra una alerta al usuario
    const confirmation = confirm("Estás a punto de ser redirigido a tu cuenta de correo electrónico, GEMMA no puede acceder a tu información personal de ninguna manera si tu no aceptas ser redirigido, por lo que nos deslindamos de cualquier responsabilidad ¿Deseas continuar? De ser contrario, puedes ponerte en contacto con nosotros por medio del correo somos.gemma.01@gmail.com con el siguiente texto como asunto: Atención al usuario por BACHECITO 26 - WEB");
    
    // Si el usuario acepta, abre el cliente de correo
    if (confirmation) {
        const subject = encodeURIComponent('Atención al usuario por BACHECITO 26 - WEB');
        const body = encodeURIComponent('¡Hola GEMMA!👋 Me pongo en contacto con ustedes debido a...');
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=somos.gemma.01@gmail.com&su=' + subject + '&body=' + body);
    } else {
        // Si el usuario no acepta, no se hace nada
        return;
    }
};


  useEffect(() => {
    AOS.init();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  // Función para manejar el evento onMouseEnter
  const handleMouseEnter = (event) => {
    // Mostrar el texto cuando el mouse entra en la imagen
    $(event.target).next().removeClass('hidden');
  };

  // Función para manejar el evento onMouseLeave
  const handleMouseLeave = (event) => {
    // Ocultar el texto cuando el mouse sale de la imagen
    $(event.target).next().addClass('hidden');
  };


  return (

    <div className='bodySobreNosotros'>
  
      <section id="hero" class="containerSobreNosotros flex-row">
        <div class="hero__content">
          <h1 class="title">
            Acerca de Bachecito 26
          </h1>
          <p class="text">
    Proyecto desarrollado por estudiantes del Centro de
    Estudios Científicos y Tecnológicos 9 Juan de Dios Bátiz;.
  </p>
          <a href="../app/page.jsx" class="btn btn-primary">Inicio</a>
        </div>
        <div class="hero__img">
          <img src="" alt=""/>
        </div>
      </section>
   

 
    <section id="about"class="containerSobreNosotros flex-center flex-column">
      <h5 class="section-subheading">Bachecito 26</h5>
      <h2 class="section-heading text-center">
        ¡Adiós baches! ¡Hola Bachecito 26!
      </h2>
      <div class="features text-center">
        <div class="feature" >
          <div class="feature__icon">
            <i class="fas fa-anchor"></i>
          </div>
          <h3 class="feature__title">Problemática</h3>
          <p class="feature_text">
            La negligencia y la falta de supervisión de los baches 
            en las redes viales secundarias de la alcaldía Azcapotzalco 
            en la Ciudad de México generan dificultades en el tráfico 
            y un aumento en los accidentes viales, a pesar de que el programa 
            de reparación de baches en la Ciudad de México se inició alrededor 
            del año 2000, no se ha recibido la atención adecuada debido a la 
            carga de trabajo causando que el problema se vaya agravando.
          </p>
        </div>
        <div class="feature" >
          <div class="feature__icon">
            <i class="fa-regular fa-file-lines"></i>
          </div>
          <h3 class="feature__title">Objetivo</h3>
          <p class="feature_text">
            Desarrollar una aplicación móvil mediante la cual 
            choferes de transporte público, automovilistas, 
            motociclistas, ciclistas, transeúntes o cualquier 
            otro usuario con diferente medio de transporte que 
            circulen en las vías secundarias de la alcaldía Azcapotzalco 
            ubicada en la CDMX, efectúen el reporte de baches encontrados 
            en estas redes viales para que se facilite la identificación 
            y gestión de los mismos. 
          </p>
        </div>
        <div class="feature" >
          <div class="feature__icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3 class="feature__title">Alcance</h3>
          <p class="feature_text">
            El usuario podrá llenar un formulario dentro del cual 
            se obtendrá su geolocalización facilitando así la precisión 
            de la ubicación del bache encontrado. Una vez enviado el 
            formulario, este quedará almacenado en una base de datos 
            en la nube para así poder realizar una publicación del reporte 
            en nuestro sistema web.
          </p>
        </div>
      </div>
      <div class="about__details flex-center">
        <div class="about__details-content">
          <h1>Propuesta</h1>
          <p>Desarrollar una aplicación móvil mediante la cual los 
            residentes de la alcaldía Azcapotzalco ubicada en la 
            Ciudad de México, puedan realizar reportes de los baches 
            localizados en las vialidades secundarias, de manera que 
            se pueda agilizar el proceso de reportes a las autoridades 
            correspondientes así como facilitarle al usuario la manera 
            de realizarlo.
          </p>
          <p>
            Con esto se busca mejorar el monitoreo continuo de las 
            vías secundarias en la alcaldía Azcapotzalco y evitar 
            accidentes provocados por éste índole.
          </p>
          <a href="#" class="btn btn-primary">Comenzar</a>
        </div>
        <div class="about__details-img">
          <img src="" alt=""/>
        </div>
      </div>
    </section>

    <div className="ruletita">
      <Swiper
        breakpoints={{
          340: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          700: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
        }}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="max-w-[90%] lg:max-w-[80%]"
      >
        {ServiceData.map((item) => (
          <SwiperSlide key={item.title}>
            <div className="cuadro">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.backgroundImage})` }}
              />
              <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-50" />
              <div className="relative flex flex-col gap-3">
                <item.icon className="text-blue-600 group-hover:text-blue-400 w-[32px] h-[32px]" />
                <h1 className="text-xl lg:text-2xl">{item.title} </h1>
                <p className="lg:text-[18px]">{item.content} </p>
              </div>
              <RxArrowTopRight className="absolute bottom-5 left-5 w-[35px] h-[35px] text-white group-hover:text-blue-500 group-hover:rotate-45 duration-100" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    
    <section class="container_Ruleta">

      <div class="row row--center row--margin"/>
          <div class="col-md-4 col-sm-4 price-box price-box--purple">
            <div class="price-box__wrap">
              <div class="price-box__img"></div>
              <h1 class="price-box__title">
                ¿De dónde surge Bachecito 26?
              </h1>
              <p class="price-box__feat">
                  Este proyecto surge a partir de la negligencia y la falta de supervisión de los baches 
                  en las redes viales de la Ciudad de México, ya que generan dificultades en el tráfico y un 
                  aumento en los accidentes viales. A pesar de que el programa de reparación de baches 
                  en la Ciudad de México se inició alrededor del año 2000, no se ha recibido la atención 
                  adecuada debido a la carga de trabajo causando que el problema se vaya agravando especialmente
                  en vías secundarias .
              </p>
              
               <div class="price-box__btn">
              <a id="a" class="btn btn--purple btn--width">¡Saber más!</a>
            </div>
          </div>
        </div>
      </section>
 

    <section 
      id="services" 
      >
      <div class="containerSobreNosotros">
        <h5 class="section-subheading">¿Qué hace</h5>
        <h2 class="section-heading right">BACHECITO 26?
        </h2>
        <div class="services">
          <div class="service">
            <div class="service__icon">
              <i class="fa-solid fa-user"></i>
            </div>
            <h3 class="services__title">Registrar Usuarios</h3>
            <p class="service__text">
              Los residentes de la Ciudad de México pueden cear una cuenta e iniciar sesión en la aplicación.
            </p>
            <div class="arrow-icon">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
          <div class="service">
            <div class="service__icon">
              <i class="fa-solid fa-bullhorn"></i>
            </div>
            <h3 class="services__title">Reportar Baches</h3>
            <p class="service__text">
              Los usuarios de la aplicación pueden reportar los baches encontrados en la  CDMX
            </p>
            <div class="arrow-icon">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
          <div class="service">
            <div class="service__icon">
              <i class="fa-regular fa-clock" ></i>
            </div>
            <h3 class="services__title">Guardar Historial</h3>
            <p class="service__text">
              Bachecito 26 cuenta con un módulo de Historial para los reportes hechos por sus usuarios.
            </p>
            <div class="arrow-icon">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
          <div class="service">
            <div class="service__icon">
              <i class="fa-solid fa-pen"></i>
            </div>
            <h3 class="services__title">Editar Datos</h3>
            <p class="service__text">
              Nuestra aplicación cuenta con un sistema de edición de datos de Nombre y Apellidos.
              Los datos como Fecha de Nacimiento, Correo o Contraseña no son posibles de editar.
            </p>
            <div class="arrow-icon">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
          <div class="service">
            <div class="service__icon">
              <i class="fa-solid fa-flag"></i>
            </div>
            <h3 class="services__title">Enviar Reporte</h3>
            <p class="service__text">
              Todos los reportes de bache realizados por los usuarios de nuestra aplicación
              son eviados a este sistema web en el apartado de Reportes.
            </p>
            <div class="arrow-icon">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
          <div class="service">
            <div class="service__icon">
              <i class="fa-solid fa-map-location"></i>
            </div>
            <h3 class="services__title">Mostrar Mapa</h3>
            <p class="service__text">
              La aplicación te mostrará tu ubicación en un mapa mediante la API de Google Maps
            </p>
            <div class="arrow-icon">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className='Seccion6'>
          <div className="content-inicio-sec6">
            <div className="image-sec6-inicio">
              <img src="https://i.postimg.cc/52xv3gjs/correo.png"/>
            </div>
            <div className="text-sec6-inicio">
              <p>¿Necesitas decirnos algo?<br /><a href="" id="contact-link" onClick={handleClick}>¡Mandanos un correo!</a></p>
            </div>
          </div>
          <div className='marca-copyright'>
            <h3>Desarrollado por GEMMA ©</h3>
          </div>
        </div>

    </div>
  )
}

export default SobreNosotros


