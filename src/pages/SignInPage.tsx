import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Importa la instancia de autenticación de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importa la función de registro

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(null); // Resetea cualquier error previo

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Intenta crear el usuario con email y contraseña
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuario registrado exitosamente!');
      navigate('/login'); // Redirige a la página de login después de un registro exitoso
    } catch (err: any) {
      console.error('Error al registrar usuario:', err.message);
      // Muestra un mensaje de error más amigable basado en el código de error de Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError('El email ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error al registrar usuario: ' + err.message);
      }
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
          Registrarse
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

        <Input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="confirmPassword"
          name="confirmPassword"
        />
          
        <Button 
          type="button" 
          onClick={handleSignUp}
          className="mb-4 mt-2"
        >
          Registrarse
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="#"
              onClick={handleGoToLogin}
              className="inline-block align-baseline font-bold text-sm text-red-500 hover:text-red-800"
            >
              Inicia sesión aquí.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};