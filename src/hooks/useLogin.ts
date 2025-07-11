import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginResult {
    error: string | null;
    login: (email: string, password: string, onSuccess: () => void) => Promise<void>;
}

export const useLogin = (): LoginResult => {
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string, onSuccess: () => void) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onSuccess();
        } catch (err: any) {
            console.error('Error al iniciar sesión (hook):', err.message);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Email o contraseña incorrectos.');
            } else if (err.code === 'auth/invalid-email') {
                setError('El formato del email es inválido.');
            } else {
                setError('Error al iniciar sesión: ' + err.message);
            }
        } finally {
        }
    };

    return { login, error };
};