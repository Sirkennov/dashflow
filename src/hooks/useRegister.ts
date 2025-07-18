import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface RegisterResult {
    error: string | null;
    loading: boolean;
    register: (email: string, password: string, displayName: string, onSuccess: () => void) => Promise<void>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useRegister = (): RegisterResult => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const register = async (email: string, password: string, displayName: string, onSuccess: () => void) => {
        setError(null);
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guarda información adicional del usuario en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: displayName,
                createdAt: new Date(),
            });

            onSuccess();
        } catch (err: any) {
            console.error('Error al registrar usuario (hook):', err.message);
            if (err.code === 'auth/email-already-in-use') {
                setError('El email ya está registrado.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else if (err.code === 'auth/invalid-email') {
                setError('El formato del email es inválido.');
            } else {
                setError('Error al registrar usuario: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return { register, error, loading, setError };
};