import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Estados para errores de validación de campos
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Usa el hook useLogin
    const { login, error } = useLogin();

    const validateForm = () => {
        let isValid = true;
        // Validar Email
        if (email.trim() === '') {
            setEmailError('El email no puede estar vacío.');
            isValid = false;
        } else {
            setEmailError(null);
        }

        // Validar Contraseña
        if (password.trim() === '') {
            setPasswordError('La contraseña no puede estar vacía.');
            isValid = false;
        } else {
            setPasswordError(null);
        }

        return isValid;
    };


    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página

        // Validar el formulario
        if (!validateForm()) {
            return;
        }

        // Llama a la función 'login' del hook y le pasa el callback de redirección
        await login(email, password, () => {
            navigate('/home'); // Esto se ejecutará SÓLO si el login es exitoso
        });
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

                <form onSubmit={handleLoginSubmit}>
                    <Input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        name="email"
                    />
                    {emailError && <p className="text-sm text-red-500 -mt-3 mb-1">{emailError}</p>}
                    <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                    />
                    {passwordError && <p className="text-sm text-red-500 -mt-3 mb-1">{passwordError}</p>}
                    <Button
                        type="submit"
                        className="bg-red-500 hover:bg-red-700 w-full mb-4 mt-2"
                    >
                        Iniciar Sesión
                    </Button>
                </form>

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
