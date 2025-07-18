import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface CustomUser extends User {
    displayName: string | null; // Añade la propiedad displayName
}

interface AuthState {
    user: CustomUser | null; // El user puede ser CustomUser o User
    loading: boolean;
}

export const useAuth = (): AuthState => {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Si hay un usuario autenticado, intenta obtener su displayName de Firestore
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        // Asigna el displayName del Firestore o un fallback
                        const customUser: CustomUser = {
                            ...currentUser,
                            displayName: userData.displayName || null,
                        };
                        setUser(customUser);
                    } else {
                        // Si por alguna razón no encuentra el documento en Firestore
                        const customUser: CustomUser = {
                            ...currentUser,
                            displayName: null, // O un valor por defecto
                        };
                        setUser(customUser);
                        console.warn("No se encontró el documento de usuario en Firestore para UID:", currentUser.uid);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del usuario de Firestore:", error);
                    // Si hay un error, aún así establece el usuario (sin displayName)
                    const customUser: CustomUser = {
                        ...currentUser,
                        displayName: null,
                    };
                    setUser(customUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
};
