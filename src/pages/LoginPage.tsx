import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Importa la instancia de autenticación
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa la función de inicio de sesión

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null); // Resetea cualquier error previo
    try {
      // Intenta iniciar sesión con email y contraseña
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sesión iniciada exitosamente!');
      navigate('/home'); // ¡Redirige a la página principal después del login!
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err.message);
      // Muestra un mensaje de error más amigable
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email o contraseña incorrectos.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del email es inválido.');
      } else {
        setError('Error al iniciar sesión: ' + err.message);
      }
    }
  };

  const handleGoToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h2>

        {/* Muestra errores si existen */}
        {error && (
          <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
        />

        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          name="password"
        />

        <Button 
            type="button" 
            onClick={handleLogin}
            className="mb-4 mt-2"
        >
          Iniciar Sesión
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a
              href="#"
              onClick={handleGoToSignUp}
              className="inline-block align-baseline font-bold text-sm text-red-500 hover:text-red-800"
            >
              Regístrate aquí.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};