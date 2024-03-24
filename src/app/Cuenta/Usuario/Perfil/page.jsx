"use client"
import React, { useState, useEffect } from 'react';

function Perfil() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Perfil</h1>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.nomu_id}>
            Nombre: {usuario.nomu_nombre}, Apellido: {usuario.nomu_appat} {usuario.nomu_apmat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Perfil;
