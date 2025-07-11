import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
}

export const useAuth = (): AuthState => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Limpia la suscripción cuando el componente que usa el hook se desmonte
        return () => unsubscribe();
    }, []);

    return { user, loading };
};