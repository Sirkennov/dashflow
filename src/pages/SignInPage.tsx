import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const { register, error, setError } = useRegister();

    const handleSignUpSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene el comportamiento por defecto de recarga del formulario

        setError(null);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        // Llama a la función 'register' del hook, pasando el email, la contraseña y el callback de éxito
        await register(email, password, () => {
            navigate('/home'); // Callback que se ejecuta SÓLO si el registro en Firebase es exitoso
        });
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

                {/* Muestra errores si existen, usando el estado 'error' del hook */}
                {error && (
                    <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>
                )}

                <form onSubmit={handleSignUpSubmit}>
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
                        type="submit"
                        className="w-full mb-4 mt-2"
                    >
                        Registrarse
                    </Button>
                </form>

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