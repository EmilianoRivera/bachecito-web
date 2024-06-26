"use client"
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
//comentario que no sirve de nada
function ilusion (){
    return (
        <div>
            <Link href="/" className="bachecito26">
            <img
            src="https://i.postimg.cc/T3NQg97V/Logo.png"
            alt="Logo Bachecito 26"
            className="nopelien"
            />
            BACHECITO 26
            </Link>
            <div className='ilusion'></div>
        </div>
    );
}