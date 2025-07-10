// src/pages/HomePage.tsx
import React from 'react';
import { auth } from '../firebase'; // Importa la instancia de autenticación
import { signOut } from 'firebase/auth'; // Importa la función de cerrar sesión
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra la sesión del usuario
      console.log('Sesión cerrada exitosamente!');
      navigate('/login'); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Bienvenido a tu Dashboard!
        </h1>
        <p className="text-gray-600 mb-6">
          Has iniciado sesión exitosamente. Aquí es donde irá el contenido principal de tu aplicación.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};