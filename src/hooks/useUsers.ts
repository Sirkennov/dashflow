import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  type DocumentData 
} from 'firebase/firestore';
import { db } from '../firebase'; 

export interface UserData extends DocumentData {
    id: string; 
    name: string;
    lastName: string;
    salary: string;
    country: string;
    city: string;
}

interface UseUsersResult {
    users: UserData[];
    loading: boolean;
    error: string | null;
}

export const useUsers = (): UseUsersResult => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true); 
        setError(null); 

        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, orderBy('name', 'asc')); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: UserData[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data(); 
                usersData.push({
                    id: doc.id,
                    name: data.name,
                    lastName: data.lastName,
                    salary: data.salary,
                    country: data.country,
                    city: data.city,
                });
            });
            setUsers(usersData);
            setLoading(false); 
        }, (err) => {
            console.error("Error fetching users from Firestore:", err);
            setError("Error al cargar usuarios: " + err.message); 
            setLoading(false); 
        });

        return () => unsubscribe();
    }, []); 

    return { users, loading, error };
};
