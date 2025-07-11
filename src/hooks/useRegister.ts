import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface RegisterResult {
    error: string | null;
    // La función register ahora acepta un callback que se ejecuta al éxito
    register: (email: string, password: string, onSuccess: () => void) => Promise<void>;

    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useRegister = (): RegisterResult => {
    const [error, setError] = useState<string | null>(null);

    const register = async (email: string, password: string, onSuccess: () => void) => {
        setError(null); // Resetea cualquier error previo antes de intentar el registro
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Si el registro es exitoso, ejecuta el callback de éxito proporcionado por el componente
            onSuccess();
        } catch (err: any) {
            console.error('Error al registrar usuario (hook):', err.message);
            // Muestra un mensaje de error más amigable basado en el código de error de Firebase
            if (err.code === 'auth/email-already-in-use') {
                setError('El email ya está registrado.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else if (err.code === 'auth/invalid-email') {
                setError('El formato del email es inválido.');
            } else {
                // Para otros errores no específicos, muestra el mensaje completo de Firebase
                setError('Error al registrar usuario: ' + err.message);
            }
        }
    };

    return { register, error, setError };
};