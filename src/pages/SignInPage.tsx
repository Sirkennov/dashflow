import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();

    // Estados para errores de validación de campos
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const { register, error, setError, loading } = useRegister();

    const validateForm = () => {
        let isValid = true;

        // Validar Nombre de Usuario
        if (displayName.trim() === '') {
            setNameError('El nombre de usuario no puede estar vacío.');
            isValid = false;
        } else {
            setNameError(null);
        }

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

        // Validar Confirmar Contraseña
        if (confirmPassword.trim() === '') {
            setConfirmPasswordError('La confirmación de contraseña no puede estar vacía.');
            isValid = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Las contraseñas no coinciden.');
            isValid = false;
        } else {
            setConfirmPasswordError(null);
        }

        return isValid;
    };

    const handleSignUpSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Ejecutar la validación antes de intentar guardar
        if (!validateForm()) {
            return;
        }

        setError(null);
        // Llama a la función 'register' del hook
        await register(email, password, displayName, () => {
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
                        type="text"
                        placeholder="Nombre"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        id="displayName"
                        name="displayName"
                    />
                    {nameError && <p className="text-sm text-red-500 -mt-3 mb-1">{nameError}</p>}
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
                    <Input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        id="confirmPassword"
                        name="confirmPassword"
                    />
                    {confirmPasswordError && <p className="text-sm text-red-500 -mt-3">{confirmPasswordError}</p>}
                    <Button
                        type="submit"
                        className="bg-red-500 hover:bg-red-700 w-full mb-4 mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
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